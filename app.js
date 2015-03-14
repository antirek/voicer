
var config = require('./config'),
    agiServer = require('ding-dong'),
    Handler = require('./lib/handler');

var debug = config['debug'];

var SourceFactory = require('./lib/sourceFactory'),
    EngineFactory = require('./lib/engineFactory');

var finder = (new SourceFactory(config['lookup'])).make();
finder.lookup('лопата').then(console.log);

var recognizer = (new EngineFactory(config['recognize'])).make();

var handler = new Handler(finder, recognizer, config);

agiServer
.createServer(handler.handle)
.listen(config.port);