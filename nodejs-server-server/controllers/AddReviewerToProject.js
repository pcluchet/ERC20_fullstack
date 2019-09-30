'use strict';

var utils = require('../utils/writer.js');
var Query = require('../service/QueryService');
var users = require('../db/users');

function SendMailToInviteReviewer(reviewer_mail,review_token, next)
{
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
     to: reviewer_mail,
     subject: 'Ptwist platform project review invitation',
     text: 'Hello, you have been invited to review a project on the Ptwist platform, please click on this link to validate your account : ' +
       'https://api.plastictwist.com/users/' + 'xyz' + '/review/' + review_token,
   };

   transporter.sendMail(mailOptions, function (error, info) {
     if (error) {
      console.log(error);
      next("error");
       return;
     } else {
       console.log('Email sent: ' + info.response);
      next("ok");
      return;
 
     }
    });

}

module.exports.AddReviewerToProject = function (req, res, next) {
  var username = req.swagger.params['username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;
  var xRequestUseToken = req.swagger.params['X-request-use-token'].value;
  var xRequestToken = req.swagger.params['X-request-token'].value;
  var projectid = req.swagger.params['projectid'].value;
  var reviewer_mail = req.swagger.params['reviewer_mail'].value;
  if (xRequestUseToken)
  {
    var clientIP = req.connection.remoteAddress;
    console.log("USING TOKEN AUTH");
    //users.updatetoken("jx",clientIP,expire,function (){console.log("CALLBACK")});
    users.authByToken(xRequestToken, clientIP, function (retu){
      console.log("CALLBACK 2 valid :" + retu);
      if (!retu.valid)
      {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Invalid/Expired token provided");
      }
      else
      {
            console.log('succesfully identified');
            users.addReviewer(retu.username, projectid, function (retz){
            console.log(retz);
            if (retz == "error")
            {
              res.writeHead(400, { "Content-Type": "plain/text" });
              return res.end("Error, maybe you don't have rights for this project");
            }

            if (typeof reviewer_mail != "undefined") {
            SendMailToInviteReviewer(
              reviewer_mail,
              retz.token,
              function (mailok){

                if (mailok == "error")
                {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    return res.end("Error : Email couldnt be sent");
                }
                else
                {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify(retz));
                }
              }
            );
            } else {
                     res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify(retz));
            }
           });
      }
    })
  }
  else
  {
  users.comparepwd(username, xRequestPassword, function (err, result) {
    if (err) 
    {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Unauthorized");
		//returnResponse(res, 403, "Username or password invalid");
        //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      //throw err;
    }
    else {
      console.log('user :' + JSON.stringify(result));
      if (result) {
        console.log('succesfully identified');


            users.addReviewer(username, projectid, function (retz){
            console.log(retz);
            if (retz == "error")
            {
            res.writeHead(400, { "Content-Type": "plain/text" });
            return res.end("Error, maybe you don't have rights for this project");
            }
 
            if (typeof reviewer_mail != "undefined") {
            SendMailToInviteReviewer(
              reviewer_mail,
              retz.token,
              function (mailok){

                if (mailok == "error")
                {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    return res.end("Error : Email couldnt be sent");
                }
                else
                {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify(retz));
                }
              }
            );
            } else {
                     res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify(retz));
            }
           });
 

      }
      else
      {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Unauthorized");
	//	returnResponse(res, 403, "Username or password invalid");
		//res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      }
    }
  });
 }
};
