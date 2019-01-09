
const Recognizer = require('../lib/recognize/recognizer');
const Q = require('q');

describe('Recognizer', function() {
  const file = 'file';
  const textInFile = 'text';
  const parsedValue = 'value';

  const asrRequest = {
    load: function(file) {
      return Q.resolve(textInFile);
    },
  };

  const parser = {
    parse: function(text) {
      return Q.resolve(parsedValue);
    },
  };

  const log = [];
  const expectedLog = [
    {text: 'file', object: 'file'},
    {text: 'text', object: 'text'},
  ];

  const logFunction = function(text, object) {
    log.push({text: text, object: object});
  };

  it('check recognizer work', function(done) {
    const recognizer = new Recognizer(asrRequest, parser);

    recognizer.recognize(file)
        .then(function(value) {
          expect(value).toBe(parsedValue);
          done();
        });
  });

  it('check recognizer work and log', function(done) {
    const recognizer = new Recognizer(asrRequest, parser);
    recognizer.setLogFunction(logFunction);

    recognizer.recognize(file)
        .then(function(value) {
          expect(log).toEqual(expectedLog);
          done();
        });
  });
});
