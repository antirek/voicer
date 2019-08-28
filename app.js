#!/usr/bin/node

const config = require('config');

const Voicer = require('./apps/agi/index');
const VoicerWeb = require('voicer-web');


const voicer = new Voicer(config);
voicer.start();

const voicerWeb = new VoicerWeb(source, this.config['web']);
voicerWeb.start();