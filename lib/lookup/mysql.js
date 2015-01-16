'use strict';

var Schema = require('jugglingdb').Schema;

var mysql = function (options) {

    if (!options) options = {};
    var Model = null;

    var init = function () {
        var schema = new Schema('mysql', {
            host: options['host'] || 'localhost',
            port: options['port'] || 3306,
            database: options['database'],
            username: options['username'] || 'root',
            password: options['password'] || 1234
        });

        Model = schema.define('Model', {
                name: String,
                channel: String
            },{
                table: options['table']
            });
    }();

    var lookup = function (text, callback) {
        
        Model.all({where: {name: text}}, function (err, result) {            
            if(err) { 
                callback(err);
            } else { 
                var channel = (result[0]) ? result[0].channel : null;
                callback(null, {channel: channel});
            }
        });
    };

    return {
        lookup: lookup
    };
}


module.exports = mysql;