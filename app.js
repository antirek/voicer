#!/usr/bin/nodejs

const config = require('config');

var Voicer = require('./index');

var voicer = new Voicer(config);
voicer.start();
