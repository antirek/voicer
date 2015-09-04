'use strict';

var Q = require('q');

var WitaiParser = function () {
    this.parse = function (object) {
        var defer = Q.defer();

        if (!object || object === '') {
            defer.reject(new Error('Parse: input is malformed'));
        }
          
        if (object['_text']) {
            defer.resolve(object['_text']);                        
        } else {                
            defer.reject(new Error('Parse: no result'));
        }

        return defer.promise;
    };   
};

module.exports = WitaiParser;