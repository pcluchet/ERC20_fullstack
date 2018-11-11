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

func userHasShopWithId(usr User, shopId string) (bool, error) {
	var shopUid string

	for _, shopUid = range usr.Shops {
		if shopUid == shopId {
			return true, nil
		}
	}
	return false, nil
}

func shopAddUser(args []string) (string, error) {

	var userBytes []byte
	var shopBytes []byte
	var err error
	var hasThisShop bool

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 2 {
		return "", fmt.Errorf("add user requires two arguments, the shop id where to add the user, and a user address")
	}

	println("Some log")

	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	//verify the caller is part of the given shop
	var usr User

	usr, err = getUser(userKey)
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	hasThisShop, err = userHasShopWithId(usr, args[0])
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	if !hasThisShop {
		return "", fmt.Errorf("You are not authorized to modify this shop user list")
	}

	//verify the given user doesnt already have this shop
	usr, err = getUser(args[1])
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	hasThisShop, err = userHasShopWithId(usr, args[0])
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	if hasThisShop {
		return "", fmt.Errorf("given user already have this shop")
	}

	//update the shop to include the new user
	var shp Shop

	shp, err = getShop(args[0])
	if err != nil {
		return "", fmt.Errorf("Shop not found : %s", err)
	}

	shp.Users = append(shp.Users, args[1])

	//update the user to reference the shop

	usr, err = getUser(args[1])
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	usr.Shops = append(usr.Shops, args[0])

	//commit shop key
	shopBytes, err = json.Marshal(shp)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal shop informations: %s", err)
	}
	err = STUB.PutState(args[0], shopBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot write shop informations: %s", err)
	}

	//commit user key
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
