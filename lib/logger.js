'use strict';

var winston = require('winston');
require('winston-syslog').Syslog;

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

    if (config.syslog) {
        config.syslog['timestamp'] = config.syslog['timestamp'] || timeformat;        
        logger.add(winston.transports.Syslog, config.syslog);
    };

    if (config.file) {
        config.file['timestamp'] = config.file['timestamp'] || timeformat;        
        logger.add(winston.transports.File, config.file);
    };

    return logger;
};

module.exports = Logger;