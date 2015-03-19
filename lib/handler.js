'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    Q = require('q'),
    ContextWrapper = require('./contextWrapper');

var Handler = function (source, recognizer, config) {

    var counter = 1;
    var logger;

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
            totalAttempts = config['totalAttempts'] || 1;

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
                    return contextWrapper.streamFile('beep', '#');
                });
        };

        var stepRecord = function () {
            var conf = config.record,
                filepath = conf['directory'] + '/' + filename;
            log('stepRecord', filepath);
            return contextWrapper.recordFile(filepath, conf['type'], '#', conf['duration']);
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

        var FlowProcess = function () {            
            return stepGreeting()
                .then(stepRecord)
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
                        return stepError(error)
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
                        log('error', error)
                        return stepFinish();
                    });
            }
        };

        return contextWrapper.on('variables')            
            .then(function () {
                log('-- start processing');
                return loop(FlowProcess);
            });          
    };
};

module.exports = Handler;