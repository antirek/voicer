'use strict';

const Q = require('q');

const WitaiParser = function() {
  this.parse = function(object) {
    const defer = Q.defer();

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
