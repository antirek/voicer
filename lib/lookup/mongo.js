'use strict';

var Schema = require('jugglingdb').Schema;

var schema = new Schema('mongodb', {
    url: 'mongodb://localhost/voicer',
});

var mongo = function (options) {

    if (!options) options = {};   

    var lookup = function (text, callback) {
        




            if (channel) {
                callback(null, {channel: channel});
            } else {
                callback(new Error('Not found'));
            }
        });                
    };

    return {
        lookup: lookup
    };
}

module.exports = mongo;