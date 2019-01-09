'use strict';

const Recognizer = require('./recognizer');
const ASRRequest = require('./asrRequest');

let asrRequest; let parser; let asr; let defaults;

const Recognizers = {
  yandex: (options) => {
    asr = require('yandex-speech');
    defaults = {
      filetype: 'audio/x-wav',
    };

    asrRequest = new ASRRequest(asr, options['developer_key'], defaults);
    parser = new (require('./yandexParser'));

    return new Recognizer(asrRequest, parser);
  },
  google: (options) => {
    asr = require('google-speech');
    defaults = {
      'lang': 'ru-RU',
      'content-type': 'audio/l16; rate=8000;',
    };

    asrRequest = new ASRRequest(asr, options['developer_key'], defaults);
    parser = new (require('./googleParser'));

    return new Recognizer(asrRequest, parser);
  },
  witai: (options) => {
    asr = require('witai-speech');
    defaults = {};

    asrRequest = new ASRRequest(asr, options['developer_key'], defaults);
    parser = new (require('./witaiParser'));

    return new Recognizer(asrRequest, parser);
  },
};

const EngineFactory = (config) => {
  const make = () => {
    let engine;
    switch (config['type']) {
      case 'yandex':
        engine = Recognizers.yandex(config['options']);
        break;
      case 'google':
        engine = Recognizers.google(config['options']);
        break;
      case 'witai':
      default:
        engine = Recognizers.witai(config['options']);
    };
    return engine;
  };

  return {make};
};

module.exports = EngineFactory;
