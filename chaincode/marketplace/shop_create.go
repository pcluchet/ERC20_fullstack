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

func userHasShopNamed(usr User, shopname string) (bool, error) {
	var shopUid string
	var shp Shop
	var err error

	for _, shopUid = range usr.Shops {
		shp, err = getShop(shopUid)
		if err != nil {
			return false, fmt.Errorf("Error : %s", err)
		}
		if shp.Name == shopname {
			return true, nil
		}
	}
	return false, nil
}

func shopCreate(args []string) (string, error) {

	var userBytes []byte
	var shopBytes []byte
	var err error
	var nameExist bool
	var shopId string

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("createBill requires one argument. An item list")
	}

	println("Some log")

	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	var usr User

	usr, err = getUser(userKey)

	nameExist, err = userHasShopNamed(usr, args[0])
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	if nameExist {
		return "", fmt.Errorf("It seems you already have a shop named %s", args[0])
	}

	var shp Shop

	shp.Name = args[0]
	shp.DocType = "Shop"
	shp.Users = append(shp.Users, userKey)

	shopId = STUB.GetTxID()

	//commit shop key
	shopBytes, err = json.Marshal(shp)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal shop informations: %s", err)
	}
	err = STUB.PutState(shopId, shopBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot write shop informations: %s", err)
	}

	usr.Shops = append(usr.Shops, shopId)

	//update user key to reference the new shop
	userBytes, err = json.Marshal(usr)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal user informations: %s", err)
	}
	err = STUB.PutState(userKey, userBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update user informations: %s", err)
	}
	return shopId, nil
}
