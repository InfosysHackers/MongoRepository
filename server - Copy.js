const express = require('express');
const app = express();

app.listen(3000, function() {
  console.log('listening on 3000')
})

var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://192.168.99.100:27017/test';
var url = 'mongodb://localhost:27017/test';
var db;

MongoClient.connect(url, function (err, database) {
    console.log("Connected correctly to server =" + database + "err" + err);
    db = database;
   
   var collection = db.collection('documents');
  var doc1 = {'hello':'doc1'};

  collection.insert(doc1);	

    console.log("Connected correctly to server 123");
	
});


app.get('/', function(req, res) {
  res.send('Hello World')
})

console.log('May Node be with you')