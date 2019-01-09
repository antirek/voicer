'use strict';

const Q = require('q');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const YandexParser = function() {
  this.parse = function(text) {
    const defer = Q.defer();
    parser.parseString(text, function(err, result) {
      let success = null;

      try {
        success = result.recognitionResults.$.success;
      } catch (err) {}

      if (success === '1') {
        const recognized = result.recognitionResults.variant[0]._;
        defer.resolve(recognized);
      } else {
        defer.reject(new Error('Parse: no result'));
      }
    });
    return defer.promise;
  };
};

module.exports = YandexParser;
