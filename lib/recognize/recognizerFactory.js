'use strict';

var Recognizer = require('./recognizer');
var ASRRequest = require('./asrRequest');

var asrRequest, parser, asr, defaults;

var Recognizers = {
    Yandex: function (options) {
        asr = require('yandex-speech');
        defaults = {
            filetype: 'audio/x-wav'
        };

        asrRequest = new ASRRequest(asr, options['developer_key'], defaults);
        parser = new (require('./yandexParser'));

        return new Recognizer(asrRequest, parser);
    },
    Google: function (options) {
        asr = require('google-speech');
        defaults = {
            'lang': 'ru-RU',
            'content-type': 'audio/l16; rate=8000;'
        };
        
        asrRequest = new ASRRequest(asr, options['developer_key'], defaults);
        parser = new (require('./googleParser'));

        return new Recognizer(asrRequest, parser);
    },
    Witai: function (options) {
        asr = require('witai-speech');
        defaults = {};

        asrRequest = new ASRRequest(asr, options['developer_key'], defaults);
        parser = new (require('./witaiParser'));

        return new Recognizer(asrRequest, parser);
    } 
};

var EngineFactory = function (config) {
    this.make = function () {
        var engine;
        switch (config['type']) {
            case 'yandex':
                engine = Recognizers.Yandex(config['options']);
                break;
            case 'witai':
                engine = Recognizers.Witai(config['options']);
                break;
            case 'google':
            default:
                engine = Recognizers.Google(config['options']);
        };
        return engine;
    };
};

module.exports = EngineFactory;