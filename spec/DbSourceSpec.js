var DbSource = require('../lib/source/dbSource');
var Q = require('q');

describe('DbSource', function () {    
    
    var expectedResult = {channel: 'SIP/1234'};

    var Model = {
        good: function () {
            this.all = function (condition, callback) {
                callback(null, [expectedResult]);
            }
        },
        empty: function () {
            this.all = function (condition, callback) {
                callback(null, []);
            }
        },
        error: function () {
            this.all = function (condition, callback) {
                callback(new Error(), []);
            }
        }
    };
    
    it('return result if finder find result', function (done) {
        var dbSource = new DbSource(new Model.good());

        dbSource.lookup('Дмитриев')
            .then(function (result) {
                expect(result).toEqual(expectedResult);
                done();
            });
    });

    it('return null if finder return empty', function (done) {
        var dbSource = new DbSource(new Model.empty());

        dbSource.lookup('Дмитриев')
            .then(function (result) {
                expect(result).toBe(null);
                done();
            });
    });

    it('return error if finder error with model.all', function (done) {
        var dbSource = new DbSource(new Model.error());

        dbSource.lookup('Дмитриев')
            .fail(function (error) {
                expect(error instanceof Error).toBe(true);
                done();
            });
    });    
});