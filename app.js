
var configfile = process.env.VIOLA_CDR_CONFIG || './config';
var config = require(configfile);
var Voicer = require('../index');

var voicer = new Voicer(config);
voicer.start();