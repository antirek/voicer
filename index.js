
const AGIServer = require('ding-dong');
const Joi = require('@hapi/joi');

const Handler = require('./lib/handler');
const Logger = require('./lib/logger');
const ConfigSchema = require('./lib/configSchema');

const SourceFactory = require('./lib/source/sourceFactory');
const RecognizerFactory = require('./lib/recognize/recognizerFactory');

const VoicerWeb = require('voicer-web');

class Server {
  constructor(config) {
    this.config = config;
  }

  log(text, object) {
    if (this.logger) {
      this.logger.info(text, object);
    } else {
      console.log(text, object);
    }
  };

  init() {
    const source = (new SourceFactory(this.config['lookup'])).make();
    const recognizer = (RecognizerFactory(this.config['recognize'])).make();

    const handler = new Handler(source, recognizer, this.config);

    this.logger = new Logger({
      console: {
        colorize: true,
      },
    });
    handler.setLogger(this.logger);

    const agiServer = new AGIServer(handler.handle);
    agiServer.start(this.config.agi['port']);

    const voicerWeb = new VoicerWeb(source, this.config['web']);
    voicerWeb.start();

    this.log('server started');
  };

  start() {
    const result = Joi.validate(this.config, ConfigSchema);
    if (result.error) {
      this.log('error'. result.error);
      process.exit(1);
    }

    this.init();
  };
};

module.exports = Server;
