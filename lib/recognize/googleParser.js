'use strict';

var Q = require('q');

var GoogleParser = function () {
    this.parse = function (text) {
        var defer = Q.defer();
        var data = JSON.parse(text.replace('{"result":[]}\n', ''));
        if (data.result) {
            var recognized = data.result[0].alternative[0].transcript;
            console.log(recognized);
            defer.resolve(recognized);
        } else {                
            defer.reject(new Error('No parse result'));
        }
        return defer.promise;
    };   
};

module.exports = GoogleParser;


/*
google answer
'{"result":[]}\n{"result":[{"alternative":[{"transcript":"лопата","confidence":0.81121683},{"transcript":"лопота"},{"transcript":"лопато"},{"transcript":"лопаты"},{"transcript":"lopata"}],"final":true}],"result_index":0}\n'

*/