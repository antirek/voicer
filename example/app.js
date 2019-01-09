
const config = require('./config');
const Voicer = require('../index');

const voicer = new Voicer(config);
voicer.start();
