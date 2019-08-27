'use strict';

const Joi = require('@hapi/joi');

const ConfigSchema = Joi.object().keys({
  agi: Joi.object().keys({
    port: Joi.number().integer().min(1).max(65535).required().default('3000'),
  }).required(),
  web: Joi.object().keys({
    port: Joi.number().integer().min(1).max(65535).required().default('3100'),
    auth: Joi.boolean().valid(true, false).default(false),
    username: Joi.string()
        .when('auth', {is: true, then: Joi.required().default('admin')}),
    password: Joi.string()
        .when('auth', {is: true, then: Joi.required().default('password')}),
    realm: Joi.string()
        .when('auth', {is: true, then: Joi.default('voicer web')}),
  }).required(),
  processing: Joi.object().keys({
    totalAttempts: Joi.number().min(1).max(20).default(2),
    playGreeting: Joi.boolean().default(true),
    playBeepBeforeRecording: Joi.boolean().default(true),
  }).required(),
  asterisk: Joi.object().keys({
    sounds: Joi.object().keys({
      onErrorBeforeFinish: Joi.string().default('invalid'),
      onErrorBeforeRepeat: Joi.string().default('invalid'),
      greeting: Joi.string().default('beep'),
    }).required(),
    recognitionDialplanVars: Joi.object().keys({
      status: Joi.string().required().default('RECOGNITION_RESULT'),
      target: Joi.string().required().default('RECOGNITION_TARGET'),
    }).required(),
  }).required(),
  record: Joi.object().keys({
    directory: Joi.string().default('/tmp'),
    type: Joi.string().valid('wav', 'gsm').default('wav'),
    duration: Joi.number().min(1).max(60).default(2),
  }).required(),
  recognize: Joi.object().keys({
    directory: Joi.string().default('/tmp'),
    type: Joi.string().required().valid('google', 'yandex', 'witai').default('google'),
    options: Joi.object().keys({
      developer_key: Joi.string().required(),
    }).required(),
  }).required(),
  lookup: Joi.object().keys({
    type: Joi.string().required().valid('file').default('file'),
    options: Joi.alternatives()
        .when('type', {is: 'file', then: Joi.object().keys({
          dataFile: Joi.string().required().default('/etc/voicer/peernames.json'),
        }),
        }),
  }).required(),
  logger: Joi.object().keys({
    console: Joi.object().keys({
        colorize: Joi.boolean().default(true)
    }),
    file: Joi.object().keys({
        filename: Joi.string().required(),
        json: Joi.boolean().default(false)
    }),
  })
});

module.exports = ConfigSchema;
