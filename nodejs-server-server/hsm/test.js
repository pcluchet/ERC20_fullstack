"use strict";

//
// DOC:
// https://hyperledger-fabric.readthedocs.io/en/latest/developapps/wallet.html
// https://hyperledger-fabric.readthedocs.io/en/release-1.4/tutorial/commercial_paper.html
//

const	fs = require("fs");
const	id_manager = new (require("./idmanager"))();

const	ccp = JSON.parse(fs.readFileSync("./network.json").toString());
const	{
	HSMWalletMixin,
	InMemoryWallet,
	Gateway,
	X509WalletMixin
} = require('fabric-network');

async function	main() {
	const		pkcs_lib_path = "/usr/lib/softhsm/libsofthsm2.so";
	const		slot = "0";
	const		pin = "1234";
	const		wallet_mem = new InMemoryWallet();
	const		wallet_hsm = new InMemoryWallet(new HSMWalletMixin(
				pkcs_lib_path, slot, pin));

	//console.log(ccp);
	id_manager.initialize(ccp);
	console.log(await wallet_mem.exists("admin"));
	await id_manager.enrollToWallet("admin", "adminpw", "MEDSOS", wallet_hsm);
	console.log(await wallet_mem.exists("admin"));
	//await wallet_hsm.import("user1", {});
}

main();
