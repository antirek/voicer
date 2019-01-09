'use strict';

const Q = require('q');
const Joi = require('joi');
/**
 *
 */
class Validator {
  /**
   *
   * @param {*} object
   * @return {Promise}
   */
  validate(object) {
    const itemSchema = Joi.object().keys({
      name: Joi.string().required(),
      target: Joi.string().required(),
      variants: Joi.array().items(Joi.string()).required().min(1),
    });

    const arraySchema = Joi.array().items(itemSchema);

    /* eslint-disable new-cap  */
    const defer = new Q.defer();
    Joi.validate(object, arraySchema, (err, value) => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve(value);
      }
    });
    return defer.promise;
  };
};

module.exports = Validator;
