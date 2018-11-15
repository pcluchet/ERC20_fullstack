package main

import (
	"encoding/json"
	"fmt"
)

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func userHasShopNamed(usr User, shopname string) (bool, error) {
	//var shopUid string
	//var shp Shop
	//var err error

////// TODO: CHECK THIS WITH COUCHDB
	//for _, shopUid = range usr.Shops {
	//	shp, err = getShop(shopUid)
	//	if err != nil {
	//		return false, fmt.Errorf("Error : %s", err)
	//	}
	//	if shp.Name == shopname {
	//		return true, nil
	//	}
	//}
	return false, nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	shopCreate(args []string) (string, error) {
	var	err			error
	var	bytes		[]byte
	var	nameExist	bool
	var	shopId		string
	var	usr			User
	var	shp			Shop

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("shopCreate requires one argument.")
	}

	println("Some log")

	/// GET USER PUBLIC KEY
	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	/// GET USER STRUCT
	usr, err = getUser(userKey)

	/// CHECK IF SHOP EXISTS
	nameExist, err = userHasShopNamed(usr, args[0])
	if err != nil {
		return "", fmt.Errorf("%s", err)
	} else if nameExist {
		return "", fmt.Errorf("Shop name already taken: %s", args[0])
	}

	/// CREATE SHOP
	shp.Name = args[0]
	shp.DocType = "Shop"
	shp.Users = append(shp.Users, userKey)

	/// PUT SHOP TO LEDGER
	bytes, err = json.Marshal(shp)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal shop informations: %s", err)
	}
	shopId = STUB.GetTxID()
	err = STUB.PutState(shopId, bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot write shop informations: %s", err)
	}
	return shopId, nil
}
