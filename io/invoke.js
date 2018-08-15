'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode Invoke
 */

var Fabric_Client = require('fabric-client');
var User = require('fabric-client/lib/User.js');
var path = require('path');
var util = require('util');
var os = require('os');

if (process.argv.length != 3) {
	console.log("Usage: node registerUser.js [name]") 
	return ;
}
//
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('ptwist');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);
var order = fabric_client.newOrderer('grpc://localhost:7050')
channel.addOrderer(order);

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;

/*
// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
	// assign the store to the fabric client
	fabric_client.setStateStore(state_store);
	var crypto_suite = Fabric_Client.newCryptoSuite();
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);
	fabric_client.setCryptoSuite(crypto_suite);

	// get the enrolled user from persistence, this user will sign all requests
	return fabric_client.getUserContext(process.argv[2], true);
}).then((user_from_store) => {
	if (user_from_store && user_from_store.isEnrolled()) {
		console.log(`Successfully loaded ${process.argv[2]} from persistence`);
		member_user = user_from_store;
	} else {
		throw new Error(`Failed to get ${process.argv[2]}.... run registerUser.js`);
	}
	*/

	// get a transaction id object based on the current user assigned to fabric client

	//var usrstr = '{"name":"lole","mspid":"MEDSOSMSP","roles":null,"affiliation":"","enrollmentSecret":"","enrollment":{"signingIdentity":"ba1378c0b330e836fd7e7916e558751e3bd0bc3d09518d44ecd83b37c5173bb4","identity":{"certificate":"-----BEGIN CERTIFICATE-----\nMIICkDCCAjegAwIBAgIUWMIOvUvpcmPedx4ZP3bI5ZD3VpAwCgYIKoZIzj0EAwIw\ndzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\nbiBGcmFuY2lzY28xGzAZBgNVBAoTEk1FRFNPUy5leGFtcGxlLmNvbTEeMBwGA1UE\nAxMVY2EuTUVEU09TLmV4YW1wbGUuY29tMB4XDTE4MDcxOTEyMDkwMFoXDTE5MDcx\nOTEyMTQwMFowQTEwMA0GA1UECxMGY2xpZW50MAsGA1UECxMEb3JnMTASBgNVBAsT\nC2RlcGFydG1lbnQxMQ0wCwYDVQQDEwRsb2xlMFkwEwYHKoZIzj0CAQYIKoZIzj0D\nAQcDQgAEkT0xHOjB9lGUW6Twlqok5UBkDT4XM/yRUjlul//WaWEc5TivDvdI9Dvr\ne9r1G5BnOImZs+rtkFlSdZck79fBV6OB1jCB0zAOBgNVHQ8BAf8EBAMCB4AwDAYD\nVR0TAQH/BAIwADAdBgNVHQ4EFgQU+8UKY+XdStfS3EyRx03cbUJtxeswKwYDVR0j\nBCQwIoAg3y48mSyiCvkDFaQLmUjslFyhpdv9556elGnmLWpPxgswZwYIKgMEBQYH\nCAEEW3siYXR0cnMiOnsiaGYuQWZmaWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQx\nIiwiaGYuRW5yb2xsbWVudElEIjoibG9sZSIsImhmLlR5cGUiOiJjbGllbnQifX0w\nCgYIKoZIzj0EAwIDRwAwRAIgdOWV8C8GVU1EaQc1VtvMhRvzqvVtfFSe6X8Rh96g\nd+oCIH2gv2pwQcsi8SOxAUnjzjW2EM8A36alvQdTIjEFWLmA\n-----END CERTIFICATE-----\n"}}}'

	//var usrstr = '{"name":"lole","mspid":"MEDSOSMSP","roles":null,"affiliation":"","enrollmentSecret":"","enrollment":{"signingIdentity":"ba1378c0b330e836fd7e7916e558751e3bd0bc3d09518d44ecd83b37c5173bb4","identity":{"certificate":"-----BEGIN CERTIFICATE-----MIICkDCCAjegAwIBAgIUWMIOvUvpcmPedx4ZP3bI5ZD3VpAwCgYIKoZIzj0EAwIw\ndzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\nbiBGcmFuY2lzY28xGzAZBgNVBAoTEk1FRFNPUy5leGFtcGxlLmNvbTEeMBwGA1UE\nAxMVY2EuTUVEU09TLmV4YW1wbGUuY29tMB4XDTE4MDcxOTEyMDkwMFoXDTE5MDcx\nOTEyMTQwMFowQTEwMA0GA1UECxMGY2xpZW50MAsGA1UECxMEb3JnMTASBgNVBAsT\nC2RlcGFydG1lbnQxMQ0wCwYDVQQDEwRsb2xlMFkwEwYHKoZIzj0CAQYIKoZIzj0D\nAQcDQgAEkT0xHOjB9lGUW6Twlqok5UBkDT4XM/yRUjlul//WaWEc5TivDvdI9Dvr\ne9r1G5BnOImZs+rtkFlSdZck79fBV6OB1jCB0zAOBgNVHQ8BAf8EBAMCB4AwDAYD\nVR0TAQH/BAIwADAdBgNVHQ4EFgQU+8UKY+XdStfS3EyRx03cbUJtxeswKwYDVR0j\nBCQwIoAg3y48mSyiCvkDFaQLmUjslFyhpdv9556elGnmLWpPxgswZwYIKgMEBQYH\nCAEEW3siYXR0cnMiOnsiaGYuQWZmaWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQx\nIiwiaGYuRW5yb2xsbWVudElEIjoibG9sZSIsImhmLlR5cGUiOiJjbGllbnQifX0w\nCgYIKoZIzj0EAwIDRwAwRAIgdOWV8C8GVU1EaQc1VtvMhRvzqvVtfFSe6X8Rh96g\nd+oCIH2gv2pwQcsi8SOxAUnjzjW2EM8A36alvQdTIjEFWLmA\n-----END CERTIFICATE-----\n"}}}';

