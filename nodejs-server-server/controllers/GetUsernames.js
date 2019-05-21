'use strict';

var utils = require('../utils/writer.js');
var Query = require('../service/QueryService');


var users = require('../db/users');


module.exports.GetUsernames = function GetUsernames(req, res, next) {
  var xRequestUsername = req.swagger.params['X-request-username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;
  var xRequestUseToken = req.swagger.params['X-request-use-token'].value;
  var xRequestToken = req.swagger.params['X-request-token'].value;
  var regexsearch = req.swagger.params['pubkeys'].value;
  if (xRequestUseToken) {
    var clientIP = req.connection.remoteAddress;
    console.log("USING TOKEN AUTH");
    users.authByToken(xRequestToken, clientIP, function cb(ret) {
      console.log("CALLBACK 2 valid :" + ret);
      if (!ret.valid) {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Invalid/Expired token provided");
      }
      else {

        console.log('succesfully identified');
        //code here


          if (typeof regexsearch !== 'undefined') {

            try {

              regexsearch = JSON.parse(regexsearch);

            }
            catch (e) {

              if (e instanceof SyntaxError) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end('Public key list must a json list like so ["pubkey1","pubkey2"]');
              }
            }
            try {
              users.searchpubkeys(regexsearch, function (err, result) {
                if (err) {
                  console.log(err);
              res.writeHead(400, { "Content-Type": "text/plain" });
              return res.end('Bad request : Public key list must a json list like so ["pubkey1","pubkey2"]');


                  throw err;
                }
                else {
                  console.log('search worked');
                  res.writeHead(200, { "Content-Type": "application/json" });
                  return res.end(JSON.stringify(result.docs));
                }
              });
            }
            catch (e) {
              res.writeHead(400, { "Content-Type": "text/plain" });
              return res.end('Bad request : Public key list must a json list like so ["pubkey1","pubkey2"]');


            }
          }
      }
    })
  }
  else {
    users.comparepwd(xRequestUsername, xRequestPassword, function (err, result) {
      if (err) {

        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Unauthorized");
      }
      else {
        console.log('user :' + JSON.stringify(result));
        if (result) {
          console.log('succesfully identified using uname/pass');
          //code there

          if (typeof regexsearch !== 'undefined') {

            try {

              regexsearch = JSON.parse(regexsearch);

            }
            catch (e) {

              if (e instanceof SyntaxError) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end('Public key list must a json list like so ["pubkey1","pubkey2"]');
              }
            }
            try {
              users.searchpubkeys(regexsearch, function (err, result) {
                if (err) {
                  console.log(err);
              res.writeHead(400, { "Content-Type": "text/plain" });
              return res.end('Bad request : Public key list must a json list like so ["pubkey1","pubkey2"]');


                  throw err;
                }
                else {
                  console.log('search worked');
                  res.writeHead(200, { "Content-Type": "application/json" });
                  return res.end(JSON.stringify(result.docs));
                }
              });
            }
            catch (e) {
              res.writeHead(400, { "Content-Type": "text/plain" });
              return res.end('Bad request : Public key list must a json list like so ["pubkey1","pubkey2"]');


            }
          }

        }



        else {
          res.writeHead(401, { "Content-Type": "text/plain" });
          return res.end("Unauthorized");
        }
      }
    });

  }
};
