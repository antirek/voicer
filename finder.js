
var finder = function () {

    var lookup = function (text, callback) {

        var object = {
            "иван": "100",
            "вася": "1060",
            "катя": '123'
        };

        text = text.toLowerCase();

        var peername = object[text] || null;
        
        if(peername){
            callback(null, peername);
        } else {
            callback(new Error('Not found'));
        }
    }

    return {
      lookup: lookup
    }
}


module.exports = finder;