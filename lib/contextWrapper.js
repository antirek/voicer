'use strict';

var Q = require('q');

var ContextWrapper = function (context) {
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
    
    this.recordFile = function (filename, format, escape_digits, timeout, offset, beep, silence) {
        var defer = Q.defer();
        context.recordFile(filename, format, escape_digits, timeout, offset, beep, silence, function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve();
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

module.exports = ContextWrapper;