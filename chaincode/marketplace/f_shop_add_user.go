package main

import (
	"encoding/json"
	"fmt"
)

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	userHasShopWithId(userKey string, shopId string) (User, bool, error) {
	var	err		error
	var	user	User
	var	isIn	bool

	user, err = getUser(userKey)
	if err != nil {
		return user, false, err
	}
	_, isIn = user.Shops[shopId]
	return user, isIn, nil
	//var shopUid string

	//for _, shopUid = range usr.Shops {
	//	if shopUid == shopId {
	//		return true, nil
	//	}
	//}
	//return false, nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	shopAddUser(args []string) (string, error) {
	var	err			error
	var	userBytes	[]byte
	var	hasThisShop	bool
	var	usr			User
	//var	shopBytes	[]byte
	//var	shp			Shop


	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 2 {
		return "", fmt.Errorf("add user requires two arguments, the shop id where to add the user, and a user address")
	}

	println("Some log")

	/// GET USER PUBLIC KEY
	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	/// CHECK IF USER IS GIVEN SHOP ADMIN
	_, hasThisShop, err = userHasShopWithId(userKey, args[0])
	if err != nil {
		return "", err
	} else if hasThisShop == false {
		return "", fmt.Errorf("You are not authorized to modify this shop admin list")
	}

	/// CHECK IF NEW USER ALREADY HAS THIS SHOP
	usr, hasThisShop, err = userHasShopWithId(args[1], args[0])
	if err != nil {
		return "", err
	} else if hasThisShop == false {
		return "", fmt.Errorf("Given user already has this shop")
	}

	/// ADD SHOP TO NEW USER
	if usr.Shops == nil {
		usr.Shops = make(map[string]bool)
	}
	usr.Shops[args[0]] = true

	/// UPDATE NEW USER TO LEDGER
	userBytes, err = json.Marshal(usr)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal user informations: %s", err)
	}
	err = STUB.PutState(args[1], userBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update user informations: %s", err)
	}
	return "Success", nil
}
