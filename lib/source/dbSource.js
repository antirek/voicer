'use strict';

var Q = require('q');

var DbSource = function (Model) {

    this.lookup = function (text) {
        var defer = Q.defer();

        var regExp = new RegExp(text, "i");     //регистронезависимый поиск
        Model.all({where: {name: {regex: regExp}}}, function (err, result) {            
            if (err) { 
                defer.reject(err);
            } else { 
                var channel = (result[0]) ? result[0].channel : null;
                if (channel) {
                    defer.resolve({channel: channel});
                } else {
                    defer.resolve(null);
                }
            }
        });
        return defer.promise;
    };
};

module.exports = DbSource;