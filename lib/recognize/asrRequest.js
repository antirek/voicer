'use strict';

const Q = require('q');

const ASRRequest = function(service, key, defaults) {
  const options = defaults;

  this.load = function(file) {
    const defer = Q.defer();

    const checkFile = function() {
      if (!file) {
        defer.reject(new Error('No file'));
      };
    };

    checkFile();

    options['developer_key'] = key;
    options['file'] = file;

    const switchByResponseStatusCode = function(code, body) {
      switch (code) {
        case 403:
          defer.reject(
              new Error('ASRRequest. 403. Forbidden. Check developer key')
          );
          break;
        case 200:
        default:
          defer.resolve(body);
      };
    };

    console.log('options', options);
    /* eslint-disable new-cap  */
    service.ASR(options, (err, response, body) => {
      if (err) {
        defer.reject(err);
      } else {
        // if witai
        // console.log('response', response);

        if (!body) {
          body = response;
          response = {statusCode: 200};
        }
        // end if witai

        switchByResponseStatusCode(response.statusCode, body);
      }
    });

    return defer.promise;
  };
};

module.exports = ASRRequest;
