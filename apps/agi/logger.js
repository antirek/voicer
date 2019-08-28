const winston = require('winston');

/**
 *
 * @param {*} config
 * @return {object}
 */
function Logger(config) {
  if (!config) config = {};

  const logger = new winston.Logger();

  const timeformat = () => {
    return (new Date()).toLocaleString();
  };

  if (config.console) {
    config.console['timestamp'] = config.console['timestamp'] || timeformat;
    logger.add(winston.transports.Console, config.console);
  };

  return logger;
};

module.exports = Logger;
