var yandex_speech = require('yandex-speech');
var xml2js = require('xml2js');
var config = require('./config');


var handler = function(context) {
    context.on('variables', function (vars) {
        console.log(vars);

        context.answer(function (err, result){
            console.log(err, result);
            
            context.sayDigits("14", '#', function (err, result){
                console.log(err, result);
                
                context.recordFile('/tmp/2', 'wav', '#', 10, function (err, data){
                console.log(err, result);

                    yandex_speech.ASR({
                        developer_key: config.yandex_key,
                        file: '/tmp/2.wav',
                        filetype: 'audio/x-wav'
                        }, function (err, httpResponse, xml){
                            if(!err){
                                console.log(httpResponse.statusCode, xml)

                                var parser = new xml2js.Parser();
                                
                                parser.parseString(xml, function (err, result) {
                                    console.dir(result);
                                    var res = result.recognitionResults.variant[0]._;
                                    res = res.replace(/ /g,"");
                                    console.dir(res);

                                    context.sayDigits(res, '#', function (err, result){
                                        console.log(err, result);

                                        context.dial('SIP/' + res, function (err, result){
                                            console.log(err, result);

                                            context.end();
                                        });                                         
                                    });
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