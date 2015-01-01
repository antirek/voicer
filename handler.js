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


var handler = function (context, debug) {
    context.on('variables', function (vars) {
        if (debug) console.log(vars);

        context.answer(function (err, result) {
            if (debug) console.log(err, result);
            
            context.sayDigits("1", '#', function (err, result) {
                if (debug) console.log(err, result);
                filename = config.directory + '/' + uuid.v4();               
                
                context.recordFile(filename, type, '#', 10, function (err, result) {
                if (debug) console.log(err, result);

                    yandex_speech.ASR({
                        developer_key: config.yandex_key,
                        file: filename + '.' + type,
                        filetype: 'audio/x-wav'
                        }, function (err, httpResponse, xml) {
                            if (!err) {
                                if (debug) console.log(httpResponse.statusCode, xml)

                                parser.parseString(xml, function (err, result) {
                                    if (debug) console.log('parse xml callback', err, result);
                                    var success = result.recognitionResults.$.success;
                                    console.log(success, success === '1');
                                    if(success === '1') {
                                        var res = result.recognitionResults.variant[0]._;

                                        f.lookup(res, function (err, peername) {
                                            if (debug) console.log(err, peername);

                                            if (!err) {                                                
                                                if (debug) console.log(peername);

                                                context.sayDigits(peername, '#', function (err, result) {
                                                    if (debug) console.log(err, result);

                                                    context.dial('SIP/' + peername, function (err, result) {
                                                        if (debug) console.log(err, result);

                                                        context.end();
                                                    });
                                                });
                                            } else {
                                                context.end()
                                            }
                                            
                                        });

                                    } else {
                                        if(debug) console.log('no success');
                                        context.end();
                                    }
                                });
                            }
                        }
                    );
                });
            });
        });
    });
}

module.exports = handler;