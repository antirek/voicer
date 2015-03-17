'use strict';

var Q = require('q');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var YandexParser = function () {
    this.parse = function (text) {
        var defer = Q.defer();
        parser.parseString(text, function (err, result) {
            var success = null;

            try {
                success = result.recognitionResults.$.success;
            } catch (err) {}

            if (success === '1') {
                var recognized = result.recognitionResults.variant[0]._;
                defer.resolve(recognized);
            } else {
                defer.reject(new Error('Parse: no result'));
            }
        });
        return defer.promise;
    };
};

module.exports = YandexParser;