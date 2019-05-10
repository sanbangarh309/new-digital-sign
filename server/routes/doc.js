const Doc = require.main.require('./models/Doc');
const Signer = require.main.require('./models/Signer');
const Que = require.main.require('./models/Que');
const Template = require.main.require('./models/Template');
const jwt = require('jwt-then');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const San_Function = require.main.require('./functions');
const config = require.main.require('./custom_config');
const User = require.main.require('./user').models.user;
module.exports = (app) => {
    app.post('/api/get_docs', async (req, res, next) => {
        let query = {};
        if(req.body.token){
          const user = await jwt.verify(req.body.token, config.JWT_SECRET);
          const userMatched = await User.findById(user.sub);
          query = { 'user_id': ObjectId(userMatched._id) };
        }
        Doc.find(query)
        .exec()
        .then((docs) => res.json(docs))
        .catch((err) => next(err));
    });

    app.post('/api/add_template', async (req, res, next) => {
      const user = await jwt.verify(req.body.token, config.JWT_SECRET);
      const userMatched = await User.findById(user.sub);
      if (userMatched) {
        San_Function.uploadFinalDoc(req.body.base64Data,function(buffer){
          if (buffer.name) {
            let template = new Template();
            template.user_id = user.sub;
            template.name = buffer.name;
            template.path = buffer.name;
            template.type = buffer.type;
            template.save();
            return res.json(template);
          }
        }) 
      }
    });

    app.get('/api/get_templates',function(req, res, next){
      Template.find({})
        .exec()
        .then((templates) => res.json(templates))
        .catch((err) => next(err));
    });

    app.get('/api/template/:id', async (req,res,next) => {
      Template.findById(req.params.id)
        .exec()
        .then((doc) => {
          res.json(doc);
        })
        .catch((err) => next(err));
    });

    app.get('/api/doc/:id', async (req,res,next) => {
      Doc.findById(req.params.id)
        .exec()
        .then((doc) => {
          res.json(doc);
        })
        .catch((err) => next(err));
    });

    app.post('/api/chktype', (req, res, next) => {
      let base64Data = req.body.doc_file;
      San_Function.uploadBase64Image(base64Data,function(buffer){
        res.json(buffer)
      });
    });

    app.post('/api/savedata',function(req,res){
        var fs = require('fs');
        San_Function.uploadFinalDoc(req.body.base64Data,function(buffer){
          return res.json(buffer)
        });
    });

  app.post('/api/movefile', async (req, res, next) => {
    const fs = require('fs');
    let query = {};
    const { docIds, move_to } = req.body;
    if (docIds) {
      query['_id'] = { $in: docIds};
    }
    const moveFile = (file, dir2) => {
      //include the fs, path modules
      var fs = require('fs');
      var path = require('path');

      //gets file name and adds it to dir2
      var f = path.basename(file);
      var dest = path.resolve(dir2, f);

      fs.rename(file, dest, (err) => {
        if (err) throw err;
        else console.log('Successfully moved');
      });
    };
    const docs = await Doc.find(query);
    let doc_key = 0;
    docs.forEach(doc => {
      doc.path = move_to;
      // for (var key in doc.images) {
      //   console.log(doc.images[key]);
      // }
      let key = 0;
      doc.images.forEach(data => {
        data['path'] = move_to;
        doc.images[key] = data;
        if (fs.existsSync(config.directory + '/uploads/docs/' + data.name)){
          moveFile(config.directory + '/uploads/docs/' + data.name, config.directory + '/uploads/docs/' + move_to + '/');
        }
        key++;
      });
      if (fs.existsSync(config.directory + '/uploads/docs/' + doc.file)) {
        moveFile(config.directory + '/uploads/docs/' + doc.file, config.directory + '/uploads/docs/' + move_to + '/');
      }
      doc.save();
      docs['doc_key'] = doc;
      console.log(doc);
      // console.log(img);
      doc_key++;
    });
    res.json(docs);
  });

    app.post('/api/add_doc', (req, res, next) => {
        San_Function.uploadFinalDoc(req.body.base64Data, async (buffer)=> { 
            const user = await jwt.verify(req.body.token, config.JWT_SECRET);
            const userMatched = await User.findById(user.sub);
            // console.log(userMatched);
            if (userMatched) { 
              if (buffer.name) {
                  let doc = new Doc();
                  doc.user_id = user.sub;
                  doc.title = buffer.name;
                  doc.price = req.body.price || 0;
                  doc.description = req.body.description || '';
                  doc.file = buffer.name;
                  doc.images = req.body.docs;
                  doc.save();
                  return res.json(doc);
              }else{
                return res.json({msg:'file not exist'});
              }
            }else{
              return res.json({msg:'user not exist'});
            }
      });
    });

    app.post('/api/open_template',async (req,res,next) => {
      const user = await jwt.verify(req.body.token, config.JWT_SECRET);
      const userMatched = await User.findById(user.sub);
      if(userMatched){
        const template = await Template.findById(req.body.id);
        if(template){
          San_Function.pdfToImage(template.name, async (data) => {
            template.images = data.message;
            template.save();
            return res.json(template);
          });
        }else{
          return res.json('template not found');
        }
      }else{
        return res.json('template not found');
      }
    });

    app.post('/api/addfield',async (req,res,next) => {
      const {signer,signer_clr,docId} = req.body;
      const user = await jwt.verify(req.body.token, config.JWT_SECRET);
      const userMatched = await User.findById(user.sub);
      let signer_user = new Signer();
      signer_user.name = signer;
      signer_user.added_by = userMatched._id;
      signer_user.color = signer_clr;
      // if(!signer_user.shared_with.includes(docId)){
      //   signer_user.shared_with.push(docId);
      // }
      signer_user.save();
      res.json(signer_user);
    });

    app.post('/api/createfolder',async (req,res,next) => {
      const {folder} = req.body;
      var fs = require('fs');
      var dir = config.directory+'/uploads/docs/'+folder;
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      res.json({success:true,msg:'Directory Created Successfully'});
    });

    app.post('/api/get_folders',async (req,res,next) => {
      const {token} = req.body;
      const user = await jwt.verify(token, config.JWT_SECRET);
      const userMatched = await User.findById(user.sub);
      let src = config.directory+'/uploads/docs/';
      if(userMatched){
        const { lstatSync, readdirSync } = require('fs')
        const { join } = require('path')
        const isDirectory  = source => lstatSync(source).isDirectory() 
        const getDirectories = readdirSync(src).map(name => join(src, name)).filter(isDirectory);
        res.json(getDirectories);
      }
    });

    app.delete('/api/folder/:folder', (req, res, next) => {
      var fs = require('fs');
      let dir = config.directory+'/uploads/docs/'+req.params.folder;
      if(fs.existsSync(dir)){
        // fs.unlinkSync(req.params.folder).then(() => {
        //   res.json({success:true,msg:'Directory Deleted Successfully'});
        // }).catch(err => {
        //   res.json({success:false,msg:'Wrong'});
        //   console.error(err)
        // })
        fs.rmdirSync(dir);
        res.json({success:true,msg:'Directory Deleted Successfully'});
      }else{
        res.json({success:false,msg:'Wrong'});
      }
    });

    app.put('/api/folder', (req, res, next) => {
      var fs = require('fs');
      let olddir = config.directory+'/uploads/docs/'+req.body.old_folder;
      let newdir = config.directory+'/uploads/docs/'+req.body.folder;
      if(fs.existsSync(olddir)){
        try {
          fs.renameSync(olddir, newdir)
          res.json({success:true,msg:'Directory Renamed Successfully'});
        } catch (err) {
          res.json({success:false,msg:'Wrong'});
          console.error(err)
        }
      }else{
        res.json({success:false,msg:'Wrong'});
      }
    });

    app.get('/api/get_files/:folder', async (req,res,next) => {
      const fs = require('fs'); 
      let src = config.directory+'/uploads/docs/'+req.params.folder;
      let files_ = [];
      fs.readdir(src, (err, files) => {
        if(files.length <=0){
          return res.json({success:false,msg:'Documents Not Found'});
        }
        files.forEach(file => {
          files_.push(file);
        });
        return res.json({success:true,msg:files_});
      });
    });

    app.post('/api/signers', async (req, res, next) => {
      let query = {};
      if(req.body.ids){
        query['_id'] = { $in: req.body.ids };
        // query = { field: { $in: req.body.ids } };
      }
      if(req.body.token){
        const user = await jwt.verify(req.body.token, config.JWT_SECRET);
        const userMatched = await User.findById(user.sub);
        query['added_by'] = ObjectId(userMatched._id); console.log(query);
        // query = { 'added_by': ObjectId(userMatched._id) };
        Signer.find(query)
        .exec()
        .then((signers) => res.json(signers))
        .catch((err) => next(err));
      }else{
        res.json({success:false})
      }
    });

    app.get('/api/signer/:id', async (req,res,next) => {
      Signer.findById(req.params.id)
        .exec()
        .then((signer) => {
          res.json(signer);
        })
        .catch((err) => next(err));
    });

    app.post('/api/sendemail', async (req,res,next) => {
      let link = 'http://'+req.headers.host+'/signature/'+req.body.id+'?sign=';
      let img = "http://"+req.headers.host+"/assets/img/fina-logo.png";
      if(req.body.id && req.body.emails.length > 0 && req.body.token){
        const user = await jwt.verify(req.body.token, config.JWT_SECRET);
        const userMatched = await User.findById(user.sub);
        let order = 0;
        req.body.emails.forEach(el => {
          let que = new Que();
          que.email = el.email;
          que.signer_id = el.signer_id;
          que.doc_id = req.body.id;
          que.order = order;
          // if(order == 0){
            que.email_sent = 'yes';
          // }
          que.link = link+el.signer_id;
          que.save();
          order++;
          link = link+el.signer_id;
          var mailOptions = {
            from: userMatched.email,
            to: el.email,
            subject: req.body.subject,
            html: '<div><b><font style="font-family:tahoma;font-size:8pt"><div style="text-align:center;font-size: 20px;">'+ req.body.message+'</div><br/>Click To Sign:<br/>-------------------<br/><a href="'+ link+'"><img src="'+img+'" width=100 /></a></font></b></div>'
          };
          San_Function.sanSendMail(req, res, mailOptions);
        });
        return res.json({success:true,msg:'Document Shared Successfully'});
        // Doc.findById(req.body.id)
        // .exec()
        // .then((doc) => {
        //   let img = '';
        //   if(doc.images){
        //     // img = "http://"+req.headers.host+"/files/docs/"+doc.images[0].name;
            
        //   }else{
        //     return false;
        //   }
        //   var mailOptions = {
        //     from: 'sandeep.digittrix@gmail.com',
        //     to: email_to,
        //     subject: req.body.subject,
        //     html: '<div><b><font style="font-family:tahoma;font-size:8pt"><div style="text-align:center;font-size: 20px;">'+ req.body.message+'</div><br/>Click To Sign:<br/>-------------------<br/><a href="'+ link+'"><img src="'+img+'" width=100 /></a></font></b></div>'
        //   };
        //   San_Function.sanSendMail(req, res, mailOptions);
        //   return res.json(doc);
        // }).catch((err) => next(err));
      }
    });

    app.delete('/api/doc/:id', (req, res, next) => {
        Doc.findOneAndRemove({_id: req.params.id})
        .exec()
        .then((doc) => {
          var fs = require('fs');
          if ( typeof doc.file !== 'undefined' && doc.file && fs.existsSync(config.directory+'/uploads/docs/'+doc.file)){
            fs.unlink(config.directory+'/uploads/docs/'+doc.file);
          }
          if ( typeof doc.images !== 'undefined' && doc.images[0]){
            doc.images.forEach(el => {
              if(fs.existsSync(config.directory+'/uploads/docs/'+el.name)){
                fs.unlink(config.directory+'/uploads/docs/'+el.name);
              }
            });
            let strn = doc.images[0].name.replace("_cnvrt_1", "").split('.');
            let pdf_file = strn[0]+'.pdf';
            if(pdf_file && fs.existsSync(pdf_file)){
              fs.unlink(config.directory+'/uploads/docs/'+pdf_file);
            }
          }
          res.json(doc);
        })
        .catch((err) => next(err));
    });

    app.delete('/api/template/:id', (req, res, next) => {
      Template.findOneAndRemove({_id: req.params.id})
        .exec()
        .then((doc) => {
          var fs = require('fs');
          if ( typeof doc.name !== 'undefined' && doc.name && fs.existsSync(config.directory+'/uploads/docs/'+doc.name)){
            fs.unlink(config.directory+'/uploads/docs/'+doc.name);
          }
          // if ( typeof doc.images !== 'undefined' && doc.images[0]){
          //   doc.images.forEach(el => {
          //     if(fs.existsSync(config.directory+'/uploads/docs/'+el.name)){
          //       fs.unlink(config.directory+'/uploads/docs/'+el.name);
          //     }
          //   });
          //   let strn = doc.images[0].name.replace("_cnvrt_1", "").split('.');
          //   let pdf_file = strn[0]+'.pdf';
          //   if(pdf_file && fs.existsSync(pdf_file)){
          //     fs.unlink(config.directory+'/uploads/docs/'+pdf_file);
          //   }
          // }
          res.json(doc);
        })
        .catch((err) => next(err));
    });

    app.put('/api/doc/:id', (req, res, next) => {
      var fs = require('fs');
      San_Function.uploadFinalDoc(req.body.base64Data, async (buffer)=> {
        Doc.findById(ObjectId(req.params.id))
        .exec()
        .then((doc) => {
            if(doc.file && fs.existsSync(config.directory + "/uploads/docs/"+doc.file)){
              fs.unlinkSync(config.directory + "/uploads/docs/"+doc.file);
            }
            doc.images = req.body.docs;
            doc.title = buffer.name;
            doc.file = buffer.name;
            doc.save()
            .then(() => res.json(doc))
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
      });
    });

    app.get('/files/:type/:img_name', function(req,res){
          var filename = req.params.img_name;
          var type = req.params.type;
          var ext  = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
          if (!ext) {
            ext = 'jpg';
          }
          if (ext == 'svg') {
            ext = 'svg+xml';
          }
          var fs = require('fs');
          var fileDir = config.directory+'/uploads/'+type+'/';
          fs.readFile(fileDir + filename, function (err, content) {
            if (ext == 'pdf') {
              res.writeHead(200,{'Content-type':'application/pdf'});
              res.end(content);
            }else if (err) {
              res.writeHead(400, {'Content-type':'text/html'})
              res.end("No such image");
            } else {
              //specify the content type in the response will be an image
              res.writeHead(200,{'Content-type':'image/'+ext});
              res.end(content);
            }
          });
      });
};
