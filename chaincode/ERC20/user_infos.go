package main

import	"encoding/json"
import	"fmt"
import	"strconv"

func (self UserInfos) Set(publicKey string) error {
	var ret		[]byte
	var err		error

	if ret, err = json.Marshal(self); err != nil {
		return err
	}
	if err = STUB.PutState(publicKey, ret); err != nil {
		return err
	}

	return nil
}

func	getUserInfos(userPublicKey string) (UserInfos, error) {
	var	err		error
	var	user	UserInfos
	var	value	[]byte

	value, err = STUB.GetState(userPublicKey)
	if err != nil {
		return user, fmt.Errorf("Failed to get asset: %s with error: %s", userPublicKey, err)
	}
	if value == nil {
		return user, fmt.Errorf("Asset not found: %s", userPublicKey)
	}
	if err = json.Unmarshal(value, &user); err != nil {
		return user, err
	}
	return user, nil
}

func	balanceOf(args []string) (string, error) {
	// TODO :
	// [ ] User is a valid user, or check pubkey validity or whatever
	var	err			error
	var	userInfos	UserInfos

	// CHECK ARGUMENTS
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key")
	}
	// GET USER INFORMATIONS
	userInfos, err = getUserInfos(args[0])
	if err != nil {
		return "", err
	}
	return strconv.FormatUint(userInfos.Amount, 10), nil
}

//returns the amount of an allowance matching given spender in a allowanceouple list
func allowanceOfUser(userInfos UserInfos, spender string) (uint64, error) {
	var	amount	uint64
	var	exist	bool

	amount, exist = userInfos.Allowances[spender]
	if exist == false {
		return 0, fmt.Errorf("Spender not found, maybe he is not allowed by given user")
	}
	return amount, nil
}

//returns the index of a said spender in an allowance list, -1 if not found
//func indexOfSpender(allowanceList AllowanceCouples, spender string) int {
//	return -1
//}

func	allowance(args []string) (string, error) {
	// TODO :
	// [ ] User is a valid user, or check pubkey validity or whatever
	var	err			error
	var	userInfos	UserInfos
	var	amount		uint64

	// CHECK PARAMETERS
	if len(args) != 2 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a token owner public key, and a spender public key")
	}
	// GET USER INFORMATIONS
	userInfos, err = getUserInfos(args[0])
	if err != nil {
		return "", err
	}
	// GET ALLOWANCE AMOUNT
	amount, err = allowanceOfUser(userInfos, args[1])
	if err != nil {
		return "", err
	}

	LOG.Info("Successfull call to allowance") // LOG
	LOG.Info("TokenOwner:", args[0]) // LOG
	LOG.Info("Spender:", args[1]) // LOG

	return strconv.FormatUint(amount, 10), nil
}
