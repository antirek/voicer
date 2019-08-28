
const express = require('express');
const path = require('path');


// const favicon = require('serve-favicon');

var http = require('http');
var Router = require('node-simple-router');
var auth = require('http-auth');


const createApp = (source, configIn) => {
  var config = {
    port: configIn.port || 3007,
    auth: configIn.auth || false,    
    realm: configIn.realm || "voicer-web",    
    username: configIn.username || "user",
    password: configIn.password || "password"
  };

  const app = express();
  app.set('views', path.join(__dirname, '/views'));
  app.set('view engine', 'pug');

  app.use('/static',
    express['static'](path.join(__dirname, './../../node_modules')));

  app.use('/public',
    express['static'](path.join(__dirname, '/public')));
  /*
  var basic = auth.basic({
        realm: config.realm
    }, function (username, password, callback) {
        callback(username === config.username 
          && password === config.password);
    }
  );  
*/
  app.get('/', (req, res) => {
    res.render('index');
  })

  app.get("/peernames.json", (req, res) => {
    source.getData()
      .then((data) => {
        res.end(data);
      })
      .catch((error) => {
        res.end(error);
      });
  });

  app.post("/peernames.json", (req, res) => {
    var data = JSON.stringify(req.post, null, '  ');
    source.saveData(data)
      .then(() => {
        res.end('ok');
      })
      .catch((error) => {
        res.end(error);
      });
  });

  return app;

};

module.exports = createApp;