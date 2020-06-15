
class WitaiParser {
  parse(object) {
    return new Promise((resolve, reject) => {
      if (!object || object === '') {
        reject(new Error('Parse: input is malformed'));
      }

      if (object['text']) {
        resolve(object['text']);
      } else {
        reject(new Error('Parse: no result'));
      }
    });
  };
};

module.exports = WitaiParser;
