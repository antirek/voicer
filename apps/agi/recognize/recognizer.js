const autoBind = require('auto-bind');

class Recognizer {
  constructor(asrRequest, parser) {
    this.asrRequest = asrRequest;
    this.parser = parser;
    autoBind(this);
  }

  setLogFunction(logFunction) {
    this.log = logFunction;
  };

  recognize(file) {
    this.log('file', file);
    return this.asrRequest.load(file)
        .then((text) => {
          this.log('text', text);
          return this.parser.parse(text);
        })
        .catch((err) => {
          this.log('err', err)
        })
  };
};

module.exports = Recognizer;
