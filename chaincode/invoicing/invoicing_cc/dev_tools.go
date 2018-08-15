package main

import "fmt"

// Set stores the asset (both key and value) on the ledger. If the key exists,
// it will override the value with the new one
func _set(args []string) (string, error) {
	var err error

	// CHECK ARGUMENTS
	if len(args) != 2 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key and a value")
	}
	// PUT STATE
	err = STUB.PutState(args[0], []byte(args[1]))
	if err != nil {
		return "", fmt.Errorf("Failed to set asset: %s", args[0])
	}
	return args[1], nil
}

func _delete(args []string) (string, error) {
	var err error
	// CHECK PARAMETERS
	if len(args) != 2 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key and a value")
	}
	// DELETE STATE
	err = STUB.DelState(args[0])
	if err != nil {
		return "", fmt.Errorf("Failed to delete asset: %s", args[0])
	}
	return args[1], nil
}

// Get returns the value of the specified asset key
func _get(args []string) (string, error) {
	var err error
	var value []byte

	// CHECK ARGUMENTS
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key")
	}
	// GET STATE
	value, err = STUB.GetState(args[0])
	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", args[0], err)
	}
	if value == nil {
		return "", fmt.Errorf("Asset not found: %s", args[0])
	}
	return string(value), nil
}
