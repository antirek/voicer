
var Validator = require('../lib/source/validator');

describe('Validator', function () {
    var validator = new Validator();

    var goodItem1 = {
        "name": "Дмитриев Сергей",
        "target": "SIP/Sf745025",
        "variants": [
          "дмитриев",
          "сергей",
        ]
      };

    var goodItem2 = {
        "name": "Студеная вода",
        "target": "Local/2555575@AC000032",
        "variants": [
          "студеная вода",
          "заповедная вода",
          "вода"
        ]
      };

    var badItem1 = {
        "name": "sadas",
        "target": "safsafsaf",
        "variants": []
      };

    var badItem2 = {        
        "target": "safsafsaf",
        "variants": ["12", "13"]
      };

    it('validate good array peernames.json', function (done) {
        var array = [goodItem1, goodItem2];
        validator.validate(array)
        .then(function (value) {
            done();
        });
    });

    it('not validate without variants', function (done) {
        var array = [goodItem1, badItem1];
        validator.validate(array)
        .then(console.log, function (err) {
            done();
        })
    });

    it('not validate without name', function (done) {
        var array = [goodItem1, badItem2];
        validator.validate(array)
        .then(console.log, function (err) {            
            done();
        })
    });
});