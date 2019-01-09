const ASRRequest = require('../lib/recognize/asrRequest');
// const Q = require('q');

describe('ASRRequest', function() {
  const expectedBody = 'text';
  const expectedError = new Error('Oh!');

  const services = {
    good: {
      ASR: function(file, cb) {
        cb(null, {statusCode: 200}, expectedBody);
      },
    },
    forbidden: {
      ASR: function(file, cb) {
        cb(null, {statusCode: 403}, 'text');
      },
    },
    fail: {
      ASR: function(file, cb) {
        cb(expectedError);
      },
    },
  };

  const file = 'file';
  const defaults = {};
  const key = 'ABCD';

  it('check asr load file and return result', (done) => {
    const asr = new ASRRequest(services['good'], key, defaults);

    asr.load(file)
        .then(function(text) {
          expect(text).toEqual(expectedBody);
          done();
        });
  });

  it('check asr load no file and return error', (done) => {
    const asr = new ASRRequest(services['good'], key, defaults);

    asr.load()
        .fail((error) => {
          expect(error).toEqual(new Error('No file'));
          done();
        });
  });

  it('check asr load file but service is forbidden', (done) => {
    const asr = new ASRRequest(services['forbidden'], key, defaults);

    asr.load(file)
        .fail((error) => {
          expect(error).toEqual(
              new Error('ASRRequest. 403. Forbidden. Check developer key'));
          done();
        });
  });

  it('check asr load file but http return error', (done) => {
    const asr = new ASRRequest(services['fail'], key, defaults);

    asr.load(file)
        .fail((error) => {
          expect(error).toEqual(expectedError);
          done();
        });
  });
});
