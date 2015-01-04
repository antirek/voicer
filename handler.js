'use strict';

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
        context.recordFile(filepath, type, escape_digits, duration, function (err, result) {
            if (debug) console.log(err, result);
            callback(err, result);
        });
    };

    var streamFile = function (filepath, escape_digits, callback) {
        context.streamFile(filepath, escape_digits, function (err, result) {
            if (debug) console.log(err, result);
            callback(err, result);
        });
    };

    return {
        answer: answer,
        dial: dial,
        end: end,
        sayDigits: sayDigits,
        recordFile: recordFile,
        streamFile: streamFile,
    };
};




var handler = function (context, debug) {
    context.on('variables', function (vars) {

        if (debug) console.log(vars);

        var q = new Q(context, debug);

        var stepGreeting = function (callback) {
            q.answer(function (err, result) {
                q.streamFile("beep", '#', function (err, result) {
                    callback(err, result);
                });
            });
        };

        var stepRecognize = function (options, callback) {
            var file = options['filename'] + '.' + options['type'];
            yandex_speech.ASR({
                developer_key: config.yandex_key,
                file: file,
                filetype: 'audio/x-wav'
                }, function (err, httpResponse, xml) {
                    if (debug) console.log(httpResponse.statusCode, xml);
                    callback(err, {
                        code: httpResponse.statusCode, 
                        data: xml
                    })
                });
        };

        var stepRecord = function (callback) {
            filename = config.directory + '/' + uuid.v4();
            q.recordFile(filename, type, '#', 10, function (err, result) {                
                if(!err) callback(err, {
                  filename: filename, 
                  type: type
                }); 
            });
        };

        var stepParseRecognize = function (options, callback) {

            parser.parseString(options['data'], function (err, result) {
                var success = null;
                if (debug) console.log('parse xml callback', err, result);

                try {
                    success = result.recognitionResults.$.success;
                } catch (err) {}

                if (debug) console.log(success, success === '1');

                if (success === '1') {                    
                    callback(null, {text: result.recognitionResults.variant[0]._});
                } else {
                    if(debug) console.log('no success');
                    callback(new Error('No parse result'));
                }
            });
        };

        var stepLookup = function (options, callback) {
            f.lookup(options['text'], function (err, result) {
                if (debug) console.log(err, result);
                callback(err, result);
            });
        };


        var stepDial = function (options, callback) {
            q.sayDigits(options['peername'], '#', function (err, result) {
                q.dial(options['peername'], function (err, result) {
                    callback(err, result);
                });
            });
        }

        var stepFinish = function () {
            q.end(function () {
                if(debug) console.log('end');
            });
        };

        var stepError = function (){
            q.streamFile('invalid', '#', function (err, result) {
                q.end(function () {
                    if(debug) console.log('end');
                });
            });
        }

        var main = function () {
            stepGreeting(function (err, result) {
                if (err) { stepError(); }
                
                stepRecord(function (err, result) {
                    if (err) { stepError(); }
                    
                    stepRecognize(result, function (err, result) {
                        if (err) { stepError(); }

                        stepParseRecognize(result, function (err, result) {
                            if (err) { stepError(); }
                            else{
                                stepLookup(result, function (err, result) {
                                    if (err) { stepError(); }
                                    else {
                                        stepDial(result, function (err, result) {
                                            stepFinish();
                                        });
                                    }
                                });  
                            }
                        });
                    });
                });
            });
        };

        main();
    });
}

module.exports = handler;