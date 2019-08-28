
const AGIServer = require('ding-dong');
const Joi = require('@hapi/joi');

const Handler = require('./handler');
const Logger = require('./logger');
const ConfigSchema = require('./configSchema');

const SourceFactory = require('./source/sourceFactory');
const RecognizerFactory = require('./recognize/recognizerFactory');

class Server {
  constructor(config) {    
    const logger = Logger({console: { colorize: true}});
    const source = (new SourceFactory(config['lookup'])).make();
    const recognizer = (RecognizerFactory(config['recognize'])).make();
    const handler = new Handler({source, recognizer, config, logger});

    this.agiServer = new AGIServer(handler.handle);
  } 


  start(port) {
    agiServer.start(port);
    console.log('agi server started on port', port);
  };
};

module.exports = Server;
