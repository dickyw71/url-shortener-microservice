/*
 * Copyright (c) 2016 ObjectLabs Corporation
 * Distributed under the MIT license - http://opensource.org/licenses/MIT
 *
 * Written with: mongodb@2.1.3
 * Documentation: http://mongodb.github.io/node-mongodb-native/
 * A Node script connecting to a MongoDB database given a MongoDB Connection URI.
*/

// server.js
// where your node app starts

// init project
var express = require('express');
var mongodb = require('mongodb');
var validUrl = require('valid-url');
var app = express();

var urlShortenerSvc = require('./urlShortener.js');

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

mongodb.MongoClient.connect(uri, function(err, db) {
  if(err) throw err;
});

app.get("/", function (request, response) {
 
  var origUrl = "http://freecodecamp.com";
  response.send(urlShortenerSvc(origUrl));
  
});

app.get("/new/:protocol://:address", (request, response) => {
    
    var origUrl = request.params.protocol + "://" + request.params.address;
    
    if(validUrl.isWebUri(origUrl)) {
      console.log(request.params);
      var shortenedUrlJSON = urlShortenerSvc(origUrl);

      // put the shortenedUrlJSON into the DB
      mongodb.MongoClient.connect(uri, function(err, db) {
        if(err) throw err;

        // shortenedUrls collection
        var shortenedUrls = db.collection('shortenedUrls');

        shortenedUrls.find({ original_url: origUrl})
        shortenedUrls.insert(shortenedUrlJSON, function(err, result) {

          if(err) throw err;

        });

        db.close(function(err) {
          if(err) throw err;
        })
      });
      
      response.send(shortenedUrlJSON);
    }
    else {
      response.send(
      {
        original_url: origUrl, 
        error: "400 Bad Request"
      });
    }
  
}); 


// listen for requests :)
var listener = app.listen("3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});