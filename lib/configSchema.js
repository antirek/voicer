'use strict';

var Joi = require('joi');

var ConfigSchema = Joi.object().keys({
    agi: Joi.object().keys({
        port: Joi.number().integer().min(1).max(65535).required()
    }).required(),
    web: Joi.object().keys({
        port: Joi.number().integer().min(1).max(65535).required()
    }).required(),
    processing: Joi.object().keys({
        totalAttempts: Joi.number().min(1).max(20).default(2),
        playGreeting: Joi.boolean().default(true),
        playBeepBeforeRecording: Joi.boolean().default(true)
    }).required(),
    asterisk: Joi.object().keys({
        sounds: Joi.object().keys({
            onErrorBeforeFinish: Joi.string(),
            onErrorBeforeRepeat: Joi.string(),
            greeting: Joi.string()
        }).required(),
        recognitionDialplanVars: Joi.object().keys({
            status: Joi.string().required(),
            target: Joi.string().required()
        }).required()
    }).required(),
    record: Joi.object().keys({
        directory: Joi.string().default('/tmp'),
        type: Joi.string().valid('wav', 'gsm'),
        duration: Joi.number().min(1).max(60)
    }).required(),
    recognize: Joi.object().keys({
        directory: Joi.string().default('/tmp'),
        type: Joi.string().required().valid('google', 'yandex'),
        options: Joi.object().keys({
            developer_key: Joi.string().required()
        }).required()
    }).required(),
    lookup: Joi.object().keys({
        type: Joi.string().required().valid('file', 'mongo', 'mysql'),
        options: Joi.alternatives()
            .when('type', {is: 'file', then: Joi.object().keys({
                    dataFile: Joi.string().required()
                })
            })
            .when('type', {is: 'mongo', then: Joi.object().keys({
                    url: Joi.string().required(),
                    collection: Joi.string().required()
                })
            })
            .when('type', {is: 'mysql', then: Joi.object().keys({
                    host: Joi.string().required(),
                    port: Joi.number().required(),
                    username: Joi.string().required(),
                    password: Joi.string().required(),
                    database: Joi.string().required(),
                    table: Joi.string().required()
                })
            })
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