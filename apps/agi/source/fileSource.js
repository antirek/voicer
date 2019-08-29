const parseJson = require('parse-json');

class FileSource {
  constructor(fileReader, validator) {
    this.fileReader = fileReader;
    this.validator = validator;
  }

  find(text, data) {
    return new Promise((resolve, reject) => {
      const key = text.toLowerCase();

      const result = data.filter((element) => {
        const variants = element['variants'] || [];

        const arr = variants.filter((variant) => {
          return variant.toLowerCase() === key;
        });

        return (arr.length > 0);
      });

      if (result.length > 0) {
        resolve(result[0]);
      } else {
        reject(new Error('Lookup: not found in source'));
      }
    });
  };

  parse(data) {
    return new Promise((resolve, reject) => {
      try {
        const json = parseJson(data, 'peernames.json');
        console.log('parsed', json);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    });
  };

  lookup(text) {
    return this.fileReader.readFile()
        .then(this.parse)
        .then(this.validator.validate)
        .then((data) => {
          return this.find(text, data);
        });
  };
};

module.exports = FileSource;
