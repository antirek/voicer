'use strict';

var Recognizer = function (serviceLoader, parser) {
    this.recognize = function (file) {
        return serviceLoader
            .load(file)
            .then(parser.parse);
    };
};

module.exports = Recognizer;