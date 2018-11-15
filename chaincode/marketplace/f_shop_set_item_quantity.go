package main

import "encoding/json"
import "fmt"
import "strconv"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	isItemInShop(shop Shop, itemId string) (bool) {
	var	i		int

	for i = range shop.Items {
		if shop.Items[i] == itemId {
			return true
		}
	}
	return false
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////
func	shopSetItemQuantity(args []string) (string, error) {
	var	err			error
	var	shop		Shop
	var	userKey		string
	var	bytes		[]byte
	var item		ShopItem

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 3 {
		return "", fmt.Errorf("shopSetItemQuantity requires tree arguments.")
	}

	println("Some log")

	/// GET USER PUBLIC KEY
	userKey, err = getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	/// GET SHOP
	shop, err = getShop(args[0])
	if err != nil {
		return "", fmt.Errorf("Cannot get shop informations.")
	} else if isShopAdmin(shop, userKey) == false {
		return "", fmt.Errorf("You are not authorized to modify this shop products")
	}

	/// CHECK IF ITEM IS IN SHOP
	if isItemInShop(shop, args[1]) == false {
		return "", fmt.Errorf("This item is not present in your shop")
	}

	/// GET ITEM
	item, err = getItem(args[1])
	if err != nil {
		return "", fmt.Errorf("Cannot get the item informations.")
	}

	/// UPDATE ITEM
	item.Quantity, err = strconv.ParseUint(args[2], 10, 64)
	if err != nil {
		return "", fmt.Errorf("New quantity cannot be read.")
	}

	/// PUT ITEM TO LEDGER
	bytes, err = json.Marshal(item)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal item informations")
	}
	err = STUB.PutState(args[1], bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update item informations")
	}

	return args[1], nil
}
