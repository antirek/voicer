'use strict';

var fs = require("fs"),
    path = require("path");

var file = function (options) {

    if (!options) options = {};

    var getDataFile = function(){
        var datafile = options['dataFile'] || 'data/peernames.json';
        return path.resolve(datafile);
    };

    var lookup = function (text, callback) {
        var encoding = "utf8";
        var filepath = getDataFile();
      
        fs.readFile(filepath, encoding, function (err, data){
            var channel = null, key;
            
            try {
                data = JSON.parse(data);
                key = text.toLowerCase();
                channel = data[key];                
            } catch (err) {
                callback(err);
            }

            if (channel) {
                callback(null, {channel: channel});
            } else {
                callback(new Error('Not found'));
            }
        });                
    };

    return {
        lookup: lookup
    }
}


module.exports = file;