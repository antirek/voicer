'use strict';

var path = require('path');
var FileReader = require('./fileReader');

var Sources = {
    File: function (options) {        
        var getDataFilePath = function () {
            var datafile = options['dataFile'] || 'data/peernames.json';
            return path.resolve(datafile);
        };
        var filepath = getDataFilePath();
        return new (require('./fileSource'))(new FileReader(filepath));
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