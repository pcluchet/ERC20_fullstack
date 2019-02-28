//////////////////////////////// BY CACTUSFLUO /////////////////////////////////

"use strict";

//
// DOC:
// https://hyperledger-fabric.readthedocs.io/en/latest/developapps/wallet.html
// https://hyperledger-fabric.readthedocs.io/en/release-1.4/tutorial/commercial_paper.html
//

////////////////////////////////////////////////////////////////////////////////
/// DATA
////////////////////////////////////////////////////////////////////////////////

let		wallet_mem;
let		wallet_hsm;

const	fs = require("fs");
const	id_manager = new (require("./idmanager"))();

const	ccp = JSON.parse(fs.readFileSync("./network.json").toString());
const	{
	HSMWalletMixin,
	InMemoryWallet,
	Gateway,
	X509WalletMixin
} = require('fabric-network');

////////////////////////////////////////////////////////////////////////////////
/// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function		log(message) {
	console.log(`[INFO] ${message}`);
}

function		done(message) {
	console.log(`[DONE] ${message}`);
}

function		fail(message) {
	console.error(`[FAIL] ${message}`);
	process.exit(1);
}

async function	enroll_user(user) {
	let			options;
	let			secret;

	options = {
		"affiliation": "MEDSOS",
		"role": "client"
	};
	/// IF EXISTS
	if (await wallet_hsm.exists(user) == true) {
		return;
	}
	secret = await id_manager.registerUser(user, options, wallet_mem, "admin");
	await id_manager.enrollToWallet(user, secret, "MEDSOSMSP, wallet_hsm");
	/// IF FAILED
	if (await wallet_hsm.exists(user) == false) {
		fail(`Cannot create user ${user}`);
	}
}

async function	main() {
	const		pkcs_lib_path = "/usr/lib/softhsm/libsofthsm2.so";
	const		slot = "0";
	const		pin = "1234";

	wallet_mem = new InMemoryWallet();
	wallet_hsm = new InMemoryWallet(new HSMWalletMixin(pkcs_lib_path, slot,
	pin));
	/// INIT ID MANAGER WITH CONFIG
	id_manager.initialize(ccp);
	console.log(id_manager.client);
	return;
	/// ENROLL ADMIN
	if (await wallet_mem.exists("admin") == false) {
		await id_manager.enrollToWallet("admin", "adminpw", "MEDSOS",
		wallet_hsm);
	}
	if (await wallet_mem.exists("admin") == true) {
		done("Admin enrolled");
	} else {
		fail("Cannot enroll admin");
	}
	/// ENROLL USER
	await enroll_user("hsm-user");
	//await wallet_hsm.import("user1", {});
}

////////////////////////////////////////////////////////////////////////////////
/// RUN
////////////////////////////////////////////////////////////////////////////////

main();
