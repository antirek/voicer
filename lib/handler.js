'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    Q = require('q'),
    ContextWrapper = require('./contextWrapper');

var Handler = function (source, recognizer, config) {

    var counter = 1;
    var logger;
    var sounds = config.asterisk['sounds'];

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

        var contextWrapper = new ContextWrapper(context);
        var filename = uuid.v4();

        var stepGreeting = function () {            
            log('stepGreeting');
            return contextWrapper.answer()
                .then(function () {
                    if (config.processing['playGreeting']) {
                        return contextWrapper.streamFile(sounds['greeting'], '#');
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
            return contextWrapper.recordFile(filepath, conf['type'], '#', conf['duration'], 0, beep, '');
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

        var stepDial = function (channel) {
            log('stepDial', channel);
            return contextWrapper.dial(channel);
        };

        var stepFinish = function () {
            log('stepFinish');
            return contextWrapper.end();
        };

        var stepError = function (error) {
            log('stepError', error);
            return contextWrapper.streamFile('invalid', '#');
        };

        var stepRepeatOnError = function (error) {
            log('stepRepeatOnError', error);
            return contextWrapper.streamFile('invalid', '#');                
        };

        var FlowProcess = function () {            
            return stepRecord()
                .then(stepRecognize)
                .then(stepLookup)
                .then(stepDial)
                .then(stepFinish)
        };

        var loop = function (promise) {            
            if (currentAttempt < totalAttempts) {
                currentAttempt++;

                return promise()
                    .fail(function (error) {                        
                        return stepRepeatOnError(error)
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
                        return stepError(error)
                            .then(stepFinish);
                    });
            }
        };        

        contextWrapper.on('variables')
            .then(function () {
                log('-- start processing');
                return stepGreeting()
            })         
            .then(function () {
                return loop(FlowProcess);
            });

        contextWrapper.on('error')
            .then(function () {
                log('-- error');
                return stepFinish();
            });

        contextWrapper.on('close')
            .then(function () {
                log('-- close');
            });

        contextWrapper.on('hangup')
            .then(function () {
                log('-- hangup');
                return stepFinish();
            });
    };
};

module.exports = Handler;