'use strict';

var Q = require('q');

var ASRRequest = function (service, key, defaults) {

    var options = defaults;

    this.load = function (file) {
        var defer = Q.defer();
        options['developer_key'] = key;
        options['file'] = file;        

        service.ASR(options, function (err, response, body) {
                if (err) {
                    defer.reject(err);
                } else {
                    defer.resolve(body);
                }
            });
        return defer.promise;
    };   
};

module.exports = ASRRequest;