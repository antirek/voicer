#!/usr/bin/node

const config = require('config');
const Voicer = require('./../apps/agi/index');

const voicer = new Voicer(config);
voicer.start();
