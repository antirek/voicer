'use strict';

var Q = require('q');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var YandexParser = function () {

    this.parse = function (text) {
        var defer = Q.defer();
        parser.parseString(options['data'], function (err, result) {
            var success = null;            

            try {
                success = result.recognitionResults.$.success;
            } catch (err) {}

            //console.log(success, success === '1');

            if (success === '1') {
                var recognized = result.recognitionResults.variant[0]._;
                defer.resolve({text: recognized});
            } else {                
                defer.reject(new Error('No parse result'));
            }
        });
        return defer.promise;
    };   
};

module.exports = YandexParser;