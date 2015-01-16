'use strict';

function finder (connection) {
    if (connection && connection['type']) {
        switch (connection['type']) {
            case 'file':
                this.dataSource = new require('./lookup/file')(connection['options']);
                break;
            case 'mongodb':
                this.dataSource = new require('./lookup/mongo')(connection['options']);
                break;
            case 'mysql':
                this.dataSource = new require('./lookup/mysql')(connection['options']);
                break;
            default:
                throw new Error('Unknown type of connection');
        }
    } else {
        this.dataSource = new require('./lookup/file')();
    }
};

finder.prototype.lookup = function (text, callback) {
    this.dataSource.lookup(text, callback);
};

module.exports = finder;