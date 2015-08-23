'use strict';

var path = require('path');
var FileReader = require('./fileReader');
var Validator = require('./validator');

var Sources = {
    File: function (options) {        
        var getDataFilePath = function () {
            var datafile = options['dataFile'] || 'data/peernames.json';
            return path.resolve(datafile);
        };
        var filepath = getDataFilePath();
        var validator = new Validator();
        return new (require('./fileSource'))(new FileReader(filepath), validator);
    }
};

var SourceFactory = function (config) {
    this.make = function () {
        var source;
        switch (config['type']) {            
            case 'file':
            default: 
                source = Sources.File(config['options']);
        };
        
        return source;
    };
};

module.exports = SourceFactory;