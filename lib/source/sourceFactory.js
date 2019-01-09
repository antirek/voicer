'use strict';

const path = require('path');
const FileReader = require('./fileReader');
const Validator = require('./validator');

const Sources = {
  File: function(options) {
    const getDataFilePath = function() {
      const datafile = options['dataFile'] || 'data/peernames.json';
      return path.resolve(datafile);
    };
    const filepath = getDataFilePath();
    const validator = new Validator();
    return new (require('./fileSource'))(new FileReader(filepath), validator);
  },
};

const SourceFactory = function(config) {
  this.make = function() {
    let source;
    switch (config['type']) {
      case 'file':
      default:
        /* eslint-disable new-cap  */
        source = Sources.File(config['options']);
    };

    return source;
  };
};

module.exports = SourceFactory;
