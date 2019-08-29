#!/usr/bin/node
const program = require('commander');
const Voicer = require('./../apps/agi/index');

program
  .option('-p, --port [port]', 'port for fast-agi server')
  .option('-r, --records [records]', 'path to records dir')
  .option('-t, --type [type]', 'recognition service type, like google, yandex, witai')
  .option('-k, --key [key]', 'recognition service auth key')
  .option('-d, --path [path]', 'path to peernames.json')
  .helpOption('-h, --help', 'read more information');
 
program.parse(process.argv);

if (!program.port) {
    console.log('type --help for more information \n\n');
    // program.help();
}

let config = {
    agi: {
        port: program.port || 3000,
    },
  record: { directory: program.records || '/var/records', type: 'wav', duration: 3 },
  recognize: {
    directory: program.records || '/var/records',
    type: program.type || 'witai', // ['yandex', 'google', 'witai']
    options: {
      developer_key:  program.key || '6SQV3DEGQWIXW3R2EDFUMPQCVGOEIBCR',
    },
  },
};

// console.log('config', config);
const voicer = new Voicer(config);
voicer.start();
