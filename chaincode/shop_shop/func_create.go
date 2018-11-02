package main

import	"fmt"
import	"encoding/json"

func	getShopStruct() ([]byte, error) {
	var err			error
	var publicKey	string
	var	shop		Shop
	var	bytes		[]byte

	/// GET PUBLIC KEY
	publicKey, err = getPublicKey()
	if err != nil {
		return nil, err
	}
	/// CREATE STRUCTURE
	shop.Users = make(map[string]bool)
	shop.Users[publicKey] = true
	bytes, err = json.Marshal(shop)
	if err != nil {
		return nil, fmt.Errorf("Cannot marshal shop struct. %s", err)
	}
	return bytes, nil
}

func	funcCreate(args []string) (string, error) {
	var	err			error
	var	shop		[]byte

	/// CHECK ARGUMENTS
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect argument number. Expecting a public key.")
	}
	/// GET SHOP STRUCTURE
	userInfo, err = getShopStruct()
	if err != nil {
		return "", err
	}
	/// PUT STATE
	err = STUB.PutState(args[0], userInfo)
	if err != nil {
		return "", fmt.Errorf("Failed to set asset: %s", args[0])
	}
	return args[1], nil
}
