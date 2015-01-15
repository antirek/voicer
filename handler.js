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
    f = new finder();

var handler = function (context, debug) {

    context.on('variables', function (vars) {

        if (debug) console.log(vars);

        var stepGreeting = function (callback) {
            context.answer(function (err, result) {
                context.streamFile("beep", '#', function (err, result) {
                    callback(err, result);
                });
            });
        };

        var stepRecord = function (callback) {
            var conf = config.record, 
                filename = uuid.v4(),
                filepath = conf['directory'] + '/' + filename;

            context.recordFile(filepath, conf['type'], '#', conf['duration'], function (err, result) {
                if(!err) callback(err, {
                  filename: filename,
                  type: conf['type']
                });
            });
        };

        var stepRecognize = function (options, callback) {
            var conf = config.recognize,
                file = conf['directory'] + '/' + options['filename'] + '.' + options['type'];

            yandex_speech.ASR({
                developer_key: conf['developer_key'],
                file: file,
                filetype: 'audio/x-wav'
                }, function (err, httpResponse, xml) {
                    if (debug) console.log(httpResponse.statusCode, xml);
                    callback(err, {
                        code: httpResponse.statusCode, 
                        data: xml
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
            context.dial('SIP/' + options['peername'], function (err, result) {
                callback(err, result);
            });            
        };

        var stepFinish = function () {            
            context.end(function () {
                if(debug) console.log('end');
            });
        };

        var stepError = function (){
            context.streamFile('invalid', '#', function (err, result) {
                context.end(function () {
                    console.log('end');
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