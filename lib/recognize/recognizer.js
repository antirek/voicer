'use strict';

const Recognizer = function(asrRequest, parser) {
  let log = function() {};

  this.setLogFunction = function(logFunction) {
    log = logFunction;
  };

  this.recognize = function(file) {
    log('file', file);
    return asrRequest.load(file)
        .then(function(text) {
          log('text', text);
          return parser.parse(text);
        });
  };
};

module.exports = Recognizer;
