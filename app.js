#!/usr/bin/node

var configfile = process.env.VOICER_CONFIGFILE || './config';
var fileExists = require('file-exists');

if (fileExists(configfile + '.js')) {
  var config = require(configfile);
  var Voicer = require('./index');

  var voicer = new Voicer(config);
  voicer.start();
} else {
  console.log('no configfile');
}