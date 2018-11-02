package main

import	"fmt"
import	"encoding/json"

func	funcAddUser(args []string) (string, error) {
	var	err			error
	var	publicKey	string
	var	shop		[]byte

	/// GET PUBLIC KEY
	publicKey, err = getPublicKey()
	if err != nil {
		return nil, err
	}
	/// GET SHOP
	if userInfo, err = _get([]string{publicKey}); err != nil {
		return "", err
	}

	if err = json.Unmarshal([]byte(userInfo), &ret); err != nil {
		return "", err
	}

	// CHECK ARGUMENTS
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect argument number. Expecting a public key.")
	}
	// GET SHOP STRUCTURE
	userInfo, err = getShopStruct()
	if err != nil {
		return "", err
	}
	// PUT STATE
	err = STUB.PutState(args[0], userInfo)
	if err != nil {
		return "", fmt.Errorf("Failed to set asset: %s", args[0])
	}
	return args[1], nil
}
