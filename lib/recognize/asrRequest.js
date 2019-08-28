
class ASRRequest {
  constructor(service, key, defaults) {
    this.options = defaults;
    this.service = service;
    this.key = key;
  }

  load(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error('No file'));
      };

      this.options['developer_key'] = this.key;
      this.options['file'] = file;

      const switchByResponseStatusCode = (code, body) => {
        switch (code) {
          case 403:
            reject(
                new Error('ASRRequest. 403. Forbidden. Check developer key')
            );
            break;
          case 200:
          default:
            resolve(body);
        };
      };

      console.log('options', this.options);
      /* eslint-disable new-cap  */
      this.service.ASR(this.options, (err, response, body) => {
        if (err) {
          reject(err);
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
    });
  };
};

module.exports = ASRRequest;
