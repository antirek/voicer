
const AGIServer = require('ding-dong');
const Joi = require('joi');

const Handler = require('./lib/handler');
const Logger = require('./lib/logger');
const ConfigSchema = require('./lib/configSchema');

const SourceFactory = require('./lib/source/sourceFactory');
const RecognizerFactory = require('./lib/recognize/recognizerFactory');

const VoicerWeb = require('voicer-web');

const Server = (config) => {
  let logger;

  const log = (text, object) => {
    if (logger) {
      logger.info(text, object);
    } else {
      console.log(text, object);
    }
  };

  const validate = function(callback) {
    Joi.validate(config, ConfigSchema, callback);
  };

  const init = function() {
    const source = (new SourceFactory(config['lookup'])).make();
    const recognizer = (RecognizerFactory(config['recognize'])).make();

    const handler = new Handler(source, recognizer, config);

    if (config['logger']) {
      logger = new Logger(config['logger']);
      handler.setLogger(logger);
    }

    const agiServer = new AGIServer(handler.handle);
    agiServer.start(config.agi['port']);

    const voicerWeb = new VoicerWeb(source, config['web']);
    voicerWeb.start();

    log('server started');
  };

  start = function() {
    validate(function(err, value) {
      if (err) {
        log('config.js have errors', err);
      } else {
        log('config.js validated successfully!');
        init();
      }
    });
  };

  return { start }
};

module.exports = Server;
