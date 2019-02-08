"use strict";

const {
	HSMWalletMixin:		hsm_wallet,
	InMemoryWallet:		in_mem_wallet,
	Gateway:			gateway
} = require('fabric-network');

async function	main() {
	const		pkcs_lib_path = "/usr/lib/softhsm/libsofthsm2.so"; // UBUNTU
	const		slot = "0";
	const		pin = "98765432";

	let	wallet = new in_mem_wallet(new hsm_wallet(pkcs_lib_path, slot, pin));

	console.log(hsm_wallet);
	console.log(gateway);
	console.log(in_mem_wallet);
	console.log(wallet);
}

main();
