
var config = require('./config'),
    agiServer = require('ding-dong'),
    handler = require('./lib/handler');

var debug = config['debug'];

agiServer
.createServer(function (context) {
    handler(context, debug);
})
.listen(config.port);