'use strict';

var Recognizer = function (serviceLoader, parser) {

    var logger;

    this.setLogger = function (loggerIn) {
        logger = loggerIn;
    };

    this.recognize = function (file) {
        if (logger) { 
            logger.info('recognize file', file)
        };

        return serviceLoader
            .load(file)
            .then(function (text) {
                if (logger) { 
                    logger.info('recognize text', text);
                };
                return parser.parse(text);
            });
    };
};

module.exports = Recognizer;