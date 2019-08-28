
class Recognizer {
  constructor(asrRequest, parser) {
    this.asrRequest = asrRequest;
    this.parser = parser;
    this.log = () => {};
  }

  setLogFunction(logFunction) {
    this.log = logFunction;
  };

  recognize(file) {
    const that = this;
    this.log('file', file);
    return this.asrRequest.load(file)
        .then((text) => {
          that.log('text', text);
          return that.parser.parse(text);
        });
  };
};

module.exports = Recognizer;
