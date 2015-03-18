var FileSource = require('../lib/source/fileSource');
var Q = require('q');

describe('FileSource', function () {    
    var content = {
        good: '[{"name":"Дмитриев","channel":"SIP/1234"}]',
        empty: '[]',
        bad: '['
    };

    var FileReader = function (content) {
        this.readFile = function () {
            var defer = Q.defer();                
            defer.resolve(content);
            return defer.promise;
        };
    };
    
    it('return result if finder find result', function (done) {

        var fileSource = new FileSource(new FileReader(content.good));

        fileSource.lookup('Дмитриев')
            .then(function (result) {
                expect(result).toEqual("SIP/1234");
                done();
            });
    });

    it('return result if finder not find result', function (done) {

        var fileSource = new FileSource(new FileReader(content.empty));

        fileSource.lookup('Дмитриев')
            .then(function (result) {
                expect(result).toBe(null);
                done();
            });
    });

    it('return result if finder get broken json', function (done) {

        var fileSource = new FileSource(new FileReader(content.bad));

        fileSource.lookup('Дмитриев')
            .fail(function (err) {
                expect(err instanceof TypeError).toBe(true);
                done();
            });
    });
});