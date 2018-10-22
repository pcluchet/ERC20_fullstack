'use strict';

var utils = require('../utils/writer.js');
var Auth = require('../service/AuthService');

var users = require('../db/users');

module.exports.getUserInfos = function getUserInfos (req, res, next) {
  var username = req.swagger.params['username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;

  users.comparepwd_pub(username, xRequestPassword, function (err, result) {
    if (err) {
		returnResponse(res, 403, "Username or password invalid");
        //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      //throw err;
    }
    else {
      console.log('user :' + JSON.stringify(result));
      if (result.valid) {
        const body = {
          "pubkey": result.pubkey
        };
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(body));
		    //returnResponse(res, 200, {"pubkey": result.pubkey});
        //res.send(util.format('{"status" : "ok", "payload" : "", "message" : "", "pubkey" : "%s" }',result.pubkey));
        console.log('succesfully identified');
      }
      else{
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
