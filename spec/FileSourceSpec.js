const FileSource = require('../apps/agi/source/fileSource');
const Validator = require('../apps/agi/source/validator');

describe('FileSource', function() {
  const expectedObject = {'name': 'Дмитриев', 'target': 'SIP/1234',
    'variants': ['дмитриев', 'дмитриев сергей']};

  const content = {
    good: '[{"name":"Дмитриев","target":"SIP/1234","variants":' +
    '["дмитриев","дмитриев сергей"]}]',
    good_without_channel: '[{"name":"Дмитриев","channelMove":"SIP/1234"}]',
    empty: '[]',
    bad: '[',
  };

  const FileReader = function(content) {
    this.readFile = function() {
      return Promise.resolve(content);
    };
  };

  const validator = new Validator();

  it('return result if finder find result', (done) => {
    const fileSource = new FileSource(new FileReader(content.good),
        validator);

    fileSource.lookup('Дмитриев')
        .then(function(result) {
          expect(result).toEqual(expectedObject);
          done();
        })
        .catch(function(err) {
          console.log('1234', err);
        });
  });

  it('return error if finder not find result', (done) => {
    const fileSource = new FileSource(new FileReader(content.empty),
        validator);

    fileSource.lookup('Дмитриев')
        .catch(function(error) {
          expect(error instanceof Error).toBe(true);
          done();
        });
  });

  it('return error if finder find result but not have channel', (done) => {
    const fileSource = new FileSource(
        new FileReader(content.good_without_channel),
        validator
    );

    fileSource.lookup('Дмитриев')
        .catch(function(error) {
          expect(error instanceof Error).toBe(true);
          done();
        });
  });

  it('return error if finder get broken json', (done) => {
    const fileSource = new FileSource(new FileReader(content.bad), validator);

    fileSource.lookup('Дмитриев')
        .catch(function(err) {
          expect(err instanceof Error).toBe(true);
          done();
        });
  });
});
