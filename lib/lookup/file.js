'use strict';

var fs = require("fs"),
    path = require("path");

var File = function (options) {

    if (!options) options = {};

    var getDataFilePath = function () {
        var datafile = options['dataFile'] || 'data/peernames.json';
        return path.resolve(datafile);
    };

    var find = function (text, data, callback) {
        var channel = null, 
            key = text.toLowerCase();
        
        try {
            data = JSON.parse(data);
        } catch (err) {
            callback(err);
        }

        var result = data.filter(function (element) {
            return element['name'].toLowerCase() === key;
        });

        channel = (result[0]) ? result[0].channel : null;
        callback(null, channel);
    };

    this.lookup = function (text, callback) {
        var encoding = "utf8",
            filepath = getDataFilePath();
      
        fs.readFile(filepath, encoding, function (err, data) {
            if (err) {
                callback(err);
            } else {
                find(text, data, function (err, channel) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, {channel: channel});
                    }
                });
            }
        });                
    };
};

module.exports = File;