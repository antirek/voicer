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

        var stepGreeting = function (callback) {
            q.answer(function (err, result) {
                q.sayDigits("1", '#', function (err, result) {
                    callback(err, result);
                });
            });
        };

        var stepRecognize = function (filepath, callback) {
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
        };

        var stepRecord = function (callback) {
            filename = config.directory + '/' + uuid.v4();
            q.recordFile(filename, type, '#', 10, function (err, result) {                
                if(!err) callback(err, {filename: filename}); 
            });
        };

        var stepParseRecognize = function (data, callback) {

            parser.parseString(data, function (err, result) {
                var success = null;
                if (debug) console.log('parse xml callback', err, result);
                try {
                  success = result.recognitionResults.$.success;
                } catch (err) {}

                if (debug) console.log(success, success === '1');

                if(success === '1') {
                    var res = result.recognitionResults.variant[0]._;
                    callback(null, {text: res});
                } else {
                    if(debug) console.log('no success');
                    callback(new Error('No parse result'));
                }
            });
        };

        var stepLookup = function (text, callback) {
            f.lookup(text, function (err, result) {
                if (debug) console.log(err, result);
                callback(err, result);
            });
        };


        var stepDial = function (peername, callback) {
            q.sayDigits(peername, '#', function (err, result) {
                q.dial(peername, function (err, result) {
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
            q.sayDigits('9', '#', function (err, result) {
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
                    
                    stepRecognize(result.filename + '.' + type, function (err, result) {
                        if (err) { stepError(); }

                        stepParseRecognize(result.data, function (err, result) {
                            if (err) { stepError(); }
                            else{
                                stepLookup(result.text, function (err, result) {
                                    if (err) { stepError(); }
                                    else {
                                        stepDial(result.peername, function (err, result) {
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