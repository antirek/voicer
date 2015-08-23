'use strict';

var Q = require('q');
var Joi = require('joi');

var Validator = function () {    
    
    var itemSchema = Joi.object().keys({
        name: Joi.string().required(),
        target: Joi.string().required(),
        variants: Joi.array().items(Joi.string()).required().min(1)
    });

    var arraySchema = Joi.array().items(itemSchema);

    this.validate = function (object) {
        var defer = new Q.defer();
        Joi.validate(object, arraySchema, function (err, value) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(value);
            }
        });
        return defer.promise;
    }
};

module.exports = Validator;