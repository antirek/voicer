
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

class YandexParser {
  parse(text) {
    return new Promise((resolve, reject) => {
      parser.parseString(text, (err, result) => {
        let success = null;

        try {
          success = result.recognitionResults.$.success;
        } catch (err) {}

        if (success === '1') {
          const recognized = result.recognitionResults.variant[0]._;
          resolve(recognized);
        } else {
          reject(new Error('Parse: no result'));
        }
      });
    });
  };
};

module.exports = YandexParser;