//	var usrstr = "%7B%22name%22:%22loltt%22,%22mspid%22:%22MEDSOSMSP%22,%22roles%22:null,%22affiliation%22:%22%22,%22enrollmentSecret%22:%22%22,%22enrollment%22:%7B%22signingIdentity%22:%22bae7aeca34004cf97f9f09ee4b39262ebd127c8b7206e937a69f3c4227c47a60%22,%22identity%22:%7B%22certificate%22:%22-----BEGIN%20CERTIFICATE-----%5CnMIICkjCCAjmgAwIBAgIUQ4VDnI2djAHxezLoIziNdqoa7dIwCgYIKoZIzj0EAwIw%5CndzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh%5CnbiBGcmFuY2lzY28xGzAZBgNVBAoTEk1FRFNPUy5leGFtcGxlLmNvbTEeMBwGA1UE%5CnAxMVY2EuTUVEU09TLmV4YW1wbGUuY29tMB4XDTE4MDcxOTEyNDIwMFoXDTE5MDcx%5CnOTEyNDcwMFowQjEwMA0GA1UECxMGY2xpZW50MAsGA1UECxMEb3JnMTASBgNVBAsT%5CnC2RlcGFydG1lbnQxMQ4wDAYDVQQDEwVsb2x0dDBZMBMGByqGSM49AgEGCCqGSM49%5CnAwEHA0IABGb9c0kyZsoF5yXnX80V+G9g4jjDBIUL+n+nYnAXS4r7BwA7apvm55Is%5Cn6aXEU8KCYej2dGlBywPXUI6YlPeyjzWjgdcwgdQwDgYDVR0PAQH/BAQDAgeAMAwG%5CnA1UdEwEB/wQCMAAwHQYDVR0OBBYEFGis2YUyfXMhe3EstCYN/5YHId1ZMCsGA1Ud%5CnIwQkMCKAIN8uPJksogr5AxWkC5lI7JRcoaXb/eeenpRp5i1qT8YLMGgGCCoDBAUG%5CnBwgBBFx7ImF0dHJzIjp7ImhmLkFmZmlsaWF0aW9uIjoib3JnMS5kZXBhcnRtZW50%5CnMSIsImhmLkVucm9sbG1lbnRJRCI6ImxvbHR0IiwiaGYuVHlwZSI6ImNsaWVudCJ9%5CnfTAKBggqhkjOPQQDAgNHADBEAiBXEAz2funfAUq/DkktuZERJpoh90qZFxi8fHfb%5CnEDYk4gIge94k8WHA2oNcVd9GaIyVuL5Nf/Ws+HOAyAQyvbznHoY=%5Cn-----END%20CERTIFICATE-----%5Cn%22%7D%7D%7D";

	var usrstr = "%7B%22name%22:%22loltt%22,%22mspid%22:%22MEDSOSMSP%22,%22roles%22:null,%22affiliation%22:%22%22,%22enrollmentSecret%22:%22%22,%22enrollment%22:%7B%22signingIdentity%22:%22bae7aeca34004cf97f9f09ee4b39262ebd127c8b7206e937a69f3c4227c47a60%22,%22identity%22:%7B%22certificate%22:%22-----BEGIN%20CERTIFICATE-----MIICkjCCAjmgAwIBAgIUQ4VDnI2djAHxezLoIziNdqoa7dIwCgYIKoZIzj0EAwIwdzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBGcmFuY2lzY28xGzAZBgNVBAoTEk1FRFNPUy5leGFtcGxlLmNvbTEeMBwGA1UEAxMVY2EuTUVEU09TLmV4YW1wbGUuY29tMB4XDTE4MDcxOTEyNDIwMFoXDTE5MDcxOTEyNDcwMFowQjEwMA0GA1UECxMGY2xpZW50MAsGA1UECxMEb3JnMTASBgNVBAsTC2RlcGFydG1lbnQxMQ4wDAYDVQQDEwVsb2x0dDBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABGb9c0kyZsoF5yXnX80V+G9g4jjDBIUL+n+nYnAXS4r7BwA7apvm55Is6aXEU8KCYej2dGlBywPXUI6YlPeyjzWjgdcwgdQwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFGis2YUyfXMhe3EstCYN/5YHId1ZMCsGA1UdIwQkMCKAIN8uPJksogr5AxWkC5lI7JRcoaXb/eeenpRp5i1qT8YLMGgGCCoDBAUGBwgBBFx7ImF0dHJzIjp7ImhmLkFmZmlsaWF0aW9uIjoib3JnMS5kZXBhcnRtZW50MSIsImhmLkVucm9sbG1lbnRJRCI6ImxvbHR0IiwiaGYuVHlwZSI6ImNsaWVudCJ9fTAKBggqhkjOPQQDAgNHADBEAiBXEAz2funfAUq/DkktuZERJpoh90qZFxi8fHfbEDYk4gIge94k8WHA2oNcVd9GaIyVuL5Nf/Ws+HOAyAQyvbznHoY=-----END%20CERTIFICATE-----%22%7D%7D%7D"
	
	var usrstr = decodeURI(usrstr);


	console.log("usrstr=",usrstr);

	var usr = new User("loltt");

