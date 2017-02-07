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

let host = "https://rocky-river-18158.herokuapp.com";

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
var uri = 'mongodb://'+process.env.DBUSER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DBPORT+'/'+process.env.DB;

/**
 * Default home page 
 */
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');
app.get('/', function(req, res) {
    res.render('index', {host: host});
});

/**
 * /GET the originalUrl for the requested short_url
 */
app.get("/:urlHashVal", function (request, response) {
  
  let urlHash = request.params.urlHashVal;

  if((urlHash > 0) && (urlHash < 10000)) {

   mongodb.MongoClient.connect(uri, function(err, db) {
        if(err) throw err;

        // find URL for urlHashVal in DB
        var shortenedUrls = db.collection('shortenedUrls');
        shortenedUrls.findOne({
            short_url: host + '/' + urlHash
          }, {
            original_url: 1     
          }, function(err, doc) {

                if(err) throw err;

                if(doc) {         //  Found the document 
                  console.log(doc.original_url);
                  let originalUrl = doc.original_url; 
                  // redirect to original_url
                  response.redirect(originalUrl);
                }
                else {
                  // else return not found http status 404
                  response.status(404);
                  response.end();
                }
                
                db.close(function(err) {
                   if(err) throw err;
                });
        });
   });
  }
  else {
    // return bad request
    response.status(400);
    response.end();
  }
});

/**
 * /GET (create) a new short_url for the specified original_url
 */
app.get("/new/:protocol://:address", (request, response) => {
    
    var origUrl = request.params.protocol + "://" + request.params.address;
    
    if(validUrl.isWebUri(origUrl)) {

      var shortenedUrlJSON = { original_url: origUrl, short_url: 'not set'};

      mongodb.MongoClient.connect(uri, function(err, db) {
        if(err) throw err;

         // check if stortened URL is already stored for this URL
        var shortenedUrls = db.collection('shortenedUrls');
        shortenedUrls.findOne({
            original_url: origUrl
          }, {
            original_url: 1
          , short_url: 1      
          }, function(err, doc) {

                if(err) throw err;

                if(doc) {         //  Found the document 
                  shortenedUrlJSON.original_url = doc.original_url;
                  shortenedUrlJSON.short_url = doc.short_url;
                  response.send(shortenedUrlJSON);
                }
                else {            //  Create new record and insert 
                  shortenedUrlJSON = urlShortenerSvc(origUrl, host);
                  shortenedUrls.insert(shortenedUrlJSON, function(err, result) {
                    if(err) throw err;
              
                    response.send(shortenedUrlJSON);
                  });
                }

                db.close(function(err) {
                    if(err) throw err;
                });
          });
      });
    }
    else {
      response.status(400);
      response.send(
      {
        original_url: origUrl, 
        error: "400 Bad Request"
      });
    }
  
}); 


// listen for requests :)
var listener = app.listen(process.env.PORT || "3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;   // for testing