'use strict';

var utils = require('../utils/writer.js');
var Query = require('../service/QueryService');


var users = require('../db/users');


module.exports.ChangePass = function query (req, res, next) {
  var username = req.swagger.params['username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;
  var xRequestUseToken = req.swagger.params['X-request-use-token'].value;
  var xRequestToken = req.swagger.params['X-request-token'].value;
  var xRequestnewpass = req.swagger.params['X-request-newpass'].value;

  var crypto = require('crypto');
	var hash = crypto.createHash('whirlpool');
	//passing the data to be hashed
	var data = hash.update(xRequestnewpass, 'utf-8');
	//Creating the hash in the required format
	var gen_hash = data.digest('hex');

  if (xRequestUseToken)
  {
    var clientIP = req.connection.remoteAddress;
    console.log("USING TOKEN AUTH");
    //users.updatetoken("jx",clientIP,expire,function (){console.log("CALLBACK")});
    users.authByToken(xRequestToken, clientIP, function cb(ret){
      console.log("CALLBACK 2 valid :" + ret);
      if (!ret.valid)
      {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Invalid/Expired token provided");
      }
      else
      {
            console.log('succesfully identified');
            users.updpassword(username,gen_hash, function cb(ret){
            console.log(ret);
            console.log("mouai");
           });
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(ret.value);
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


            users.updpassword(username,gen_hash, function cb(ret) {
            console.log(result);
            console.log(ret);
            console.log("mouai");
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(result.password);
            });
            console.log("ici");
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
