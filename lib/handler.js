'use strict';

var path = require('path'),
    uuidv4 = require('uuid/v4'),
    Q = require('q');

var Handler = function (source, recognizer, config) {

    var counter = 1;
    var logger;
    var sounds = config.asterisk['sounds'];
    var dialplanVars = config.asterisk['recognitionDialplanVars'];

    var getCallId = function () {
        var length = 7;
        //magic from https://gist.github.com/aemkei/1180489#file-index-js
        var q = function (a, b) {
            return([1e15]+a).slice(-b)
        };
        return q(counter++, length);
    };

    this.setLogger = function (loggerIn) {
        logger = loggerIn;
    };

    this.handle = function (context) {
        
        var callId = getCallId();
        var currentAttempt = 1,
            totalAttempts = config.processing['totalAttempts'] || 1;

        function log(message, object) {
            if (logger) {                
                if (object) {
                    logger.info(callId, message, object);
                } else {
                    logger.info(callId, message);
                }
            }
        };

        if (logger) {
            recognizer.setLogFunction(log);
        }
        
        var filename = uuidv4();

        var stepGreeting = function () {            
            log('stepGreeting');
            return context.answer()
                .then(function () {
                    if (config.processing['playGreeting']) {
                        return context.streamFile(sounds['greeting'], '#');
                    } else {
                        return Q.resolve();
                    }
                });
        };        

        var stepRecord = function () {
            var conf = config.record,
                filepath = conf['directory'] + '/' + filename;
            var beep = (config.processing['playBeepBeforeRecording']) ? 'beep' : '';

            log('stepRecord', filepath);
            return context.recordFile(filepath, conf['type'], '#', conf['duration'], 0, beep, '');
        };

        var stepRecognize = function () {
            var conf = config.recognize,
                file = conf['directory'] + '/' + filename + '.wav';

            log('stepRecognize', file);
            return recognizer.recognize(file);
        };
      
        var stepLookup = function (text) {
            log('stepLookup', text);
            return source.lookup(text);
        };        

        var stepFinish = function () {
            log('stepFinish');
            return context.end();
        };

        var stepErrorBeforeFinish = function (error) {
            log('stepError', error);
            return context.streamFile(sounds['onErrorBeforeFinish'], '#');
        };

        var stepErrorBeforeRepeat = function (error) {
            log('stepRepeatOnError', error);
            return context.streamFile(sounds['onErrorBeforeRepeat'], '#');
        };

        var stepSuccess = function (object) {            
            log('stepSuccess', object);
            return context.setVariable(dialplanVars['status'], 'SUCCESS')
                .then(function () {
                    return context.setVariable(dialplanVars['target'], object.target);
                });
        };

        var stepSetFailedVars = function () {
            log('stepSetFailedVars');
            return context.setVariable(dialplanVars['status'], 'FAILED');                
        };

        var FlowProcess = function () {
            return stepRecord()
                .then(stepRecognize)
                .then(stepLookup)
                .then(stepSuccess)
                .then(stepFinish)
        };

        var loop = function (promise) {
            if (currentAttempt < totalAttempts) {
                currentAttempt++;

                return promise()
                    .fail(function (error) {
                        return stepErrorBeforeRepeat(error)
                            .then(function () {
                                log('fail, make next attempt', {
                                        current: currentAttempt, total: totalAttempts
                                    });
                                return loop(promise);
                            });
                    });
            } else {
                return promise()
                    .fail(function (error) {
                        return stepErrorBeforeFinish(error)
                            .then(stepFinish);
                    });
            }
        };        

        context.onEvent('variables')
            .then(function (variables) {
                log('-- start processing');
                log('variables', JSON.stringify(variables));
                return stepSetFailedVars()
                    .then(stepGreeting);
            })         
            .then(function () {
                return loop(FlowProcess);
            });

        context.onEvent('error')
            .then(function () {
                log('-- error');
                return stepFinish();
            });

        context.onEvent('close')
            .then(function () {
                log('-- close');
            });

        context.onEvent('hangup')
            .then(function () {
                log('-- hangup');
                return stepFinish();
            });
    };
};

module.exports = Handler;