//	console.log("usr=",usr);

	var crypto_suite = Fabric_Client.newCryptoSuite();

	//var privkey = "-----BEGIN PRIVATE KEY-----MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgoj6nXBM7xLsS9wQGkHhiRXHBm/MpM4Bgm9bKbAQJAyuhRANCAARm/XNJMmbKBecl51/NFfhvYOI4wwSFC/p/p2JwF0uK+wcAO2qb5ueSLOmlxFPCgmHo9nRpQcsD11COmJT3so81-----END PRIVATE KEY-----"

	//crypto_suite.importKey(privkey, true);

	var TEST_USER_ENROLLMENT = {
		"name": "loltt",
		"mspid": "MEDSOSMSP",
		"roles": null,
		"affiliation": "",
		"enrollmentSecret": "",
		"enrollment": {
		  "signingIdentity": "bae7aeca34004cf97f9f09ee4b39262ebd127c8b7206e937a69f3c4227c47a60",
		  "identity": {
			"certificate": "-----BEGIN CERTIFICATE-----MIICkjCCAjmgAwIBAgIUQ4VDnI2djAHxezLoIziNdqoa7dIwCgYIKoZIzj0EAwIwdzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBGcmFuY2lzY28xGzAZBgNVBAoTEk1FRFNPUy5leGFtcGxlLmNvbTEeMBwGA1UEAxMVY2EuTUVEU09TLmV4YW1wbGUuY29tMB4XDTE4MDcxOTEyNDIwMFoXDTE5MDcxOTEyNDcwMFowQjEwMA0GA1UECxMGY2xpZW50MAsGA1UECxMEb3JnMTASBgNVBAsTC2RlcGFydG1lbnQxMQ4wDAYDVQQDEwVsb2x0dDBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABGb9c0kyZsoF5yXnX80V+G9g4jjDBIUL+n+nYnAXS4r7BwA7apvm55Is6aXEU8KCYej2dGlBywPXUI6YlPeyjzWjgdcwgdQwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFGis2YUyfXMhe3EstCYN/5YHId1ZMCsGA1UdIwQkMCKAIN8uPJksogr5AxWkC5lI7JRcoaXb/eeenpRp5i1qT8YLMGgGCCoDBAUGBwgBBFx7ImF0dHJzIjp7ImhmLkFmZmlsaWF0aW9uIjoib3JnMS5kZXBhcnRtZW50MSIsImhmLkVucm9sbG1lbnRJRCI6ImxvbHR0IiwiaGYuVHlwZSI6ImNsaWVudCJ9fTAKBggqhkjOPQQDAgNHADBEAiBXEAz2funfAUq/DkktuZERJpoh90qZFxi8fHfbEDYk4gIge94k8WHA2oNcVd9GaIyVuL5Nf/Ws+HOAyAQyvbznHoY=-----END CERTIFICATE-----"
		  }
		}
	  }
	usr.setCryptoSuite(crypto_suite);


