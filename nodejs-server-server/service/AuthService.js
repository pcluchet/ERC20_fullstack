'use strict';


/**
 * retreive a user infos
 * 
 *
 * username UUID Username of the user you want to authenticate
 * xRequestPassword String Password of the user
 * returns inline_response_200
 **/
exports.getUserInfos = function(username,xRequestPassword) {
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

