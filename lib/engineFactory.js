'use strict';

var Engine = require('./recognize/engine');
var ServiceLoader = require('./recognize/serviceloader');

var serviceLoader, parser, asr, defaults;

var Engines = {
    Yandex: function (options) {
        asr = require('yandex-speech');
        defaults = {
            filetype: 'audio/x-wav'
        };
        serviceLoader = new ServiceLoader(asr, options['developer_key'], defaults);
        parser = new (require('./recognize/yandexParser'));
        return new Engine(serviceLoader, parser);
    },
    Google: function (options) {
        asr = require('google-speech');
        defaults = {
            'lang': 'ru-RU',
            'content-type': 'audio/l16; rate=8000;'
        };
        serviceLoader = new ServiceLoader(asr, options['developer_key'], defaults);
        parser = new (require('./recognize/googleParser'));
        return new Engine(serviceLoader, parser);
    }
};

var EngineFactory = function (config) {
    this.make = function () {
        var engine;
        switch (config['type']) {
            case 'yandex':
                engine = Engines.Yandex(config['options']);
                break;
            case 'google':
            default:
                engine = Engines.Google(config['options']);
        };
        return engine;
    };
};

module.exports = EngineFactory;