//	console.log("usr=",usr);
	usr.fromString(JSON.stringify(TEST_USER_ENROLLMENT), true);


//	console.log("usr=",usr);

	fabric_client.setUserContext(usr, true);
	
	tx_id = fabric_client.newTransactionID();
	console.log("Assigning transaction_id: ", tx_id._transaction_id);

	// createCar chaincode function - requires 5 args, ex: args: ['CAR12', 'Honda', 'Accord', 'Black', 'Tom'],
	// changeCarOwner chaincode function - requires 2 args , ex: args: ['CAR10', 'Dave'],
	// must send the proposal to endorsing peers
	var request = {
		//targets: let default to the peer assigned to the client
		chaincodeId: 'fabcar',
		fcn: 'get',
		args: ['a'],
		chainId: 'ptwist',
		txId: tx_id
	};

	// send the transaction proposal to the peers
	channel.sendTransactionProposal(request).then((results) => {
	var proposalResponses = results[0];
	var proposal = results[1];
	let isProposalGood = false;
	if (proposalResponses && proposalResponses[0].response &&
		proposalResponses[0].response.status === 200) {
			isProposalGood = true;
			console.log('Transaction proposal was good');
		} else {
			console.error('Transaction proposal was bad');
		}
	if (isProposalGood) {
		console.log(util.format(
			'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", payload : %s',
			proposalResponses[0].response.status, proposalResponses[0].response.message, proposalResponses[0].response.payload));

		// build up the request for the orderer to have the transaction committed
		var request = {
			proposalResponses: proposalResponses,
			proposal: proposal
		};

		// set the transaction listener and set a timeout of 30 sec
		// if the transaction did not get committed within the timeout period,
		// report a TIMEOUT status
		var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
		var promises = [];

		var sendPromise = channel.sendTransaction(request);
		promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

		// get an eventhub once the fabric client has a user assigned. The user
		// is required bacause the event registration must be signed
		let event_hub = fabric_client.newEventHub();
		event_hub.setPeerAddr('grpc://localhost:7053');

		// using resolve the promise so that result status may be processed
		// under the then clause rather than having the catch clause process
		// the status
		let txPromise = new Promise((resolve, reject) => {
			let handle = setTimeout(() => {
				event_hub.disconnect();
				resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			}, 3000);
			event_hub.connect();
			event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
				// this is the callback for transaction event status
				// first some clean up of event listener
				clearTimeout(handle);
				event_hub.unregisterTxEvent(transaction_id_string);
				event_hub.disconnect();

				// now let the application know what happened
				var return_status = {event_status : code, tx_id : transaction_id_string};
				if (code !== 'VALID') {
					console.error('The transaction was invalid, code = ' + code);
					resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
				} else {
					console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
					resolve(return_status);
				}
			}, (err) => {
				//this is the callback if something goes wrong with the event registration or processing
				reject(new Error('There was a problem with the eventhub ::'+err));
			});
		});
		promises.push(txPromise);

		return Promise.all(promises);
	} else {
		console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
	}
}).then((results) => {
	console.log('Send transaction promise and event listener promise have completed');
	// check the results in the order the promises were added to the promise all list
	if (results && results[0] && results[0].status === 'SUCCESS') {
		console.log('Successfully sent transaction to the orderer.');
	} else {
		console.error('Failed to order the transaction. Error code: ' + results[0].status);
	}

	if(results && results[1] && results[1].event_status === 'VALID') {
		console.log('Successfully committed the change to the ledger by the peer');
	} else {
		console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
	}
}).catch((err) => {
	console.error('Failed to invoke successfully :: ' + err);
});
