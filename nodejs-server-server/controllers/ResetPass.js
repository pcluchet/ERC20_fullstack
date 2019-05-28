'use strict';

var utils = require('../utils/writer.js');
var Query = require('../service/QueryService');


var users = require('../db/users');


module.exports.ResetPass = function ResetPass(req, res, next) {
  var username = req.swagger.params['username'].value;
  var xRequestnewpass = req.swagger.params['X-request-newpass'].value;
  var xRequestemail = req.swagger.params['X-request-email'].value;

  var crypto = require('crypto');
  var hash = crypto.createHash('whirlpool');
  //passing the data to be hashed
  var data = hash.update(xRequestnewpass, 'utf-8');
  //Creating the hash in the required format
  var gen_hash = data.digest('hex');

  users.get(username, function (err, ret) {
    if (ret === undefined) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Username not found/ email does not match");
    }
    if (typeof ret.misc_private !== 'undefined' &&
      typeof ret.misc_private.nuro !== 'undefined' &&
      typeof ret.misc_private.nuro.web !== 'undefined' &&
      typeof ret.misc_private.nuro.web.email !== 'undefined' &&
      xRequestemail == ret.misc_private.nuro.web.email
    ) {
      users.addnewpass(username, gen_hash, function cb(retz) {
        console.log(retz);

        var fs = require('fs');
        var passwordfromfile = fs.readFileSync('./mail_pass.txt', 'utf8');

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
          to: retz.misc_private.nuro.web.email,
          subject: 'Ptwist Platform password reset',
          text: 'Hello, you just requested a pass change, please click on this link to validate the change : ' +
            'https://api.plastictwist.com/users/' + username + '/resetpass/' + retz.newpass_token,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.writeHead(200, { "Content-Type": "text/plain" });
            return res.end("Success, an e-mail has been sent to your email address");
          }
        });
      });
    }
    else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Username not found/ email does not match");
    }
  })
};
