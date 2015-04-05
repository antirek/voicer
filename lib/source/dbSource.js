'use strict';

var Q = require('q');

var DbSource = function (Model) {

    this.lookup = function (text) {
        var defer = Q.defer();

        var regExp = new RegExp(text, "i");     //регистронезависимый поиск
        Model.all({where: {variants: { $in : [regExp]} } }, function (err, result) {
            if (err) { 
                defer.reject(err);
            } else { 
                var object = (result[0]) ? result[0] : null;
                if (object) {
                    defer.resolve(object);
                } else {
                    defer.reject(new Error('Lookup: not found in source'));
                }
            }
        });
        return defer.promise;
    };
};

module.exports = DbSource;