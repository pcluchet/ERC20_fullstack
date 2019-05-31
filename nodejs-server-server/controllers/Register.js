'use strict';

var utils = require('../utils/writer.js');
var Register = require('../service/RegisterService');

var users = require('../db/users');

module.exports.register = function register(req, res, next) {
  var username = req.swagger.params['username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;

  //Hotfix
  if (username.charAt(0) == "_") {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Usernames cannot start with underscores");
  }

  var misc_private = req.swagger.params['X-request-misc-private'].value;
  if (typeof misc_private !== 'undefined') {
    try {
      misc_private = JSON.parse(misc_private);
    }
    catch (e) {
      if (e instanceof SyntaxError) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("If provided, misc private data must be a correctly formated JSON string");
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end(e);
      }
    }
  }

  if (typeof misc_private !== 'undefined' &&
        typeof misc_private.nuro !== 'undefined' &&
        typeof misc_private.nuro.web !== 'undefined' &&
        typeof misc_private.nuro.web.email !== 'undefined'
      ) {
      }
      else {
        res.writeHead(401, { "Content-Type": "test/plain" });
        return res.end("Given misc private must have the correct format");
      }
     

  var misc_public = req.swagger.params['X-request-misc-public'].value;

  if (typeof misc_public !== 'undefined') {
    try {
      misc_public = JSON.parse(misc_public);
    }
    catch (e) {
      if (e instanceof SyntaxError) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("If provided, misc public data must be a correctly formated JSON string");
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end(e);
      }
    }
  }
  console.log("Register !!");
      var user = {
        email: username,
        misc_private: misc_private,
        misc_public: misc_public,
        password: xRequestPassword,
        pubkey: "",
      };

      user.validation_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);;

 


      var fs = require('fs');
      var passwordfromfile = fs.readFileSync('./mail_pass.txt', 'utf8');

      if (typeof misc_private !== 'undefined' &&
        typeof misc_private.nuro !== 'undefined' &&
        typeof misc_private.nuro.web !== 'undefined' &&
        typeof misc_private.nuro.web.email !== 'undefined'
      ) {

        //validation mail
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ptwistmail@gmail.com',
            pass: passwordfromfile
          }
        });

        var mailOptions = {
          from: 'ptwistmail@gmail.com',
          to: misc_private.nuro.web.email,
          subject: 'Ptwist Platform validation e-mail',
          text: 'Hello, you just created an account on the Ptwist platform, please click on this link to validate your account : ' +
            'https://api.plastictwist.com/users/' + username + '/validate/' + user.validation_token,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {

        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Email couldn't be sent");
 
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
 //  var caAddr = "http://localhost:7054";

  var caAddr = process.env.CA_ADDR;
  console.log("caAddr=", caAddr);
  //console.log(req.body.param2);
  var query = require('../db/registerUser.1.js');
  query.ca_register(username, caAddr).then(
    (result) => {
      console.log("res:" + result);

      if (JSON.parse(result).status == "failed") {
        res.writeHead(409, { "Content-Type": "text/plain" });
        return res.end("username already exists");
      }
      user.pubkey =  JSON.parse(result).pubkey;

      console.log("pw:" + user.email);
      var crypto = require('crypto');
      var hash = crypto.createHash('whirlpool');
      //passing the data to be hashed
      var data = hash.update(user.password, 'utf-8');
      //Creating the hash in the required format
      var gen_hash = data.digest('hex');

      console.log(gen_hash);
      user.password = gen_hash;
      console.log(result);

      const body = {
        "pubkey": JSON.parse(result).pubkey
      };

     try {
        users.create(user, function (err) {
          if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("User couldn't be created");
 
            throw err;
          }
          else {
            console.log('user inserted');
          }
        });
      }
      catch (e) {
      }

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(body));

     //return examples;
      //return res.status(404);
      //return "ok";
      //res.send(util.format("{\"status\" : \"ok\", \"message\": \"User registered successfully\", \"pubkey\" : \"%s\"}",JSON.parse(result).pubkey))
    }
  );
          }
        });


 
      }
      else {
        res.writeHead(401, { "Content-Type": "test/plain" });
        return res.end("Given misc private must have the correct format");
      }
 
 
};
