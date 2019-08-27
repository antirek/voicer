
const YandexParser = require('../lib/recognize/yandexParser');

describe('YandexParser', function() {
  const expectedText = 'Лопата';
  const parser = new YandexParser();

  const result = {
    not_so_good: '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<recognitionResults success="0" />\n',
    good: '<?xml version="1.0" encoding="utf-8"?>' +
      '<recognitionResults success="1"><variant confidence="1">Лопата' +
      '</variant></recognitionResults>',
    empty: '',
    bad: 'dsgkdgjlkdf dsf <dsf>',
  };

  it('check yandexParser parse good result', function(done) {
    parser.parse(result.good)
        .then(function(text) {
          expect(text).toEqual(expectedText);
          done();
        });
  });

  it('check yandexParser parse not_so_good result', function(done) {
    parser.parse(result.not_so_good)
        .catch(function(error) {
          expect(error).toEqual(new Error('Parse: no result'));
          done();
        });
  });

  it('check yandexParser parse empty result', function(done) {
    parser.parse(result.empty)
        .catch(function(error) {
          expect(error).toEqual(new Error('Parse: no result'));
          done();
        });
  });

  it('check yandexParser parse bad result', function(done) {
    parser.parse(result.bad)
        .catch(function(error) {
          expect(error).toEqual(new Error('Parse: no result'));
          done();
        });
  });
});
