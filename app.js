
var config = require('./config'),
    agiServer = require('ding-dong'),
    handler = require('./handler');

var debug = true;


agiServer
.createServer(function (context) {
    handler(context, debug);
})
.listen(config.port);
