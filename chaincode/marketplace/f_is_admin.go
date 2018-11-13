package main

import "fmt"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	isAdmin(args []string) (string, error) {
	var err				error
	var	isAdmin			bool

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 0 {
		return "", fmt.Errorf("isAdmin does not require any argument.")
	}

	println("Some log")

	/// IS USER ADMINISTRATOR
	isAdmin, err = isUserAdmin()
	if err != nil {
		return "", fmt.Errorf("Cannot know is user is administrator.")
	}
	if isAdmin == true {
		return "true", nil
	} else {
		return "false", nil
	}
}
