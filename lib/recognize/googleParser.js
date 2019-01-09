'use strict';

const Q = require('q');

const GoogleParser = function() {
  this.parse = function(text) {
    const defer = Q.defer();

    if (!text || text === '') {
      defer.reject(new Error('Parse: input is malformed'));
    }

    const t = text.replace('{"result":[]}\n', '');
    let data = {};
    let recognized = '';

    try {
      data = JSON.parse(t);
    } catch (e) {
      defer.reject(new Error('Parse: input is not JSON'));
    }

    if (data['result']) {
      try {
        recognized = data.result[0].alternative[0].transcript;
      } catch (e) {
        defer.reject(new Error('Parse: fail get required sequence'));
      }

      defer.resolve(recognized);
    } else {
      defer.reject(new Error('Parse: no result'));
    }

    return defer.promise;
  };
};

module.exports = GoogleParser;


/*
google answer
'{"result":[]}\n{"result":[{"alternative":[{"transcript":
"лопата","confidence":0.81121683},{"transcript":"лопота"},
{"transcript":"лопато"},{"transcript":"лопаты"},
{"transcript":"lopata"}],"final":true}],"result_index":0}\n'
*/
