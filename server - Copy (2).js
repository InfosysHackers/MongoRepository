const express = require('express');
const app = express();


var fs      = require('fs');
var Grid    = require('gridfs-stream');


app.listen(3000, function() {
  console.log('listening on 3000')
})

var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://192.168.99.100:27017/test';
//var url = 'mongodb://172.17.0.1:27017/test';
var url = 'mongodb://52.176.48.248/Planogram';
var db;


app.get("/", function(req,res){
    //renders a multipart/form-data form
   // res.render("home");
   MongoClient.connect(url, function (err, database) {
    console.log("Connected correctly to server =" + database + "err" + err);
    db = database;
    console.log("Connected correctly to server 123");
    });
  });





app.post('/upload', function(req, res) {
    var tempfile    = req.files.filename.path;
    var origname    = req.files.filename.name;
    var writestream = gfs.createWriteStream({ filename: origname });
    // open a stream to the temporary file created by Express...
    fs.createReadStream(tempfile)
      .on('end', function() {
        res.send('OK');
      })
      .on('error', function() {
        res.send('ERR');
      })
      // and pipe it to gfs
      .pipe(writestream);
  });


 // sends the image we saved by filename.
/* app.get("/:filename", function(req, res){
    MongoClient.connect(url, function (err, database) {
    console.log("Connected correctly to server =" + database + "err" + err);
    db = database;
    console.log("Connected correctly to server 123");
  });
  var gfs = Grid(db, mongo);

      var readstream = gfs.createReadStream({filename: "503552"});
      readstream.on("error", function(err){
        res.send("No image found with that title" + err);
      });
      readstream.pipe(res);
  });
*/
app.get('/filename', function(req, res) {

  MongoClient.connect(url, function (err, database) {
    console.log("Connected correctly to server =" + database + "err" + err);
    db = database;
    console.log("Connected correctly to server 123");
  });

	var gfs = Grid(db, mongo);
    

     var readstream = gfs.createReadStream({filename: "503552"});
      readstream.on("error", function(err){
        res.send("No image found with that title" + err);
      });
      readstream.pipe(res);

   /* var writestream = gfs.createWriteStream({ filename: origname });
    // open a stream to the temporary file created by Express...
    fs.createReadStream(tempfile)
      .on('end', function() {
       console.log("ok");
      })
      .on('error', function(err) {
        console.log("error" + err);
      })
      // and pipe it to gfs
      .pipe(writestream);*/

   
  res.send('Hello World')
})

console.log('May Node be with you')