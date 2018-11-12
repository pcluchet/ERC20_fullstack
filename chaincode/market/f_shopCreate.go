package main

import	"fmt"
import	"encoding/json"

////////////////////////////////////////////////////////////////////////////////
/// PRIVATE
////////////////////////////////////////////////////////////////////////////////

func	getShopStruct(name string, userKey string) ([]byte, error) {
	var	err			error
	var	shop		Shop
	var	bytes		[]byte

	shop.Users = []string{userKey}
	shop.Name = name
	bytes, err = json.Marshal(shop)
	if err != nil {
		return nil, fmt.Errorf("Cannot marshal basic shop struct. %s", err)
	}
	return bytes, nil
}

func	getUserStruct(userKey string) ([]byte, error) {
	var	err			error
	var	user		User
	var	userString	string

	str, err = _get([]string{userKey})
	if err != nil {
		return nil, fmt.Errorf("Cannot get user info. %s", err)
	}
	err = json.Unmarshal([]byte(userString), &user)
	if err != nil {
		return nil, fmt.Errorf("Cannot get user info. %s", err)
	}
	Append(user.Shops, )
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC
////////////////////////////////////////////////////////////////////////////////

func	funcShopCreate(args []string) (string, error) {
	var	err			error
	var	publicKey	string
	var	shop		[]byte
	var	user		[]byte

	// GET PUBLIC KEY
	publicKey, err = getPublicKey()
	if err != nil {
		return "", err
	}
	// CHECK ARGUMENTS
	if len(args) != 1 {
		return "", fmt.Errorf("This function requires one argument.")
	}
	// GET SHOP STRUCT
	shop, err = getShopStruct(args[1], publicKey)
	if err != nil {
		return "", err
	}
	fmt.Printf("%s", shop)
	return "", nil
}
