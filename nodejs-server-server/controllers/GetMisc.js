'use strict';

var utils = require('../utils/writer.js');
var Auth = require('../service/AuthService');

var users = require('../db/users');

module.exports.GetMisc = function GetMisc(req, res, next) {
  var username_toget = req.swagger.params['username'].value;
 
          users.get(username_toget, function (err, ret) 
          {
            console.log(ret);
            if (ret === undefined)
            {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("Username not found");
            }
            var body = {
              pubkey : ret.pubkey,
              misc_public : ret.misc_public
            };
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(body));
          });

};
