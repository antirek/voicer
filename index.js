
var AGIServer = require('ding-dong');
var Joi = require('joi');

var Handler = require('./lib/handler');
var Logger = require('./lib/logger');
var ConfigSchema = require('./lib/configSchema');

var SourceFactory = require('./lib/source/sourceFactory');
var RecognizerFactory = require('./lib/recognize/recognizerFactory');

var VoicerWeb = require('voicer-web');

var Server = (config) => {
    var logger;

    var log = (text, object) => {
        if (logger) {
            logger.info(text, object);
        } else {
            console.log(text, object);
        }
    };

    var validate = function (callback) {
        Joi.validate(config, ConfigSchema, callback);
    };

    var init = function () {        
        var source = (new SourceFactory(config['lookup'])).make();
        var recognizer = (new RecognizerFactory(config['recognize'])).make();

        var handler = new Handler(source, recognizer, config);

        if (config['logger']) {
            logger = new Logger(config['logger']);
            handler.setLogger(logger);
        }

        var agiServer = new AGIServer(handler.handle);
        agiServer.start(config.agi['port']);

        var voicerWeb = new VoicerWeb(source, config['web']);
        voicerWeb.start();

        log('server started');
    };

    this.start = function () {
        validate(function (err, value) {
            if (err) {
                log('config.js have errors', err);
            } else {
                log('config.js validated successfully!');
                init();    
            }
        });
    };
};

module.exports = Server;