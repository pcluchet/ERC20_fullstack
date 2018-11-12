package main

import (
	"encoding/json"
	"fmt"
)

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	isUserAdmin() (bool, error) {
	var	err			error
	var	userKey		string
	var	adminBytes	[]byte
	var	adminList	AdminList
	var	i			int

	/// GET USER KEY
	userKey, err = getPublicKey()
	if err != nil {
		return false, fmt.Errorf("Cannot get user public key.")
	}
	/// GET ADMINISTRATORS
	adminBytes, err = STUB.GetState(devKeyAdmin)
	if err != nil {
		return false, fmt.Errorf("Ledger acess problem, : %s", err)
	}
	err = json.Unmarshal(adminBytes, &adminList)
	if err != nil {
		return false, fmt.Errorf("Cannot get administrator keys: %s", err)
	}
	/// CHECK IF KEY IS IN ADMIN
	for i = 0; i < len(adminList); i++ {
		if adminList[i] == userKey {
			return true, nil
		}
	}
	return false, nil
}

func	getRaw(arg string) ([]byte, error) {
	var	err				error
	var	raw				Raw
	var	rawSubmission	RawSubmission
	var	rawBytes		[]byte

	err = json.Unmarshal([]byte(arg), &rawSubmission)
	if err != nil {
		return nil, fmt.Errorf("Cannot unmarshal raw submission.")
	}
	raw.Name = rawSubmission.Name
	raw.Detail = rawSubmission.Detail
	raw.DocType = "Raw"
	// TO DO: check if raw name is taken ?
	rawBytes, err = json.Marshal(raw)
	if err != nil {
		return nil, fmt.Errorf("Cannot marshal raw structure.")
	}
	return rawBytes, nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	rawAdd(args []string) (string, error) {
	var err				error
	var	isAdmin			bool
	var	txID			string
	var	rawBytes		[]byte

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("rawAdd requires one argument.")
	}

	println("Some log")

	/// IS USER ADMINISTRATOR
	isAdmin, err = isUserAdmin()
	if err != nil {
		return "", fmt.Errorf("Cannot know is user is administrator.")
	} else if isAdmin == false {
		return "", fmt.Errorf("User must be admin to add raw material.")
	}

	/// GET RAW BYTES
	rawBytes, err = getRaw(args[0])
	if err != nil {
		return "", err
	}

	/// PUT RAW TO LEDGER
	txID = STUB.GetTxID()
	err = STUB.PutState(txID, rawBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot set raw structure to ledger")
	}
	return txID, nil
}
