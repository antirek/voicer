var yandex_speech = require('yandex-speech'),
    xml2js = require('xml2js'),
    config = require('./config'),
    path = require('path'),
    uuid = require('node-uuid'),
    finder = require('./finder');

var parser = new xml2js.Parser(),
    storage = new finder();

var filename = null, 
    type = 'wav';

var f = new finder();


var recognize = function (filepath, debug, callback) {
    yandex_speech.ASR({
        developer_key: config.yandex_key,
        file: filepath,
        filetype: 'audio/x-wav'
        }, function (err, httpResponse, xml) {
            if (debug) console.log(httpResponse.statusCode, xml);
            callback(err, {
                code: httpResponse.statusCode, 
                data: xml
            })
        });
}


var Q = function (context, debug) {

    var answer = function (callback) {
        context.answer(function (err, result) {
            if (debug) console.log(err, result);            
            callback(err, result);
        });
    };

    var end = function (callback) {
        context.end();
        callback();
    }

    var dial = function (peername, callback) {
        context.dial('SIP/' + peername, function (err, result) {
            if (debug) console.log(err, result);
            callback(err, result);
        });
    };

    var sayDigits = function (digits, escape_digits, callback) {
        context.sayDigits(digits, escape_digits, function (err, result) {
            if (debug) console.log(err, result);
            callback(err, result);
        });
    };

    var recordFile = function (filepath, type, escape_digits, duration, callback) {
        context.recordFile(filename, type, escape_digits, duration, function (err, result) {
            if (debug) console.log(err, result);
            callback(err, result);
        });
    };

    return {
        answer: answer,
        dial: dial,
        end: end,
        sayDigits: sayDigits,
        recordFile: recordFile
    };
};




var handler = function (context, debug) {
    context.on('variables', function (vars) {        

        if (debug) console.log(vars);

        var q = new Q(context, debug);

        var stepStart = function () {

            q.answer(function (err, result) {

                q.sayDigits("1", '#', function (err, result) {

                    filename = config.directory + '/' + uuid.v4();
                    
                    q.recordFile(filename, type, '#', 10, function (err, result) {

                        recognize(filename + '.' + type, debug, function (err, result) {
                            if (!err) {
                                stepParseRecognize(result.data, function(){
                                    f.lookup(res, function (err, peername) {
                                        if (debug) console.log(err, peername);

                                        if (!err) {
                                            if (debug) console.log(peername);

                                            context.sayDigits(peername, '#', function (err, result) {
                                                if (debug) console.log(err, result);


                                                q.dial(peername);
                                            });
                                        } else {
                                            context.end()
                                        }

                                    });

                                });
                            }
                        });
                    });
                });
            });
        }

        var stepParseRecognize = function(data, callback){
            parser.parseString(data, function (err, result) {

                if (debug) console.log('parse xml callback', err, result);
                var success = result.recognitionResults.$.success;

                if (debug) console.log(success, success === '1');

                if(success === '1') {
                    var res = result.recognitionResults.variant[0]._;
                    callback(null, res);

                } else {
                    if(debug) console.log('no success');
                    stepStart();
                }
            });
        };

        stepStart();
    });
}

module.exports = handler;