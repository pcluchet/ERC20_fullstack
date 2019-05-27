package main

import (
	"encoding/json"
	"fmt"
	"strconv"
)

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func cashIn(args []string) (string, error) {

	var userInfos UserInfos
	var err error
	var amount uint64
	var cashKey string
	var userBytes []byte
	var readAmount []byte

	/// CHECK ARGUMENTS
	if len(args) != 2 {
		return "", fmt.Errorf("cashIn require two arguments, a FNV32a hash of the cashOut txId, and the secret, random, 8 char long string string ascociated")
	}

	/// CHECK ARGUMENTS
	if len(args[0]) != 8 {
		return "", fmt.Errorf("the hash string must be 8 chars long")
	}

	if len(args[1]) != 8 {
		return "", fmt.Errorf("the secret string must be 8 chars long")
	}

	//generate a hexa version of the txId and secret concatenation FNV32a checksum, always 8 char long padded with 0
	cashKey = fmt.Sprintf("%08x", (FNV32a(args[1] + args[0])))
	fmt.Println("cashKey : " + cashKey)

	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	readAmount, err = STUB.GetState(cashKey)
	if err != nil {
		return "", fmt.Errorf("cannot retreive asset")
	}
	if readAmount == nil {
		return "", fmt.Errorf("Provided txId Hash and/or secret is invalid")
	}

	//Parsing amount
	if amount, err = strconv.ParseUint(string(readAmount), 10, 64); err != nil {
		return "", err
	}

	//GET USER INFORMATIONS
	userInfos, err = getUserInfos(userKey)
	if err != nil {
		return "", err
	}

	//Add funds to user
	userInfos.Amount += amount

	//writing user to ledger
	userBytes, err = json.Marshal(userInfos)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal user informations: %s", err)
	}

	err = STUB.PutState(userKey, userBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update user informations: %s", err)
	}

	//deleting cash key
	err = STUB.DelState(cashKey)
	if err != nil {
		return "", fmt.Errorf("Cannot delete cash : %s", err)
	}

	//log event
	if err = event(cashKey, userKey, amount, "cashIn ["+cashKey+"]", "transfer"); err != nil {
		return "", err
	}

	return "cash in success", nil

}
