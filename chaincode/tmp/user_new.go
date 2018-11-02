package main

import	"fmt"
import	"encoding/json"

func	getUserInfo() ([]byte, error) {
	var err			error
	var	userInfo	UserInfo
	var	bytes		[]byte

	bytes, err = json.Marshal(userInfo)
	if err != nil {
		return nil, fmt.Errorf("Cannot marshal basic user struct. %s", err)
	}
	return bytes, nil
}

func	userNew(args []string) (string, error) {
	var	err			error
	var	userInfo	[]byte

	// CHECK ARGUMENTS
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect argument number. Expecting a public key.")
	}
	// GET USER INFO
	userInfo, err = getUserInfo()
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
