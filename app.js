
var aio = require('asterisk.io'),
    agi = null;

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
        
        agiHandler.command('Say Date "1414330073" ""', function(code, result, data){
            console.log(code, result, data);

            agiHandler.command('RECORD FILE /tmp/2 wav # 10000 0 1 2', function(code, result, data){
                console.log(code, result, data);

                agiHandler.close();
            });
        });
    });
});