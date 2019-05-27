package main

import (
	"encoding/json"
	"fmt"
	"hash/fnv"
	"strconv"
)

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

// FNV32a hashes using fnv32a algorithm
func FNV32a(text string) uint32 {
	algorithm := fnv.New32a()
	algorithm.Write([]byte(text))
	return algorithm.Sum32()
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func cashOut(args []string) (string, error) {

	var userInfos UserInfos
	var err error
	var amount uint64
	var newKey string
	var txIdSum string
	var userBytes []byte

	/// CHECK ARGUMENTS
	if len(args) != 2 {
		return "", fmt.Errorf("cashOut require two arguments, the amount to cash out and a secret, random, 8 char long string string")
	}

	/// CHECK ARGUMENTS
	if len(args[1]) != 8 {
		return "", fmt.Errorf("the secret string must be 8 chars long")
	}

	//generate a hexa version of the txId FNV32a checksum, always 8 char long padded with 0
	fmt.Println("txId : " + STUB.GetTxID())
	txIdSum = fmt.Sprintf("%08x", (FNV32a(STUB.GetTxID())))
	fmt.Println("txidSum : " + txIdSum)

	//generate a hexa version of the txId and secret concatenation FNV32a checksum, always 8 char long padded with 0
	newKey = fmt.Sprintf("%08x", (FNV32a(args[1] + txIdSum)))
	fmt.Println("newKey : " + newKey)

	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	// GET USER INFORMATIONS
	userInfos, err = getUserInfos(userKey)
	if err != nil {
		return "", err
	}

	//Parsing amount
	if amount, err = strconv.ParseUint(args[0], 10, 64); err != nil {
		return "", err
	}

	//check suffiscient funds
	if userInfos.Amount < amount {
		return "", fmt.Errorf("You dont have enough tokens to cash out")
	}

	//Remove funds from user
	userInfos.Amount -= amount

	//writing user to ledger

	userBytes, err = json.Marshal(userInfos)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal user informations: %s", err)
	}

	err = STUB.PutState(userKey, userBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update user informations: %s", err)
	}

	//writing cash to ledger
	err = STUB.PutState(newKey, []byte(args[0]))
	if err != nil {
		return "", fmt.Errorf("Cannot write cash: %s", err)
	}

	//log event
	if err = event(userKey, newKey, amount, "cashOut ["+newKey+"]", "transfer"); err != nil {
		return "", err
	}

	return txIdSum, nil
}
