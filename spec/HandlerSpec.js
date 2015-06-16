var Q = require('q');
var Handler = require('../lib/handler');


describe('Handler', function () {
    var handler;
    var context;
    
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

    var Context = function() {

        var onEvent = function (event) {
            expect(['variables', 'error', 'close', 'hangup']).toEqual(jasmine.arrayContaining([event]));
            return Q.resolve();
        };

        var answer = function () {            
            return Q.resolve();
        };

        var setVariable = function (variable, value) {
            expect([24, 5]).toEqual(jasmine.arrayContaining([value]));
            return Q.resolve();
        };

        var streamFile = function (filename, digits) {            
            return Q.resolve();
        };

        return {
            answer: answer,
            onEvent: onEvent,
            setVariable: setVariable,
            streamFile: streamFile
        };
    };
    
    it('standard flow', function (done) {
        
        context = new Context();
        handler = new Handler(source, recognizer, config);

        handler.handle(context);
        done();
    });
});