
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
  agiHandler.close();
});