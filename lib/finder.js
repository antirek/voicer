'use strict';

var Q = require('q');

var Finder = function (source) {
    
    this.lookup = function (text) {
        var defer = Q.defer();
        source.lookup(text, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    };
};

module.exports = Finder;