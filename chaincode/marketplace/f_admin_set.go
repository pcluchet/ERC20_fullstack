package main

import "fmt"
import "encoding/json"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	adminSet(args []string) (string, error) {
	var err				error
	var	adminList		AdminList

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("adminLet requires one argument.")
	}

	println("Some log")

	/// UNMARSHAL LIST
	err = json.Unmarshal([]byte(args[0]), &adminList)
	if err != nil {
		return "", fmt.Errorf("Cannot unmarshal given admin list.")
	}

	/// CHECK LIST LENGTH
	if len(adminList) == 0 {
		return "", fmt.Errorf("Cannot set an empty admin list.")
	}

	/// SET ADMIN LIST
	err = STUB.PutState(devKeyAdmin, []byte(args[0]))
	if err != nil {
		return "", fmt.Errorf("Cannot set admin list into ledger.")
	}
	return args[0], nil
}
