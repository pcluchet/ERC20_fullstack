'use strict';

var utils = require('../utils/writer.js');
var Register = require('../service/RegisterService');

var users = require('../db/users');

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports.register = function register(req, res, next) {
  var username = req.swagger.params['username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;
  var ReviewToken = req.swagger.params['X-request-peer-review-token'].value;

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
    res.writeHead(401, { "Content-Type": "text/plain" });
    return res.end("Given misc private must have the correct format");
  }

  if ( !validateEmail(misc_private.nuro.web.email))
  {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Given email address is not a valid email address");
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

if (typeof ReviewToken !== 'undefined') {
    users.getUsernameByReviewToken(ReviewToken, function (err, ret) {
      console.log("RESRERSRERS:");
      console.log(ret);
      if (ret.docs.length == 0) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Invalid reviewer token provided");
      }
      else {
        users.UseReviewToken(ret.docs[0]._id, username, ReviewToken, function (err, pro) {
          if (err)
          {
            res.writeHead(400, { "Content-Type": "text/plain" });
            return res.end("Expired reviewer token provided");
          }

    //link new user-> reviewables

    user.reviewable = { projectid : pro, done : false};
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
            user.pubkey = JSON.parse(result).pubkey;

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
            user.reviewables = [];

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

    ///////////////////////::
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {

        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Email couldn't be sent");

        console.log(error);
      } else {

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(body));
      }
    });
    /////////////////////////:::
                }
              });
            }
            catch (e) {
            }

            //return examples;
            //return res.status(404);
            //return "ok";
            //res.send(util.format("{\"status\" : \"ok\", \"message\": \"User registered successfully\", \"pubkey\" : \"%s\"}",JSON.parse(result).pubkey))
          }
        );

    });
    }
    });
  }
  else
  {

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
            user.pubkey = JSON.parse(result).pubkey;

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
            user.reviewables = [];

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

    ///////////////////////::
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {

        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Email couldn't be sent");

        console.log(error);
      } else {

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(body));
      }
    });
    /////////////////////////:::
                }
              });
            }
            catch (e) {
            }

            //return examples;
            //return res.status(404);
            //return "ok";
            //res.send(util.format("{\"status\" : \"ok\", \"message\": \"User registered successfully\", \"pubkey\" : \"%s\"}",JSON.parse(result).pubkey))
          }
        );

  }
  }
  else {
    res.writeHead(401, { "Content-Type": "test/plain" });
    return res.end("Given misc private must have the correct format");
  }
};
