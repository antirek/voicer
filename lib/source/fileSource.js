'use strict';

var Q = require('q');

var FileSource = function (fileReader) {    
    
    var find = function (text, data) {
        var defer = Q.defer();
        var channel = null, 
            key = text.toLowerCase(),
            json;
        
        try {
            json = JSON.parse(data);
        } catch (err) {
            defer.reject(err);
        }

        var result = json.filter(function (element) {           
            var variants = element['variants'] || [];
            
            var arr = variants.filter(function (variant){                
                return variant.toLowerCase() === key;
            });
            if (arr.length > 0) {
                return true;
            } else {
                return false;
            }            
        });
        
        if (result.length > 0) {
            if (result[0]['target']) {
                defer.resolve(result[0]);
            } else {
                defer.reject(new Error('Lookup: finded object haven\'t target property'));
            }
        } else {
            defer.reject(new Error('Lookup: not found in source'));
        }

        return defer.promise;
    };

    this.lookup = function (text) {
        return fileReader.readFile()
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