'use strict';

const Q = require('q');
const parseJson = require('parse-json');

const FileSource = function(fileReader, validator) {
  const find = function(text, data) {
    const defer = Q.defer();
    const key = text.toLowerCase();

    const result = data.filter(function(element) {
      const variants = element['variants'] || [];

      const arr = variants.filter(function(variant) {
        return variant.toLowerCase() === key;
      });

      return (arr.length > 0);
    });

    if (result.length > 0) {
      defer.resolve(result[0]);
    } else {
      defer.reject(new Error('Lookup: not found in source'));
    }

    return defer.promise;
  };

  const parse = function(data) {
    const defer = Q.defer();
    try {
      const json = parseJson(data, 'peernames.json');
      defer.resolve(json);
    } catch (err) {
      defer.reject(err);
    }
    return defer.promise;
  };

  this.lookup = function(text) {
    return fileReader.readFile()
        .then(parse)
        .then(validator.validate)
        .then(function(data) {
          return find(text, data);
        });
  };

  this.getData = function() {
    return fileReader.readFile();
  };

  this.saveData = function(data) {
    return fileReader.writeFile(data);
  };
};

module.exports = FileSource;
