'use strict';

var Q = require('q');

var ASRRequest = function (service, key, defaults) {

    var options = defaults;

    this.load = function (file) {
        var defer = Q.defer();

        var checkFile = function () {
            if (!file) {
                defer.reject(new Error('No file'));
            };
        }();

        options['developer_key'] = key;
        options['file'] = file;

        var switchByResponseStatusCode = function (code, body) {
            switch (code) {
                case 403: 
                    defer.reject(new Error('ASRRequest. 403. Forbidden. Check developer key'));
                    break;
                case 200:
                default: 
                    defer.resolve(body);
            };
        };

        console.log('options', options);
        service.ASR(options, function (err, response, body) {
            if (err) {
                defer.reject(err);
            } else {                
                //if witai
                //console.log('response', response);
                if (!body) {var body = response; response = {statusCode: 200}; }
                //end if witai

                switchByResponseStatusCode(response.statusCode, body);
            }
        });
        
        return defer.promise;
    };   
};

module.exports = ASRRequest;