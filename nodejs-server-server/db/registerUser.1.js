'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Register and Enroll a user
 */

module.exports = {
    ca_register:
function (username, caAddr) {

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var util = require('util');
var os = require('os');

/*
if (process.argv.length != 3) {
	console.log("Usage: node registerUser.js [name]") 
	return ;
}
*/

//
var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;

var certif = "";
var pubkey = "";
var privkey = "";
var ret = "";
var status = "ok";
var pp = "";

var store_path = path.join(__dirname, '../hfc-key-store');
console.log(' Store path:'+store_path);

// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
return Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
//    console.log("state store =",state_store);
    // assign the store to the fabric client
    fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();

    //console.log("csuite =", crypto_suite);
    // use the same location for the state store (where the users' certificate are kept)
    // and the crypto store (where the users' keys are kept)
    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});

//    console.log("cstore =", crypto_store);
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
    var	tlsOptions = {
    	trustedRoots: [],
    	verify: false
    };
    // be sure to change the http to https when the CA is running TLS enabled
    fabric_ca_client = new Fabric_CA_Client(caAddr, null , '', crypto_suite);

    // first check to see if the admin is already enrolled
    return fabric_client.getUserContext('admin', true);
}).then((user_from_store) => {
    if (user_from_store && user_from_store.isEnrolled()) {
        console.log('Successfully loaded admin from persistence');
        admin_user = user_from_store;
    } else {
        throw new Error('Failed to get admin.... run enrollAdmin.js');
        status = "failed";
    }

    // at this point we should have the admin user
    // first need to register the user with the CA server
    return fabric_ca_client.register({enrollmentID: username, affiliation: 'org1.department1',role: 'client'}, admin_user);
}).then((secret) => {
    // next we need to enroll the user with CA server
    console.log(`Successfully registered ${username} - secret:`+ secret);

    return fabric_ca_client.enroll({enrollmentID: username, enrollmentSecret: secret});
}).then((enrollment) => {
  console.log(`Successfully enrolled member user "${username}" `);
    privkey =  enrollment.key.toBytes();
    //certif = enrollment.enrollmentCert();
    pp = enrollment.key.getPublicKey().toBytes();

    // Close to one fucking hour wasted here to replace all occurences of newlines in a string
    // JS go to hell
    console.log(pp);
    pp = pp.replace(/-----BEGIN PUBLIC KEY-----/g, "");
    pp = pp.replace(/-----END PUBLIC KEY-----/g, "");
    pp = encodeURI(pp);
    pp = pp.replace(/%0D%0A/g,'');
    //pp = pp.replace(/(\r\n\t|\n|\r\t)/gm,"");


    console.log("pp = ", pp);
    //vad = vad.replace(/\n/g,'');
    /*
    pp = pp.replace(/\n/g, "");
    pp = pp.replace(/-----BEGIN PUBLIC KEY-----/g, "");
    pp = pp.replace(/-----END PUBLIC KEY-----/g, "");
    */
    
    //var KeyEncoder = require('key-encoder');
    //var keyEncoder = new KeyEncoder(enrollment.key._key.ecparams);

    //var pemPublicKey = keyEncoder.encodePublic(enrollment.key._key.pubKeyHex, 'raw', 'pem')
    //console.log("PEM = " + pemPublicKey);
    //console.log("ecparams = " + enrollment.key._key.ecparams);
    console.log("public key =");
    console.log("pYTFGVUKJKBNp=", pp);
    console.log("privkey=",privkey);
    console.log("cert=",certif);
  return fabric_client.createUser(
     {username,
     mspid: 'MEDSOSMSP',
     cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
     });
}).then((user) => {
     member_user = user;

    // console.log("member_user",member_user);
     return fabric_client.setUserContext(member_user);
}).then(()=>{
     console.log(`${username} was successfully registered and enrolled and is ready to interact with the fabric network`);

}).catch((err) => {
    status = "failed";
    console.error('Failed to register: ' + err);
	if(err.toString().indexOf('Authorization') > -1) {
		console.error('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
        'Try again after deleting the contents of the store directory '+store_path);
	}
}).then (
    () => {
        //console.log(util.format( '{status : "%s", response : "%s", message : "%s" }', status, response, message));
        ret = util.format( '{ "pubkey" : "%s", "status" : "%s", "certificate" : "%s", "privkey" : "%s" }',pp, status, encodeURI(certif), encodeURI(privkey));
        console.log(ret);
        return ret;
    }
);
}
}
