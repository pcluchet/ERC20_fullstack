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

func	isLedgerAdmin() (bool, error) {
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
