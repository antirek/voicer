var Finder = require('../lib/finder');

describe('Finder', function () {
    var finder;
    var expected_result = 'ok';
    
    it('return result if finder find concordance', function (done) {
        var source = {
            lookup: function (text, cb) {
                cb(null, expected_result);
            }
        };

        finder = new Finder(source);
        finder.lookup('text').then(function (res) {
            expect(res).toEqual(expected_result);
            done();
        });
    });
});