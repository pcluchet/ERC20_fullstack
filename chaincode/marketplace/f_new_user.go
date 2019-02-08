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

func newUser(args []string) (string, error) {

	var userBytes []byte
	var err error

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	/*
		if len(args) != 1 {
			return "", fmt.Errorf("createBill requires one argument. An item list")
		}
	*/

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

	var usr User
	usr.DocType = "User"

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
