'use strict';

var utils = require('../utils/writer.js');
var Auth = require('../service/AuthService');

var users = require('../db/users');

module.exports.GetMisc = function GetMisc(req, res, next) {
  var username_toget = req.swagger.params['username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;
  var username = req.swagger.params['X-request-username'].value;
  var xRequestUseToken = req.swagger.params['X-request-use-token'].value;
 
  if (xRequestUseToken) 
  {
    var clientIP = req.connection.remoteAddress;
    console.log("USING TOKEN AUTH");
    //users.updatetoken("jx",clientIP,expire,function (){console.log("CALLBACK")});
    users.authByToken(xRequestToken, clientIP, function cb(ret) {
      console.log("CALLBACK 2 valid :" + ret);
      if (!ret.valid) {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Invalid/Expired token provided");
      }
      else {
          users.get(username_toget, function (err, ret) 
          {
            console.log(ret);
            var body = {
              pubkey : ret.pubkey,
              misc_public : ret.misc_public
            };
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(body));
          });
      }
    })
  }
  else 
  {
    users.comparepwd(username, xRequestPassword, function (err, result) {
      if (err) {

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



          users.get(username_toget, function (err, ret) 
          {
            console.log(ret);
            var body = {
              pubkey : ret.pubkey,
              misc_public : ret.misc_public
            };
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(body));
          });
          console.log("ici");
        }
        else {
          res.writeHead(401, { "Content-Type": "text/plain" });
          return res.end("Unauthorized");
          //	returnResponse(res, 403, "Username or password invalid");
          //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
        }
      }
    });

    /*
    Query.query(xRequestUsername,xRequestPassword,channel,chaincode,_function,params)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
      */
  }




};
