'use strict';

var Q = require('q');
var parseJson = require('parse-json');

var FileSource = function (fileReader, validator) {
    
    var find = function (text, data) {
        var defer = Q.defer();
        var key = text.toLowerCase();        
        
        var result = data.filter(function (element) {
            var variants = element['variants'] || [];
            
            var arr = variants.filter(function (variant) {
                return variant.toLowerCase() === key;
            });

            return (arr.length > 0);     
        });
        
        if (result.length > 0) {
            defer.resolve(result[0]);
        } else {
            defer.reject(new Error('Lookup: not found in source'));
        }

        return defer.promise;
    };

    var parse = function (data) {
        var defer = Q.defer();
        try {
            var json = parseJson(data, 'peernames.json');
            defer.resolve(json);
        } catch (err) {
            defer.reject(err);
        }
        return defer.promise;
    };

    this.lookup = function (text) {
        return fileReader.readFile()
            .then(parse)
            .then(validator.validate)
            .then(function (data) {
                return find(text, data)
            });
    };

    this.getData = function () {        
        return fileReader.readFile();            
    };

    this.saveData = function (data) {
        return fileReader.writeFile(data);
    };
};

module.exports = FileSource;