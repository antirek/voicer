'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    async = require('async');

var config = require('../config'),
    Finder = require('./finder'),
    SourceFactory = require('./sourceFactory'),
    Recognizer = require('./recognizer');



var source = (new SourceFactory(config['lookup'])).make();
    
var finder = new Finder(source),
    recognizer = new Recognizer(config['recognize']);




var handler = function (context, debug) {

    context.on('variables', function (vars) {

        if (debug) console.log(vars);

        var stepGreeting = function (callback) {
            context.answer(function (err, result) {
                context.streamFile("beep", '#', function (err, result) {
                    callback(err, result);
                });
            });
        };

        var stepRecord = function (callback) {
            var conf = config.record, 
                filename = uuid.v4(),
                filepath = conf['directory'] + '/' + filename;

            context.recordFile(filepath, conf['type'], '#', conf['duration'], function (err, result) {
                if(!err) callback(err, {
                  filename: filename,
                  type: conf['type']
                });
            });
        };

        var stepRecognize = function (options, callback) {
            var conf = config.recognize,
                file = conf['directory'] + '/' + options['filename'] + '.' + options['type'];

            recognizer.recognize(file, function (err, result) {
                if (debug) console.log('recognizeCallback', err, result);            
                callback(err, result);
            });
        };
      
        var stepLookup = function (options, callback) {
            finder.lookup(options['text'], function (err, result) {
                if (debug) console.log(err, result);
                callback(err, result);
            });
        };

        var stepDial = function (options, callback) {
            if(options['channel']){
                context.dial(options['channel'], function (err, result) {
                    callback(err, result);
                });
            } else {
                stepError();
            }            
        };

        var stepFinish = function () {            
            context.end(function () {
                if(debug) console.log('end');
            });
        };

        var stepError = function (){
            context.streamFile('invalid', '#', function (err, result) {
                context.end(function () {
                    console.log('end');
                });
            });
        }; 


        async.waterfall([
            function (callback) {
                stepGreeting(function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result, callback) {
                stepRecord(function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result, callback) {
                stepRecognize(result, function (err, result) {
                    console.log(err, result);
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },            
            function (result, callback) {
                stepLookup(result, function (err, result) {
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result, callback) {
                stepDial(result, function (err, result) {
                    console.log('result dial', result)
                    if (err) { stepError(); }
                    else { callback(null, result); }
                });
            },
            function (result) {
                stepFinish();
            }
        ]);

    });
}

module.exports = handler;