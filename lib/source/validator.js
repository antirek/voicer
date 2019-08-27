const Joi = require('@hapi/joi');
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
    return new Promise((resolve, reject) => {
      Joi.validate(object, arraySchema, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    })
  };
};

module.exports = Validator;
