
var Recognizer = require('../lib/recognize/recognizer');
var Q = require('q');

describe('Recognizer', function () {
    var file = 'file';
    var textInFile = 'text';
    var parsedValue = 'value';

    var asrRequest = {
        load: function (file) {
            var defer = Q.defer();
            defer.resolve(textInFile);
            return defer.promise;
        }
    };

    var parser = {
        parse: function (text) {
            var defer = Q.defer();
            defer.resolve(parsedValue);
            return defer.promise;
        }
    };

    var log = [];
    var expectedLog = [
        { text: 'file', object: 'file' },
        { text: 'text', object: 'text' } 
    ];

    var logFunction = function (text, object){
        log.push({text: text, object: object});
    };

    it('check recognizer work', function (done) {
        var recognizer = new Recognizer(asrRequest, parser);
        
        recognizer.recognize(file)
        .then(function (value) {
            expect(value).toBe(parsedValue);
            done();
        });        
    });

    it('check recognizer work and log', function (done) {
        var recognizer = new Recognizer(asrRequest, parser);
        recognizer.setLogFunction(logFunction);
        
        recognizer.recognize(file)
        .then(function (value) {            
            expect(log).toEqual(expectedLog);
            done();
        });        
    });
});