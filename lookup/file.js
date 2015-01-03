'use strict';

var fs = require("fs"),
    path = require("path");

var file = function (options) {

    if (!options) options = {};

    var getDataFile = function(){
        var datafile = options['dataFile'] || 'data/peernames.json';
        return path.resolve(datafile);
    }

    var lookup = function (text, callback) {
        var encoding = "utf8";
        var filepath = getDataFile();
        console.log(filepath);
        fs.readFile(filepath, encoding, function (err, data){
            data = JSON.parse(data);
            var key = text.toLowerCase();            
            var peername = data[key] || null;
            
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