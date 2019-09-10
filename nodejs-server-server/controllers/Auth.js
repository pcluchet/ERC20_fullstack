'use strict';

var utils = require('../utils/writer.js');
var Auth = require('../service/AuthService');

var users = require('../db/users');

module.exports.getUserInfos = function getUserInfos(req, res, next) {
  var username = req.swagger.params['username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;
  var xRequestUseToken = req.swagger.params['X-request-use-token'].value;
  var xRequestTokenExpire = req.swagger.params['X-request-token-expire'].value;
  var autorenew = req.swagger.params['X-request-auto-expand-token'].value;
  var renewduration = req.swagger.params['X-request-auto-expand-duration'].value;
  var linktoip = req.swagger.params['X-request-link-token-to-ip'].value;
  var forever = req.swagger.params['X-request-permanent-token'].value;
 

  users.comparepwd_pub(username, xRequestPassword, function (err, result) {
    if (err) {

      res.writeHead(401, { "Content-Type": "text/plain" });
      return res.end("Unauthorized");

      //returnResponse(res, 403, "Username or password invalid");
      //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      //throw err;
    }
    else {
      console.log('user :' + JSON.stringify(result));
      if (result.valid) {

        users.updLastLogin(username, function cb(lastlogin) {
        var body = {
          "pubkey": result.pubkey,
          "last_login": lastlogin,
          "misc_public": result.fulluser.misc_public,
          "misc_private": result.fulluser.misc_private,
          "projects": result.fulluser.projects,
          "reviewable": result.fulluser.reviewable
        };


        //works
        if (xRequestUseToken) {
          var clientIP = req.connection.remoteAddress;
          var expire = xRequestTokenExpire;
          console.log("REQUESTING TOKEN AUTH");
          users.updatetoken(username, clientIP, expire, renewduration, linktoip, forever, autorenew, function cb(token) {


            console.log("TOKEN IS: " + token);
            body.token = token;

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(body));


          });

          //users.authByToken("fxkoe60cczrv5vo4xao4i9",function cb(){console.log("CALLBACK 2")})
        }
        else
        {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(body));
        //returnResponse(res, 200, {"pubkey": result.pubkey});
        //res.send(util.format('{"status" : "ok", "payload" : "", "message" : "", "pubkey" : "%s" }',result.pubkey));
        console.log('succesfully identified');
        }  
          
        });
 
      }
      else {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Unauthorized");
        //returnResponse(res, 403, "Username or password invalid");
        //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      }
    }
  });

  /*
  Auth.getUserInfos(username,xRequestPassword)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
  */
};
