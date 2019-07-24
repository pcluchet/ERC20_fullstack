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

func cashIn(args []string) (string, error) {

	var userInfos UserInfos
	var err error
	var amount uint64
	var cashKey string
	var userBytes []byte
	var readBytes []byte
	var readVoucher CashVoucher

	/// CHECK ARGUMENTS
	if len(args) != 2 {
		return "", fmt.Errorf("cashIn require two arguments, the cashOut txId, and the secret string ascociated")
	}

	cashKey = args[0]
	fmt.Println("cashKey : " + cashKey)

	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	readBytes, err = STUB.GetState(cashKey)
	if err != nil {
		return "", fmt.Errorf("cannot retreive asset")
	}

	if readBytes == nil {
		return "", fmt.Errorf("Provided txId is invalid")
	}

	err = json.Unmarshal(readBytes, &readVoucher)
	if err != nil {
		return "", fmt.Errorf("Cannot unmarshall cash voucher")
	}

	//checking hash
	if readVoucher.Hash != fmt.Sprintf("%08x", (FNV32a(args[1]))) {
		return "", fmt.Errorf("Invalid Hash")
	}

	//Parsing amount
	amount = readVoucher.Amount

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
