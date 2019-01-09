#!/usr/bin/nodejs

const config = require('config');

const Voicer = require('./index');

const voicer = Voicer(config);
voicer.start();
