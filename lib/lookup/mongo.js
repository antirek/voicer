'use strict';

var Schema = require('jugglingdb').Schema;

var mongo = function (options) {

    if (!options) options = {};
    var Model = null;

    var init = function(){
        var schema = new Schema('mongodb', {
            url: options['url'],
        });

        Model = schema.define('Model', {
                name: String,
                channel: String
            },{
                table: options['collection']
            });
    }();

    var lookup = function (text, callback) {
        var regExp = new RegExp(text, "i");

        Model.all({where: {name: {regex: regExp}}}, function (err, result) {            
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


module.exports = mongo;