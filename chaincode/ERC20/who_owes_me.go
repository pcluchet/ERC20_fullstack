package	main

import	"fmt"
import	"github.com/hyperledger/fabric/core/chaincode/shim"
import	"encoding/json"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func		loadAllowances(iterator shim.StateQueryIteratorInterface) (string, error) {
	var		err			error
	var		user		UserInfos
	var		allowances	map[string]uint64
	var		allowance	uint64
	var		isPresent	bool
	var		publicKey	string
	var		result		[]byte

	allowances = make(map[string]uint64)
	publicKey, err = getPublicKey()
	if err != nil {
		return "", fmt.Errorf("Cannot user public key: %s", err)
	}
	for iterator.HasNext() {
		result, iter_err := iterator.Next()
		if iter_err != nil {
			return "", fmt.Errorf("Cannot iterate through users: %s", err)
		}
		_, isPresent = ledgerDevKeys[result.Key]
		if isPresent == true {
			continue
		}
		user.Allowances = make(map[string]uint64)
		err = json.Unmarshal(result.Value, &user)
		if err != nil {
			return "", fmt.Errorf("Cannot iterate through users: %s", err)
		}
		allowance, isPresent = user.Allowances[publicKey]
		if isPresent == true {
			allowances[result.Key] = allowance
		}
	}
	iterator.Close()
	result, err = json.Marshal(allowances)
	if err != nil {
		return "", fmt.Errorf("Cannot create allowance list: %s", err)
	}
	return string(result), nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func		whoOwesMe() (string, error) {
	var		err			error
	var		iterator	shim.StateQueryIteratorInterface

	iterator, err = STUB.GetStateByRange("", "")
	if err != nil {
		return "", fmt.Errorf("Cannot get keys iterator: %s", err)
	}
	return loadAllowances(iterator)
}
