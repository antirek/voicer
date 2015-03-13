'use strict';

var Q = require('q');

var Recognizer = function (engine) {

    this.recognize = function (file, callback) {
        var defer = Q.defer();
        engine.recognize(file, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    };
};



module.exports = recognizer;