'use strict';

var utils = require('../utils/writer.js');
var Invoke = require('../service/InvokeService');

var users = require('../db/users');

module.exports.invoke = function invoke (req, res, next) {
  var xRequestUsername = req.swagger.params['X-request-username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;
  var channel = req.swagger.params['channel'].value;
  var chaincode = req.swagger.params['chaincode'].value;
  var _function = req.swagger.params['function'].value;
  var params = req.swagger.params['params'].value;

  //only strings in params, cause weird issues otherwise
  params.every(function(element, index, array) {
    array[index] = element.toString();
  });
  console.log(params);

  users.comparepwd(xRequestUsername, xRequestPassword, function (err, result) {
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

  var request = {
    //targets : --- letting this default to the peers assigned to the channel
    chaincodeId: chaincode,
    fcn: _function,
    args: params,
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

  var query = require('../ledger/invoke.1.js');
  query.cc_invoke(xRequestUsername, request, channel, peerAddr, ordererAddr, peerListenerAddr).then(
    (result) => {

      console.log(result);

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(result);
		//returnResponse(res, 201, result);
    }
  );

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

  /*
  Invoke.invoke(xRequestUsername,xRequestPassword,channel,chaincode,_function,params)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
    */


};
