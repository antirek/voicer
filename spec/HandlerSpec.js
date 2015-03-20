var Q = require('q');
var Handler = require('../lib/handler');
var ContextWrapper = require('../lib/contextWrapper');

describe('Handler', function () {
    var handler;
    var context = new ContextWrapper();
    
    var expectedChannel = 'SIP/1234';
    var expectedText = 'Дмитриев';

    var source = {
        lookup: function (text) {            
            var defer = Q.defer();
            defer.resolve(expectedChannel);
            return defer.promise;
        }
    };

    var recognizer = {
        recognize: function (file) {
            var defer = Q.defer();
            defer.resolve(expectedText);
            return defer.promise;
        },
        setLogFunction: function () {}
    };

    var logger = {
        info: function (module, callId, message, object) {}
    };

    var config = {
        processing: {
            totalAttempts: 2,
            playGreeting: true,
            playBeepBeforeRecording: true
        },
        asterisk: {
            sounds: {
                onError: 'invalid',
                onErrorRepeat: 'invalid',
                greeting: 'tt-monkeysintro',
                beep: 'beep'
            }
        },
        record: {
            directory: '/tmp'
        },
        recognize: {
            directory: '/tmp'
        }
    };

    beforeEach(function () {
        context = {
            on: function (eventName, callback) {
                callback({agiParam: '1'});
            },
            answer: function (callback) {
                callback();
            },
            streamFile: function (filename, digits, callback) {
                callback();
            },
            recordFile: function (filename, format, escape_digits, timeout, offset, beep, silence, callback) {
                callback();
            },
            setVariable: function (variableName, value, callback) {
                callback();
            },
            end: function (callback) {
                callback();
            }
        };     
        handler = new Handler(source, recognizer, config);        
    });

    it('should use context on event', function (done) {
        context.on = function (eventName) {
            var arr = ['variables', 'error', 'close', 'hangup'];
            expect(arr).toContain(eventName);
            done();
        };
        handler.handle(context);
    });

    it('should use context answer method', function (done) {        
        context.answer = function () {
            done();
        };
        handler.handle(context);
    });

    it('should use context streamFile method', function (done) {
        context.streamFile = function (file, acceptDigits) {            
            done();
        };
        handler.handle(context);
    });

    it('should use context recordFile method', function (done) {
        context.recordFile = function (file, format, escape_digits, timeout, offset, beep, silence) {
            done();
        };
        handler.handle(context);
    });

    it('should use context setVariable method', function (done) {
        context.setVariable = function (varname, value) {
            done();
        };
        handler.handle(context);
    });

    it('should use context end method', function (done) {
        context.end = function () {
            done();
        };
        handler.handle(context);
    });

    it('should use logger', function (done) {
        logger = {
            info: function (){
                done();
            }
        };
        handler.setLogger(logger);
        handler.handle(context);
    });
});