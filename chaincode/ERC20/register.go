package main

import (
	"encoding/json"
	"fmt"
)

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func register(args []string) (string, error) {

	var userBytes []byte
	var err error

	/// CHECK ARGUMENTS
	if len(args) != 0 {
		return "", fmt.Errorf("register does not require arguments")
	}

	println("Some log")

	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	/// GET USER
	userBytes, err = STUB.GetState(userKey)
	if err != nil {
		return "", fmt.Errorf("Ledger acess problem, : %s", err)
	}
	/// IF EXISTANT
	if userBytes != nil {
		return "", fmt.Errorf("User creation failed, user already exists")
	}

	var usr UserInfos

	usr.Amount = 10000
	usr.Allowances = make(map[string]uint64)

	userBytes, err = json.Marshal(usr)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal user informations: %s", err)
	}
	err = STUB.PutState(userKey, userBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update user informations: %s", err)
	}
	return "Success", nil
}
