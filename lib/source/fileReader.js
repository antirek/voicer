const fs = require('fs');

class FileReader {
  constructor (filepath) {
    this.filepath = filepath;
  }

  readFile () {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filepath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })      
  };

  writeFile (data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filepath, data, 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
  };

};

module.exports = FileReader;
