
var config = require('./config'),
    agiServer = require('ding-dong'),
    Handler = require('./lib/handler');

var debug = config['debug'];

var SourceFactory = require('./lib/source/sourceFactory'),
    RecognizerFactory = require('./lib/recognize/recognizerFactory');

var source = (new SourceFactory(config['lookup'])).make();
var recognizer = (new RecognizerFactory(config['recognize'])).make();

var handler = new Handler(source, recognizer, config);

agiServer
    .createServer(handler.handle)
    .listen(config['port']);