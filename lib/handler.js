'use strict';

var path = require('path'),
    uuid = require('node-uuid'),    
    Q = require('q'),
    ContextWrapper = require('./contextWrapper');

var Handler = function (source, recognizer, config) {
    this.handle = function (context) {        
        var contextWrapper = new ContextWrapper(context);

        var filename = uuid.v4();

        var stepGreeting = function () {
            return contextWrapper.answer()
                .then(function () {
                    return contextWrapper.streamFile('beep', '#');
                });
        };

        var stepRecord = function () {
            var conf = config.record,                
                filepath = conf['directory'] + '/' + filename;

            return contextWrapper.recordFile(filepath, conf['type'], '#', conf['duration']);
        };

        var stepRecognize = function () {            
            var conf = config.recognize,
                file = conf['directory'] + '/' + filename + '.wav';

            return recognizer.recognize(file);
        };
      
        var stepLookup = function (text) {            
            return source.lookup(text);
        };

        var stepDial = function (channel) {
            return contextWrapper.dial(channel);
        };

        var stepFinish = function () {            
            return contextWrapper.end();
        };

        var stepError = function () {
            return contextWrapper.streamFile('invalid', '#')
                .then(function (result) {
                    return contextWrapper.end();
                });
        }; 

        return contextWrapper.on('variables')
            .then(stepGreeting)
            .then(stepRecord)
            .then(stepRecognize)
            .then(stepLookup)
            .then(stepDial)
            .then(stepFinish)
            .fail(stepError);
    };
};

module.exports = Handler;