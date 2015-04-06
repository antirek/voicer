'use strict';

var fs = require('fs');
var Q = require('q');

var FileReader = function (filepath){
    this.readFile = function () {
        var defer = Q.defer();
        fs.readFile(filepath, "utf8", function (err, data) {            
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(data);
            }
        });
        return defer.promise;
    };

    this.writeFile = function (data) {
        var defer = Q.defer();
        fs.writeFile(filepath, data, "utf8", function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    };
};

module.exports = FileReader;