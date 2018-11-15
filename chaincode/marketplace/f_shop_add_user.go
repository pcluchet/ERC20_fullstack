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

func	shopAddUser(args []string) (string, error) {
	var	err			error
	var	bytes		[]byte
	var	shop		Shop
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

	/// GET SHOP
	shop, err = getShop(args[0])
	if err != nil {
		return "", fmt.Errorf("Cannot get shop informations.")
	}

	/// CHECK IF USER AND NEW USER ARE ADMIN
	if isShopAdmin(shop, userKey) == false {
		return "", fmt.Errorf("You are not authorized to modify this shop admin list")
	} else if isShopAdmin(shop, args[1]) == false {
		return "", fmt.Errorf("Given user already has this shop")
	}

	/// UPDATE SHOP TO LEDGER
	bytes, err = json.Marshal(shop)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal shop informations: %s", err)
	}
	err = STUB.PutState(args[0], bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update shop informations: %s", err)
	}
	return "Success", nil
}
