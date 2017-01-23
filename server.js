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
require('dotenv').config();
var express = require('express');
var mongodb = require('mongodb');
var validUrl = require('valid-url');
var app = express();

var urlShortenerSvc = require('./urlShortener.js');


// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
var uri = 'mongodb://'+process.env.DBUSER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

console.log(uri);

mongodb.MongoClient.connect(uri, function(err, db) {
  if(err) throw err;
});

app.get("/:urlhash", function (request, response) {

});

app.get("/new/:protocol://:address", (request, response) => {
    
    var origUrl = request.params.protocol + "://" + request.params.address;
    
    if(validUrl.isWebUri(origUrl)) {

      var shortenedUrlJSON = { original_url: 'not set', short_url: 'not set'};

      mongodb.MongoClient.connect(uri, function(err, db) {
        if(err) throw err;

         // check if stortened URL is already stored for this URL
        var shortenedUrls = db.collection('shortenedUrls');
           shortenedUrls.find({
            original_url: origUrl
          }, {
            original_url: 1
            , short_url: 1
            , _id: 0       
        }).toArray(function(err, docs) {
                if(err) throw err;

                console.log(docs);
                shortenedUrlJSON = docs[0]; //  What if there are more docs in array?

                response.send(shortenedUrlJSON);
                
                db.close(function(err) {
                    if(err) throw err;
            });
          })
      });

      

      // // put the shortenedUrlJSON into the DB
      // mongodb.MongoClient.connect(uri, function(err, db) {
      //   if(err) throw err;

      //   // shortenedUrls collection
      //   var shortenedUrls = db.collection('shortenedUrls');

      //   shortenedUrls.find({ original_url: origUrl})
      //   shortenedUrls.insert(shortenedUrlJSON, function(err, result) {

      //     if(err) throw err;

      //   });

      //   db.close(function(err) {
      //     if(err) throw err;
      //   })
      // });
      
      
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