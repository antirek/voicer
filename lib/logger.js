'use strict';

var winston = require('winston');

function Logger (config) {
    if(!config) config = {};

    var logger = new winston.Logger();

    var timeformat = function () {
        return (new Date()).toLocaleString();
    };

    if (config.console) {
        config.console['timestamp'] = config.console['timestamp'] || timeformat;
        logger.add(winston.transports.Console, config.console);
    };

    if (config.file) {
        config.file['timestamp'] = config.file['timestamp'] || timeformat;        
        logger.add(winston.transports.File, config.file);
    };

    return logger;
};

module.exports = Logger;