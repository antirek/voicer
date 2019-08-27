
const GoogleParser = require('../lib/recognize/googleParser');

describe('GoogleParser', () => {
  const expectedText = 'лопата';
  const parser = new GoogleParser();

  const result = {
    good: '{"result":[]}\n{"result":[{"alternative":' +
        '[{"transcript":"лопата","confidence":0.81121683},' +
        '{"transcript":"лопота"},{"transcript":"лопато"},' +
        '{"transcript":"лопаты"},{"transcript":"lopata"}],' +
        '"final":true}],"result_index":0}\n',
    empty: '',
    bad: 'qwqw{qw}',
    not_so_good: '{"result":[{"alternative":[]}]}',
    no_result: '{"qw":"2"}',
  };

  it('check googleParser parse good result', function(done) {
    parser.parse(result.good)
        .then(function(text) {
          expect(text).toEqual(expectedText);
          done();
        });
  });

  it('check googleParser parse empty result', function(done) {
    parser.parse(result.empty)
        .catch(function(error) {
          expect(error).toEqual(new Error('Parse: input is malformed'));
          done();
        });
  });

  it('check googleParser parse bad result', function(done) {
    parser.parse(result.bad)
        .catch(function(error) {
          expect(error).toEqual(new Error('Parse: input is not JSON'));
          done();
        });
  });

  it('check googleParser parse not so good result', function(done) {
    parser.parse(result.not_so_good)
        .catch(function(error) {
          expect(error).toEqual(new Error('Parse: fail get required sequence'));
          done();
        });
  });

  it('check googleParser parse no result', function(done) {
    parser.parse(result.no_result)
        .catch(function(error) {
          expect(error).toEqual(new Error('Parse: no result'));
          done();
        });
  });
});
