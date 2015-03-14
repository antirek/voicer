var FileSource = require('../lib/lookup/file');
var Q = require('q');

describe('Finder', function () {
    var finder;
    var expected_result = 'ok';
    
    it('return result if finder find concordance', function (done) {
        
        var FileReader = {
            readFile: function () {
                var defer = Q.defer();
                var content = '[{"name":"Дмитриев","channel":"SIP/1234"}]';
                defer.resolve(content);
                return defer.promise;
            }
        };

        var file = new FileSource(FileReader);

        file.lookup('Дмитриев')
        .then(function (result){
            expect(result).toEqual("SIP/1234");
            done();
        }).fail(console.log)


    });
});