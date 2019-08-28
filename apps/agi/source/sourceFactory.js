'use strict';

const path = require('path');
const FileReader = require('./fileReader');
const Validator = require('./validator');
const FileSource = require('./fileSource');

const Sources = {
  File: (options) => {
    const getDataFilePath = () => {
      const datafile = options['dataFile'] || 'data/peernames.json';
      return path.resolve(datafile);
    };

    const filepath = getDataFilePath();
    const validator = new Validator();
    const filereader = new FileReader(filepath);

    return new FileSource(filereader, validator);
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
