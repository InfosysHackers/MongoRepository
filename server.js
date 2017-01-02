var express = require("express");
var app = express();

var fs = require("fs");

var multer = require("multer");
var upload = multer({dest: "./uploads"});

var mongoose = require("mongoose");
var path = require('path');

mongoose.connect("mongodb://52.176.48.248/Planogram");
var conn = mongoose.connection;

var gfs;

var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

conn.once("open", function(){
  gfs = Grid(conn.db);
  app.get("/", function(req,res){
    //renders a multipart/form-data form
   res.render("home");
  });

   app.get("/upload", function(req,res){
    //renders a multipart/form-data form
   res.render("upload");
  });

  //second parameter is multer middleware.
  app.post("/", upload.single("avatar"), function(req, res, next){
    //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
    console.log(req);
    console.log(req.file.originalname);
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname.slice(0, -4)
    });
    //
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function(){fs.unlink("./uploads/"+ req.file.filename, function(err){res.send("success")})})
        .on("err", function(){res.send("Error uploading image")})
          .pipe(writestream);
  });

  // sends the image we saved by filename.
  app.get("/:filename", function(req, res){
      var readstream = gfs.createReadStream({filename: req.params.filename});
      readstream.on("error", function(err){
        res.send("No image found with that title " + err);
      });
      readstream.pipe(res);
  });

  //delete the image
  app.get("/delete/:filename", function(req, res){
    gfs.exist({filename: req.params.filename}, function(err, found){
      if(err) return res.send("Error occured");
      if(found){
        gfs.remove({filename: req.params.filename}, function(err){
          if(err) return res.send("Error occured");
          res.send("Image deleted!");
        });
      } else{
        res.send("No image found with that title");
      }
    });
  });
});

app.set("view engine", "ejs");
app.set("views", "./views");



if (!module.parent) {
  app.listen(3000);
  console.log("Server Started !!!");
}