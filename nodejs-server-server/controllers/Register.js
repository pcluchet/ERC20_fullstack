'use strict';

var utils = require('../utils/writer.js');
var Register = require('../service/RegisterService');

var users = require('../db/users');

module.exports.register = function register (req, res, next) {
  var username = req.swagger.params['username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;

  //Hotfix
  if (username.charAt(0) == "_")
  {
     res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("Usernames cannot start with underscores");
  }
  
  var misc_private = req.swagger.params['X-request-misc-private'].value;
  if (typeof misc_private !== 'undefined')
  {
    try {
    misc_private  = JSON.parse(misc_private);
    }
   catch (e) {
    if (e instanceof SyntaxError) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("If provided, misc private data must be a correctly formated JSON string");
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end(e);
    }
}
  }

  var misc_public = req.swagger.params['X-request-misc-public'].value;

    if (typeof misc_public !== 'undefined')
    {
      try {
      misc_public  = JSON.parse(misc_public);
      }
   catch (e) {
    if (e instanceof SyntaxError) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("If provided, misc public data must be a correctly formated JSON string");
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end(e);
    }
    }
  }
  console.log("Register !!");

  
//  var caAddr = "http://localhost:7054";

var caAddr = process.env.CA_ADDR;
console.log("caAddr=", caAddr);
//console.log(req.body.param2);
var query = require('../db/registerUser.1.js');
query.ca_register(username, caAddr).then(
  (result) => {
    console.log("res:"+result);

    if (JSON.parse(result).status == "failed")
    {
      res.writeHead(409, { "Content-Type": "text/plain" });
      return res.end("username already exists");
    }
    var user = {  
      email: username,
      misc_private : misc_private,
      misc_public : misc_public,
      password: xRequestPassword,
      pubkey : JSON.parse(result).pubkey,
  };
  
  console.log("pw:" + user.email);
  var crypto = require('crypto');
  var hash = crypto.createHash('whirlpool');
  //passing the data to be hashed
  var data = hash.update(user.password, 'utf-8');
  //Creating the hash in the required format
  var gen_hash= data.digest('hex');
  
  console.log(gen_hash);
  user.password = gen_hash;
  


  try {
 users.create(user, function(err) {  
      if (err) {
            throw err;
              }
        else {
              console.log('user inserted');
          }
  });
    }
   catch (e) {
 
    } 
 

console.log(result);


const body = {
  "pubkey": JSON.parse(result).pubkey
};
res.writeHead(200, { "Content-Type": "application/json" });
return res.end(JSON.stringify(body));
//return examples;
//return res.status(404);
//return "ok";
//res.send(util.format("{\"status\" : \"ok\", \"message\": \"User registered successfully\", \"pubkey\" : \"%s\"}",JSON.parse(result).pubkey))
  }
);
};
