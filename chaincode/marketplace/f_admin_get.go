package main

import "fmt"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	adminGet(args []string) (string, error) {
	var err				error
	var	adminList		[]byte

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 0 {
		return "", fmt.Errorf("adminGet does not require any argument.")
	}

	println("Some log")

	adminList, err = STUB.GetState(devKeyAdmin)
	if err != nil {
		return "", fmt.Errorf("Cannot get admin list from ledger.")
	}
	return string(adminList), nil
}
