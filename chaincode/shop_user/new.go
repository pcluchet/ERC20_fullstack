package main

import	"fmt"

func	_set(args []string) (string, error) {
	var	err	error

	// CHECK ARGUMENTS
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect argument number. Expecting a public key.")
	}
	// PUT STATE
	err = STUB.PutState(args[0], []byte(args[1]))
	if err != nil {
		return "", fmt.Errorf("Failed to set asset: %s", args[0])
	}
	return args[1], nil
}
