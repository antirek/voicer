'use strict';

var Engine = function (serviceLoader, parser) {
    this.recognize = function (file) {        
        return serviceLoader
            .load(file)
            .then(parser.parse);
    };
};

module.exports = Engine;