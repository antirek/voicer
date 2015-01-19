'use strict';

var google_speech = require('google-speech');

var google = function (options) {

    var developer_key = options['developer_key'];

    var parse = function (options, callback) {
        var data = null;
        try{
            data = JSON.parse(options.data.replace('{"result":[]}\n', ''));
        }catch(e){}

        if (data && data['result']) {
            var recognized = data.result[0].alternative[0].transcript;
            callback(null, {text: recognized});
        } else {                
            callback(new Error('No parse result'));
        }
    };

    var recognize = function (file, callback) {
        
        google_speech.ASR({
            developer_key: developer_key,
            file: file,
            lang: 'ru-RU',
            'content-type': 'audio/l16; rate=8000;'
            }, function (err, httpResponse, xml) {
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

module.exports = google;