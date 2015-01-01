
var config = require('./config');

var agiServer = require('ding-dong');

var handler = require('./handler');

agiServer.createServer(handler).listen(config.port);
