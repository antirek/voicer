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
            var peername = null, key;
            
            try {
                data = JSON.parse(data);
                key = text.toLowerCase();
                peername = data[key];
            } catch (err) {
                callback(err);
            }

            if (peername) {
                callback(null, {peername: peername});
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