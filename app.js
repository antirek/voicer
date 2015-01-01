
var aio = require('asterisk.io'),
    agi = null;

var yandex_speech = require('yandex-speech');

var config = require('./config');
var xml2js = require('xml2js');


agi = aio.agi(3007);

agi.on('error', function(err){
    throw err;
});

agi.on('listening', function(){
    console.log('listening on port 3007');
});

agi.on('close', function(){
    console.log('close');
});

agi.on('connection', function(agiHandler){  
    console.log(agiHandler);
    
    agiHandler.command('ANSWER', function(code, result, data){
        console.log(code, result, data);
        
        agiHandler.command('Say Digits "14" ""', function(code, result, data){
            console.log(code, result, data);

            agiHandler.command('RECORD FILE /tmp/2 wav # 10000 0 1 2', function(code, result, data){
                console.log(code, result, data);

                yandex_speech.ASR({
                    developer_key: config.yandex_key,
                    file: '/tmp/2.wav',
                    filetype: 'audio/x-wav'
                    }, function(err, httpResponse, xml){
                        if(!err){
                            console.log(httpResponse.statusCode, xml)

                            var parser = new xml2js.Parser();
                            
                            parser.parseString(xml, function (err, result) {
                                console.dir(result);
                                var res = result.recognitionResults.variant[0]._;
                                res = res.replace(/ /g,"");
                                console.dir(res);

                                agiHandler.command('Say Digits "' + res + '" ""', function(code, result, data){
                                    console.log('Done');

                                    agiHandler.close();  
                                });
                                
                            });
                        
                        }
                    }
                );

                
            });
        });
    });
});