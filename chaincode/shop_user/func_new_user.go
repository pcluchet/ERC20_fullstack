package main

import	"fmt"
import	"encoding/json"

func	getUserStruct() ([]byte, error) {
	var err			error
	var	user		User
	var	bytes		[]byte

	bytes, err = json.Marshal(user)
	if err != nil {
		return nil, fmt.Errorf("Cannot marshal basic user struct. %s", err)
	}
	return bytes, nil
}

func	funcNewUser(args []string) (string, error) {
	var	err			error
	var	publicKey	string
	var	user		[]byte

	// GET PUBLIC KEY
	publicKey, err = getPublicKey()
	if err != nil {
		return "", err
	}
	// CHECK ARGUMENTS
	if len(args) != 0 {
		return "", fmt.Errorf("This function does not require any argument.")
	}
	// GET USER STRUCTURE
	user, err = getUserStruct()
	if err != nil {
		return "", err
	}
	// PUT STATE
	err = STUB.PutState(publicKey, user)
	if err != nil {
		return "", fmt.Errorf("Failed to set asset: %s", args[0])
	}
	return args[1], nil
}
