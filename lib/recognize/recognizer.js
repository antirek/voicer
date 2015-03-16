'use strict';

var Recognizer = function (serviceLoader, parser) {

    var log = function () {};

    this.setLogFunction = function (logFunction) {
        log = logFunction;
    };

    this.recognize = function (file) {
        log('file', file);
        //console.log('recognize file', file);
        return serviceLoader
            .load(file)
            .then(function (text) {
                log('text', text);
                return parser.parse(text);
            });
    };
};

module.exports = Recognizer;