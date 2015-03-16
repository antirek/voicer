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
};

module.exports = FileReader;