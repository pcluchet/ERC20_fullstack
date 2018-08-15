package	main

import	"fmt"
import	"github.com/hyperledger/fabric/core/chaincode/shim"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func		loadUsers(iterator shim.StateQueryIteratorInterface) (string, error) {
	var		isDev		bool
	var		users		string

	for iterator.HasNext() {
		result, iter_err := iterator.Next()
		if iter_err != nil {
			return "", fmt.Errorf("Cannot iterate through users.")
		}
		_, isDev = ledgerDevKeys[result.Key]
		if isDev == true {
			continue
		}
		if users == "" {
			users = fmt.Sprintf("\"%s\"", result.Key)
		} else {
			users = fmt.Sprintf("%s,\"%s\"", users, result.Key)
		}
	}
	iterator.Close()
	users = "[" + users + "]"
	return users, nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func		listUsers() (string, error) {
	var		err			error
	var		iterator	shim.StateQueryIteratorInterface

	iterator, err = STUB.GetStateByRange("", "")
	if err != nil {
		return "", fmt.Errorf("Cannot get keys iterator.")
	}
	return loadUsers(iterator)
}
