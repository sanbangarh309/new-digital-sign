/**
* @author Sandeep Bangarh <sanbangarh309@gmail.com>
*/
"use strict"
var Doc = require('./models/Doc');
var config = require('./custom_config');
var ObjectId = require('mongodb').ObjectID;
module.exports = {
  sanImageUpload : function(req, res, id) {
    var fs = require('fs');
    var path = require('path');
    var formidable = require("formidable");
    var appDir = path.dirname(require.main.filename);
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (files.img.name !='') {
        var oldpath = files.img.path;
        var newpath = appDir+'/uploads/' + files.img.name;
        fs.rename(oldpath, newpath);
        res.json(files.img.name);
      }else{
        res.json('failed');
      }

    });
  },

  decodeBase64Image : function (dataString)
  {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3)
    {
      return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
  },

  uploadFinalDoc : function(base64Data,sb){
    if (!base64Data) {
      return sb('');
    }
    var imageTypeRegularExpression = /\/(.*?)$/;
    // Generate random string
    var uniqueSHA1String = module.exports.san_Password()
    var imageBuffer = module.exports.decodeBase64Image(base64Data);
    var uploafdf_dir = config.directory + "/uploads/docs/";
    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
    if(imageTypeDetected[1] == 'pdf'){
      var uniqueRandomImageName = 'pdf_' + uniqueSHA1String;
    }else{
      var uniqueRandomImageName = 'image_' + uniqueSHA1String;
    }
    var userUploadedImagePath = uploafdf_dir + uniqueRandomImageName + '.' + imageTypeDetected[1];
    var filename = uniqueRandomImageName + '.' + imageTypeDetected[1];
    require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
      function()
      {
        sb({name:filename});
      });
  },

  uploadBase64Image : function(base64Data,sb){
    if (!base64Data) {
      return sb('');
    }
    var imageTypeRegularExpression = /\/(.*?)$/;
    // Generate random string
    var uniqueSHA1String = module.exports.san_Password()
    var imageBuffer = module.exports.decodeBase64Image(base64Data);
    var uploafdf_dir = config.directory + "/uploads/docs/";
    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
    if(imageTypeDetected[1] == 'pdf'){
      var uniqueRandomImageName = 'pdf_' + uniqueSHA1String;
    }else{
      var uniqueRandomImageName = 'image_' + uniqueSHA1String;
    }
    var userUploadedImagePath = uploafdf_dir + uniqueRandomImageName + '.' + imageTypeDetected[1];
    var filename = uniqueRandomImageName + '.' + imageTypeDetected[1];
    try
    {
        require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
          function()
          {
            if(imageTypeDetected[1] == 'pdf'){
              // let PDF2Pic = require('pdf2pic')
              // let converter = new PDF2Pic({
              //   density: 100,           // output pixels per inch
              //   savename: uniqueRandomImageName + "_cnvrt",   // output file name
              //   savedir: uploafdf_dir,    // output file location
              //   format: "png",          // output file format
              //   size: 1200               // output size in pixels
              // })
              // converter.convertBulk(userUploadedImagePath, -1)
              // .then(resolve => {
              //   sb(resolve); 
              // })
              const Pdf2Img = require('pdf2img-promises');
              let converter = new Pdf2Img();
              converter.on(filename, (msg) => {
                  console.log('Received: ', msg);
              });
              converter.setOptions({
                type: 'jpg',                                // png or jpg, default jpg
                size: 1024,                                 // default 1024
                density: 600,                               // default 600
                quality: 100,                               // default 100
                outputdir: uploafdf_dir, // output folder, default null (if null given, then it will create folder name same as file name)
                outputname: uniqueRandomImageName + "_cnvrt",                       // output file name, dafault null (if null given, then it will create image name same as input name)
                page: null                                  // convert selected page, default null (if null given, then it will convert all pages)
              });
              converter.convert(userUploadedImagePath)
                .then(info => {
                  console.log(info);
                  sb(info);
                })
                .catch(err => {
                  console.error(err);
                })
            }else{
              sb({ result: 'success',
              message: 
               [ { name: filename } ] });
            }
          });
      }
      catch(error)
      {
        sb('')
      }
  },

  sanGenerateQRCode : function(req, res,id, callback) {
    var qr = require('qr-image');
    var realpath = 'http://'+req.headers.host+'/files/qrcodes/'+ObjectId(id)+'.png';
    var path = config.directory+'/uploads/qrcodes/'+ObjectId(id)+'.png';
    var qr_svg = qr.image(ObjectId(id)+'san@#ban', { type: 'png' });
    qr_svg.pipe(require('fs').createWriteStream(path));
    callback(realpath);
  },

  sanGenerateBarCode : function(id,sb) {
    const bwipjs = require('bwip-js');
    bwipjs.toBuffer({
        bcid:        'code128',       // Barcode type
        text:        ObjectId(id).toString(),    // Text to encode
        scale:       3,               // 3x scaling factor
        height:      10,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign:  'center',        // Always good to set this
    }, function (err, png) {
        if (err) {
          sb(err);
        } else {
          require('fs').writeFile(config.directory+'/uploads/qrcodes/'+ObjectId(id).toString()+'.png', png,
            function()
            {
              sb(ObjectId(id).toString()+'.png');
            });
        }
    });
  },

  sanSendMessage : function(req, res, id) {
    var message = new gcm.Message({
      priority: 'high',
      contentAvailable: true,
      delayWhileIdle: true,
      timeToLive: 3,
      data: { key1: 'msg1', key2: 'message2'},
      notification: {
        title: "Hello, World",
        icon: "ic_launcher",
        body: "This is a notification that will be displayed if your app is in the background."
      }
    });
    // message.addData('key1','message1');
    var registrationTokens = [];
    registrationTokens.push('regToken1');
    sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
      if (err) console.error(err);
      else console.log(response);
    });
  },

  sanBusinessUsers : function(req, res, userid, callback) {
    User.find({_id:userid}, function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the events.");
      if (!user) return res.status(404).send("No user found.");
      module.exports.sanGetEvents(req, res, user[0]._id, function(events) {
        var userdata = {
          user: user,
          events: events
        };
        callback(userdata);
      });
    }).sort( { _id: -1 } );
  },

  sanRemoveDuplicates : function(originalArray, prop){
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  },

  sanGetModelById : function(req,res,next,id){
    Model.where({_id: id}).findAsync().then(function(model) {
      return model;
    }).catch(next).error(console.error);
  },

  sanSendMail : function(req, res, mailOptions) {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sandeep.digittrix@gmail.com',
        pass: 'dqubzvltrejhcelg'
      }
    });
    transporter.sendMail(mailOptions, function(error, info){
      console.log(error)
      if (error) {
        return res.status(500).send("There was a problem sending email.");
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  san_middleware : function(req, res,next){
    var token = req.session.token;
    if (!token && req.path != '/admin/login' && !req.path.includes("assets")){
      return res.redirect('login');
    }
    next();
  },

  san_Password : function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },

  sanKey : function(req, res, next) {
    res.json("78d88993fd997052c0e58415a838b30e2a459b21");
  }
}
