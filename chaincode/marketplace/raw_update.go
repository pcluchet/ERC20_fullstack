package main

import (
	"encoding/json"
	"fmt"
)

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	isOriginalSet(id string) (bool, error) {
	var	err			error
	var	raw			Raw
	var	rawBytes	[]byte

	/// GET RAW BYTES
	rawBytes, err = STUB.GetState(id)
	if err != nil{
		return false, fmt.Errorf("Cannot get original raw value.")
	}

	/// UNMARSHAL RAW
	err = json.Unmarshal(rawBytes, &raw)
	if err != nil{
		return false, fmt.Errorf("Cannot unmarshal original raw value.")
	}

	/// CHECK DOCTYPE
	if raw.DocType == "Raw" {
		return true, nil
	} else {
		return false, nil
	}
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	rawUpdate(args []string) (string, error) {
	var err				error
	var	isAdmin			bool
	var	txID			string
	var	rawBytes		[]byte
	var	isSet			bool

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 2 {
		return "", fmt.Errorf("rawUpdate requires two arguments.")
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
	rawBytes, err = getRaw(args[1])
	if err != nil {
		return "", err
	}

	/// IS ORIGINAL RAW SET
	isSet, err = isOriginalSet(args[0])
	if err != nil {
		return "", err
	} else if isSet == false {
		return "", fmt.Errorf("Original raw key is not set into ledger.")
	}

	/// PUT RAW TO LEDGER
	err = STUB.PutState(args[0], rawBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot set raw structure to ledger")
	}
	return txID, nil
}
