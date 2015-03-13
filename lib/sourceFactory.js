'use strict';

var Sources = {
    File: function (options) {
        return new (require('./lookup/file'))(options);
    },
    Mongo: function (options) {
        return new (require('./lookup/mongo'))(options);
    },
    Mysql: function (options) {
        return new (require('./lookup/mysql'))(options);
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

/*
var config = {
    type: 'file'
};

var source = (new SourceFactory(config)).make();
console.log(source);
*/