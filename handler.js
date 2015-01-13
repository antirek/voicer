'use strict';

var yandex_speech = require('yandex-speech'),
    xml2js = require('xml2js'),
    config = require('./config'),
    path = require('path'),
    uuid = require('node-uuid'),
    finder = require('./finder');

var async = require('async');



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

    var hangup = function (callback) {
        context.hangup(function (err, result) {
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

    var sayPhonetic = function (string, escape_digits, callback) {
        context.sayPhonetic(string, escape_digits, function (err, result) {
            if (debug) console.log(err, result);
            callback(err, result);
        });
    };

    var setVariable = function (variable, value, callback) {
        context.setVariable(variable, value, function (err, result) {
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
        sayPhonetic: sayPhonetic,
        setVariable: setVariable,
        hangup: hangup
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
            var file = config.directory_recognize + '/' + options['filename'] + '.' + options['type'];
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
            filename = uuid.v4();
            var filepath = config.directory_record + '/' + filename;
            q.recordFile(filepath, type, '#', 1, function (err, result) {                
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
            //q.sayPhonetic(options['peername'], '#', function (err, result) {
            q.dial(options['peername'], function (err, result) {
                callback(err, result);
            });
            //});
        }

        var stepFinish = function () {
            //q.hangup(function () {
                q.end(function () {
                    if(debug) console.log('end');
                });
            //});
        };

        var stepError = function (){
            q.streamFile('invalid', '#', function (err, result) {
                q.end(function () {
                    if(debug) console.log('end');
                });
            });
        }; 

        async.waterfall([
            function (callback) {
                stepGreeting(function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });    
            },
            function (result, callback) {                
                stepRecord(function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result, callback) {                
                stepRecognize(result, function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result, callback) {                
                stepParseRecognize(result, function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result, callback) {
                stepLookup(result, function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result, callback) {                
                stepDial(result, function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result) {
                stepFinish();
            }
        ]);
    });
}

module.exports = handler;