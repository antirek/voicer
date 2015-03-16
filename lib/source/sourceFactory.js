'use strict';

var path = require('path');
var FileReader = require('./fileReader');

var Schema = require('jugglingdb').Schema;

var Sources = {
    File: function (options) {        
        var getDataFilePath = function () {
            var datafile = options['dataFile'] || 'data/peernames.json';
            return path.resolve(datafile);
        };
        var filepath = getDataFilePath();
        return new (require('./fileSource'))(new FileReader(filepath));
    },
    Mongo: function (options) {
        var schema = new Schema('mongodb', {
            url: options['url'],
        });

        var Model = schema.define('Model', {
                name: String,
                channel: String
            },{
                table: options['collection']
            });
        return new (require('./dbSource'))(Model);
    },
    Mysql: function (options) {
        var schema = new Schema('mysql', {
            host: options['host'] || 'localhost',
            port: options['port'] || 3306,
            database: options['database'],
            username: options['username'] || 'root',
            password: options['password'] || 1234
        });

        var Model = schema.define('Model', {
                name: String,
                channel: String
            },{
                table: options['table']
            });
        return new (require('./dbSource'))(Model);
    }
};

var SourceFactory = function (config) {
    this.make = function () {
        var source;
        switch (config['type']) {
            case 'mongo':
                source = Sources.Mongo(config['options']);
                break;
            case 'mysql':
                source = Sources.Mysql(config['options']);
                break;
            case 'file':
            default: 
                source = Sources.File(config['options']);
        };
        
        return source;
    };
};

module.exports = SourceFactory;