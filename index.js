
var dingDong = require('ding-dong');

var Handler = require('./lib/handler');
var Logger = require('./lib/logger');

var SourceFactory = require('./lib/source/sourceFactory');
var RecognizerFactory = require('./lib/recognize/recognizerFactory');

var Server = function (config) {

    this.start = function () {

        var source = (new SourceFactory(config['lookup'])).make();
        var recognizer = (new RecognizerFactory(config['recognize'])).make();

        var handler = new Handler(source, recognizer, config);

        if (config['logger']) {
            var logger = new Logger(config['logger']);
            handler.setLogger(logger);

            recognizer.setLogger(logger);
        }

        dingDong
            .createServer(handler.handle)
            .listen(config['port']);

        if (logger) {
            logger.info('server started');
        }
    };
};

module.exports = Server;