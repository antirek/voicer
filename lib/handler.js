'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    //async = require('async'),
    Q = require('q');

var ContextPromiseWrapper = function (context) {
    this.on = function (eventName) {
        var defer = Q.defer();
        context.on(eventName, function (result) {
            defer.resolve(result);
        });
        return defer.promise;
    };
    this.answer = function () {
        var defer = Q.defer();
        context.answer(function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    };
    this.streamFile = function (filename, acceptDigits) {
        var defer = Q.defer();
        context.streamFile(filename, acceptDigits, function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    };
    this.recordFile = function (filename, format, escape_digits, timeout) {
        var defer = Q.defer();
        context.recordFile(filename, format, escape_digits, timeout, function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(filename);
            }
        });
        return defer.promise;
    };
    this.setVariable = function (varName, value) {
        var defer = Q.defer();
        context.setVariable(varName, value, function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    };
    this.dial = function (channel, timeout, params) {
        var defer = Q.defer();
        context.dial(channel, timeout, params, function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    };
    this.end = function () {
        var defer = Q.defer();
        context.end(function () {
            defer.resolve();
        });
        return defer.promise;
    };
};


var Handler = function (finder, recognizer, config) {

    this.handle = function (context) {

        var contextWrapper = new ContextPromiseWrapper(context);

        var stepGreeting = function () {
            return contextWrapper.answer()
                .then(function () {
                    return contextWrapper.streamFile('beep', '#');
                });
        };

        var stepRecord = function () {
            var conf = config.record, 
                filename = uuid.v4(),
                filepath = conf['directory'] + '/' + filename;

            return contextWrapper.recordFile(filepath, conf['type'], '#', conf['duration']);
        };

        var stepRecognize = function (filename) {
            var conf = config.recognize,
                file = conf['directory'] + '/' + filename + '.wav';

            return recognizer.recognize(filename + '.wav');
        };
      
        var stepLookup = function (text) {
            return finder.lookup(text);
        };

        var stepDial = function (channel) {
            return contextWrapper.dial(channel);
        };

        var stepFinish = function () {            
            return contextWrapper.end();
        };

        var stepError = function (){
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