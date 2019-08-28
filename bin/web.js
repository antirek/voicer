#!/usr/bin/node

const config = require('config');

const SourceFactory = require('./apps/agi/source/sourceFactory');
const VoicerWeb = require('./apps/web/index');

const source = (new SourceFactory(config['lookup'])).make();
const voicerWeb = VoicerWeb(source, config['web']);
voicerWeb.listen(config.web.port, () => {
    console.log('started', config.web.port)
});