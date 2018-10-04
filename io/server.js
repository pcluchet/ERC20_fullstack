'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const bodyParser = require("body-parser");


const app = express();

////////////////////////////////////////////////////////////////////////////////
/// HTTP RESPONSE HANDLER
////////////////////////////////////////////////////////////////////////////////

function		returnResponse(res, code, body) {
	const		response = {
		"code": code,
		"body": body
	};
	if (code >= 200 && code < 300)
		response.status = "success";
	else
		response.status = "failure";
	res.send(JSON.stringify(response));
}

////////////////////////////////////////////////////////////////////////////////
/// HTTP ENTRIES
////////////////////////////////////////////////////////////////////////////////

var util = require('util');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
// App

var users = require('./db/users');


// HTTP GET
app.get('/query/', (req, res) => {
//app.post('/query/', (req, res) => {

	const	username = req.header("username");
	const	password = req.header("password");

	if (!username)
		returnResponse(res, 403, "Username not specified");
	if (!password)
		returnResponse(res, 403, "Password not specified");
	users.comparepwd(username, password, function (err, result) {
    if (err) {
		returnResponse(res, 403, "Username or password invalid");
        //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      //throw err;
    }
    else {
      console.log('user :' + JSON.stringify(result));
      if (result) {
        console.log('succesfully identified');

        var cc = req.body.chaincode;
        if (!cc) {
			returnResponse(res, 412, "Chaincode not specified");
          //TODO : handle error
        }

        var channel = req.body.channel;
        if (!channel) {
			returnResponse(res, 412, "Channel not specified");
          //TODO : handle error
        }

        var func = req.body.func;
        if (!func) {
			returnResponse(res, 412, "Function name not specified");
          //TODO : handle error
        }

        var args = req.body.args;
        if (!args) {
			returnResponse(res, 412, "Arguments not specified");
          //TODO : handle error
        }

        //var peerAddr = 'grpc://localhost:7051';
        var peerAddr = process.env.PEER_ADDR;
        console.log("peerAddr=", peerAddr);
        //var peerListenerAddr = 'grpc://localhost:7053';
        var peerListenerAddr = process.env.PEER_LISTENER_ADDR;
        console.log("peerListenerAddr=", peerListenerAddr);
        //var ordererAddr = 'grpc://localhost:7050';
        var ordererAddr = process.env.ORDERER_ADDR;
        console.log("ordererAddr=", ordererAddr);






        const request = {
          //targets : --- letting this default to the peers assigned to the channel
          chaincodeId: cc,
          fcn: func,
          args: JSON.parse(args)
        };

        //console.log(req.body.param2);
        var query = require('./query.1.js');
        query.cc_query(username, request, channel, peerAddr, ordererAddr, peerListenerAddr).then(
          (result) => {

            console.log(result);

			returnResponse(res, 200, result);
            //res.send(result);
          }
        );



      }
      else
      {
		returnResponse(res, 403, "Username or password invalid");
		//res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      }
    }
  });


});

//TODO
// HTTP POST
app.post('/invoke/', (req, res) => {
	const	username = req.header("username");
	const	password = req.header("password");

	if (!username)
		returnResponse(res, 403, "Username not specified");
	if (!password)
		returnResponse(res, 403, "Password not specified");
  users.comparepwd(username, password, function (err, result) {
    if (err) {
		returnResponse(res, 403, "Username or password invalid");
        //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      //throw err;
    }
    else {
      console.log('user :' + JSON.stringify(result));
      if (result) {
        console.log('succesfully identified');

  var cc = req.body.chaincode;
  if (!cc) {
		returnResponse(res, 412, "Chaincode not specified");
    //TODO : handle error
  }

  var channel = req.body.channel;
  if (!channel) {
		returnResponse(res, 412, "Channel not specified");
    //TODO : handle error
  }

  var func = req.body.func;
  if (!func) {
		returnResponse(res, 412, "Function name not specified");
    //TODO : handle error
  }

  var args = req.body.args;
  if (!args) {
		returnResponse(res, 412, "Arguments not specified");
    //TODO : handle error
  }

  var request = {
    //targets : --- letting this default to the peers assigned to the channel
    chaincodeId: cc,
    fcn: func,
    args: JSON.parse(args),
    chainId: channel,
  };

  console.log("request =", request);


  //var peerAddr = 'grpc://localhost:7051';
  var peerAddr = process.env.PEER_ADDR;
  console.log("peerAddr=", peerAddr);
  //var peerListenerAddr = 'grpc://localhost:7053';
  var peerListenerAddr = process.env.PEER_LISTENER_ADDR;
  console.log("peerListenerAddr=", peerListenerAddr);
  //var ordererAddr = 'grpc://localhost:7050';
  var ordererAddr = process.env.ORDERER_ADDR;
  console.log("ordererAddr=", ordererAddr);

  //console.log(req.body.param2);

  var query = require('./invoke.1.js');
  query.cc_invoke(username, request, channel, peerAddr, ordererAddr, peerListenerAddr).then(
    (result) => {

      console.log(result);

		returnResponse(res, 201, result);
    }
  );

}
else
{
	returnResponse(res, 403, "Username or password invalid");
  //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
}
}
});


  //  res.send("{}");

});

//TODO
// HTTP GET
app.post('/listpeers/', (req, res) => {

	returnResponse(res, 200, {});
  //res.send("{}");

});

// HTTP POST
app.post('/register/', (req, res) => {
	const	username = req.header("username");
	const	password = req.header("password");

	if (!username)
		returnResponse(res, 403, "Username not specified");
	if (!password)
		returnResponse(res, 403, "Password not specified");

//  var caAddr = "http://localhost:7054";

  var caAddr = process.env.CA_ADDR;
  console.log("caAddr=", caAddr);
  //console.log(req.body.param2);
  var query = require('./registerUser.1.js');
  query.ca_register(username, caAddr).then(
    (result) => {
      console.log("res:"+result);

      if (JSON.parse(result).status == "failed")
      {
		  returnResponse(res, 403, "User already exists");
        //res.send("{\"status\" : \"failed\", \"message\": \"User already exists\"}")
        return;
      }

      var user = {  
        email: username,
        password: password,
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
    
    users.create(user, function(err) {  
        if (err) {
              throw err;
                }
          else {
                console.log('user inserted');
            }
    });

  console.log(result);


	const body = {
		"message": "User registered successfully",
		"pubkey": JSON.parse(result).pubkey
	};
	returnResponse(res, 201, body);
  //res.send(util.format("{\"status\" : \"ok\", \"message\": \"User registered successfully\", \"pubkey\" : \"%s\"}",JSON.parse(result).pubkey))
    }
  );

});

//TODO
// HTTP GET
app.post('/auth/', (req, res) => {
	const	username = req.header("username");
	const	password = req.header("password");

	if (!username)
		returnResponse(res, 403, "Username not specified");
	if (!password)
		returnResponse(res, 403, "Password not specified");

  users.comparepwd_pub(username, password, function (err, result) {
    if (err) {
		returnResponse(res, 403, "Username or password invalid");
        //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      //throw err;
    }
    else {
      console.log('user :' + JSON.stringify(result));
      if (result.valid) {
		returnResponse(res, 200, {"pubkey": result.pubkey});
        //res.send(util.format('{"status" : "ok", "payload" : "", "message" : "", "pubkey" : "%s" }',result.pubkey));
        console.log('succesfully identified');
      }
      else{
		  returnResponse(res, 403, "Username or password invalid");
        	//res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      }

}
});
  //  res.send("{}");

});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
