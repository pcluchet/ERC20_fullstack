'use strict';


/**
 * Register a new user for this organisation
 * 
 *
 * username UUID Username of the new user
 * xRequestPassword String Password of the new user
 * returns inline_response_200_1
 **/
exports.register = function(username,xRequestPassword) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "pubkey" : "pubkey"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

