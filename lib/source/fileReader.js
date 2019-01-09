'use strict';

const fs = require('fs');
const Q = require('q');

const FileReader = (filepath) => {
  const readFile = () => {
    const defer = Q.defer();
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve(data);
      }
    });
    return defer.promise;
  };

  const writeFile =(data) => {
    const defer = Q.defer();
    fs.writeFile(filepath, data, 'utf8', (err) => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
    });
    return defer.promise;
  };

  return {
    readFile, writeFile,
  };
};

module.exports = FileReader;
