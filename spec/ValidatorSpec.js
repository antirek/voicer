
const Validator = require('../apps/agi/source/validator');

describe('Validator', function() {
  const validator = new Validator();

  const goodItem1 = {
    'name': 'Дмитриев Сергей',
    'target': 'SIP/Sf745025',
    'variants': [
      'дмитриев',
      'сергей',
    ],
  };

  const goodItem2 = {
    'name': 'Студеная вода',
    'target': 'Local/2555575@AC000032',
    'variants': [
      'студеная вода',
      'заповедная вода',
      'вода',
    ],
  };

  const badItem1 = {
    'name': 'sadas',
    'target': 'safsafsaf',
    'variants': [],
  };

  const badItem2 = {
    'target': 'safsafsaf',
    'variants': ['12', '13'],
  };

  it('validate good array peernames.json', function(done) {
    const array = [goodItem1, goodItem2];
    validator.validate(array)
        .then(function(value) {
          done();
        });
  });

  it('not validate without variants', function(done) {
    const array = [goodItem1, badItem1];
    validator.validate(array)
        .then(console.log, function(err) {
          done();
        });
  });

  it('not validate without name', function(done) {
    const array = [goodItem1, badItem2];
    validator.validate(array)
        .then(console.log, function(err) {
          done();
        });
  });
});
