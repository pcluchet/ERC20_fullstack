'use strict';

var utils = require('../utils/writer.js');
var Query = require('../service/QueryService');


var users = require('../db/users');


module.exports.Validate = function Validate (req, res, next) {
  var username = req.swagger.params['username'].value;
  var token = req.swagger.params['token'].value;
  console.log("uname: " + username)
  console.log("token: " + token)


          users.get(username, function (err, ret) 
          {
            console.log(ret);
            if (ret === undefined)
            {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("Username not found");
            }
            if (ret.validation_token == token)
            {
              users.erase_val_token(username, function (err, ret) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                return res.end("Succesfully validated");
              })
           }
            else
            {
            res.writeHead(401, { "Content-Type": "text/plain" });
            return res.end("Provided validation token does not match");
            }
          });

};
