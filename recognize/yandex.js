'use strict';

var yandex_speech = require('yandex-speech'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();

var yandex = function (options) {

    var developer_key = options['developer_key'];

     var parse = function (options, callback) {
        parser.parseString(options['data'], function (err, result) {
            var success = null;            

            try {
                success = result.recognitionResults.$.success;
            } catch (err) {}

            //console.log(success, success === '1');

            if (success === '1') {
                var recognized = result.recognitionResults.variant[0]._;
                callback(null, {text: recognized});
            } else {                
                callback(new Error('No parse result'));
            }
        });
    };

    var recognize = function (file, callback) {
        yandex_speech.ASR({
            developer_key: developer_key,
            file: file,
            filetype: 'audio/x-wav'
            }, function (err, httpResponse, xml) {
                console.log(httpResponse.statusCode, xml);
                
                parse({
                    code: httpResponse.statusCode, 
                    data: xml
                }, callback);
            });
    };

    return {
        recognize: recognize
    };
};


module.exports = yandex;