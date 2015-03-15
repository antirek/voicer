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
            return element['name'].toLowerCase() === key;
        });

        channel = (result[0]) ? result[0].channel : null;
        defer.resolve(channel);

        return defer.promise;
    };

    this.lookup = function (text) {
        return fileReader.readFile()
            .then(function (data) {
                return find(text, data)
            });
    };
};

module.exports = FileSource;