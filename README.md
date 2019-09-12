voicer
======

AGI voice recognizer for Asterisk [use Yandex, Google or Wit.ai ASR online services]

Call to special extension, say "Vasya" and Asterisk connect you with Vasya! Excellent!

[![Build Status](https://travis-ci.org/antirek/voicer.svg?branch=master)](https://travis-ci.org/antirek/voicer)



Workflow
========

Voicer work as AGI-server. Voicer accept request from asterisk via AGI app.
It run handler for each request. Handler command asterisk record file.

After this send file to recognition service, receive text, search by text in 
source of data for finding concordance, if source have this text it return 
channel for call, voicer set dialplan vars RECOGNITION_RESULT as SUCCESS and 
RECOGNITION_TARGET for finded result. 

After this voicer return control to dialplan. Build rules of dialplan using 
RECOGNITION_RESULT and RECOGNITION_TARGET.


Use 
===


## Install ##

> $ npm install voicer -g

## Run

use npm config for store config opts

> voicer

run with --help for instructions

> voicer --help


Configuration
=============

## Config.js ##


``````
{
    agi: {
        port: 3000
    },
    processing: {
        totalAttempts: 2,
        playGreeting: true,
        playBeepBeforeRecording: false   //use system beep
    },
    asterisk: {
        sounds: {
            onErrorBeforeFinish: 'invalid',
            onErrorBeforeRepeat: 'invalid',
            greeting: 'beep'
        },
        recognitionDialplanVars: {
            status: 'RECOGNITION_RESULT',
            target: 'RECOGNITION_TARGET'
        }
    },
    record: {
        directory: '/tmp',
        type: 'wav',
        duration: 2,
    },
    recognize: {
        directory: '/tmp',
        type: 'witai',    // ['yandex', 'google', 'witai']
        options: {
            developer_key: '6SQV3DEGQWIXW3R2EDFUMPQCVGOEIBCR'
        }
    },
    lookup: {
        type: 'file',
        options: {
            dataFile: 'data/peernames.json'
        }
    }
};

``````

## Asterisk ##

Write dialplan for call to AGI-server voicer like

`````
[default]
exten=1000,1,AGI(agi://localhost:3000)
exten=1000,n,GotoIf($[${RECOGNITION_RESULT}=SUCCESS]?:default,1000,4)
exten=1000,n,Dial(${RECOGNITION_TARGET})

`````

## Format peernames ##

`````
[
    ....
    {
        "name": "Vasya",
        "target": "SIP/Sf567890",
        "variants": ["vasya", "vasya petrov"]
    },
    ....
]

`````

## Errors?! ##

Bugs?! Oh, contact with me. I want to eat them.


## Links ##

Yandex API key: https://developer.tech.yandex.ru/

Google API key: https://console.developers.google.com/

Wit.ai API key: http://wit.ai


[Voice speed dial on Asterisk](http://habrahabr.ru/post/248263/)

[New manual](https://habr.com/ru/post/436016/)

[Use with FreePBX](https://voxlink.ru/kb/asterisk-configuration/golosovoj-nabor-v-asterisk/)


Development
===========


## Test ##

> npm test