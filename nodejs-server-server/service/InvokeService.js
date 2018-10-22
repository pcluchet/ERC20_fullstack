'use strict';


/**
 * Invoke (commit mode) a the chaincode
 * 
 *
 * xRequestUsername String username
 * xRequestPassword String Password of the user
 * channel String channel in which the transaction will occur
 * chaincode String Name of the chaincode to invoke
 * _function String function to invoke in given chaincode
 * params List parameters sent to the chaincode
 * returns inline_response_200_2
 **/
exports.invoke = function(xRequestUsername,xRequestPassword,channel,chaincode,_function,params) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "payload" : "payload"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

