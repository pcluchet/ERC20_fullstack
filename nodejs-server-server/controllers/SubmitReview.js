'use strict';

var utils = require('../utils/writer.js');
var Query = require('../service/QueryService');
var users = require('../db/users');

var reviewSchema ={
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "People": {
      "type": "number"
    },
    "Innovation": {
      "type": "number"
    },
    "Material": {
      "type": "number"
    },
    "Transport": {
      "type": "number"
    },
    "Impact": {
      "type": "number"
    }
  },
  "required": [
    "People",
    "Innovation",
    "Material",
    "Transport",
    "Impact"
  ]
}; 

module.exports.SubmitReview = function (req, res, next) {
  var username = req.swagger.params['username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;
  var xRequestUseToken = req.swagger.params['X-request-use-token'].value;
  var xRequestToken = req.swagger.params['X-request-token'].value;
  var projectid = req.swagger.params['projectid'].value;
  var review = req.swagger.params['X-request-review'].value;

  if (typeof review !== 'undefined')
  {
    try {
    var reviewobj  = JSON.parse(review);
    }
 catch (e) {
  if (e instanceof SyntaxError) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("review data must be a correctly formated JSON string");
  }
  }

  //var projectobj  = JSON.parse(projectdata);

  //var validate = require('jsonschema').validate;

  var Validator = require('jsonschema').Validator;
  var v = new Validator();

  var rv = v.validate(reviewobj, reviewSchema);

  if ( rv != "" )
  {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("project data is not correctly formated : " + rv);
  }
}
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
            users.submitReview(retu.username, projectid, review, function (retz){
            console.log(retz);
            if (retz == "error")
            {
              res.writeHead(400, { "Content-Type": "plain/text" });
              return res.end("Error, maybe you don't have rights for this project");
            }
            res.writeHead(200, { "Content-Type": "plain/text" });
            return res.end("Your review has been successfully processed");
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
            users.submitReview(username, projectid, reviewobj, function (retz){
            if (retz == "error")
            {
            res.writeHead(400, { "Content-Type": "plain/text" });
            return res.end("Error, maybe you don't have rights for this project");
            }
            res.writeHead(200, { "Content-Type": "plain/text" });
            return res.end("Your review has been successfully processed");
           });
      }
      else
      {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Unauthorized");
	  //returnResponse(res, 403, "Username or password invalid");
		//res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      }
    }
  });

 }
};
