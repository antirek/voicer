var ASRRequest = require('../lib/recognize/asrRequest');
var Q = require('q');

describe('ASRRequest', function () {    

    var expectedBody = 'text';
    var expectedError = new Error('Oh!');

    var services = {
        good: {
            ASR: function (file, cb) {
                cb(null, {statusCode: 200}, expectedBody);
            }
        },
        forbidden: {
            ASR: function (file, cb) {
                cb(null, {statusCode: 403}, 'text');
            }
        },
        fail: {
            ASR: function (file, cb) {
                cb(expectedError, '', '');
            }
        }
    };

    var file = 'file';
    var defaults = {};
    var key = 'ABCD';
    
    it('return result if finder find result', function (done) {

        var asr = new ASRRequest(services['good'], key, defaults);
        
        asr.load(file)
        .then(function (text) {
            expect(text).toEqual(expectedBody);
            done();
        });

       
    });

    it('return result if finder find result', function (done) {

        var asr = new ASRRequest(services['forbidden'], key, defaults);
        
        asr.load(file)
        .fail(function (error) {
            expect(error).toEqual(new Error('ASRRequest. 403. Forbidden. Check developer key'));
            done();
        });

    });

    it('return result if finder find result', function (done) {

        var asr = new ASRRequest(services['fail'], key, defaults);
        
        asr.load(file)
        .fail(function (error) {
            expect(error).toEqual(expectedError);
            done();
        });

    });
});