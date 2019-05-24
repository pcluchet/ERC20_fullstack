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
func shopDeleteItem(args []string) (string, error) {
	var err error
	var shop Shop
	var item ShopItem
	var userKey string
	var indexInItemList int
	var LedgerAdmin bool

	var shopBytes []byte
	/*
		var bytes []byte
		var newItemId string
		var itemToAdd ShopItemSubmission
		var newItem ShopItem
		var endtime uint64
	*/

	/// CHECK ARGUMENTS
	if len(args) != 1 {
		return "", fmt.Errorf("delete item requires one arguments, the shop item id")
	}

	println("Some log")

	/// GET USER PUBLIC KEY
	userKey, err = getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	/// GET ITEM
	item, err = getItem(args[0])
	if err != nil {
		return "", fmt.Errorf("Cannot get item informations.")
	}

	shop, err = getShop(item.ShopId)
	LedgerAdmin, err = isLedgerAdmin()

	if err != nil {
		return "", fmt.Errorf("Cannot get shop informations.")
	} else if isShopAdmin(shop, userKey) == false && LedgerAdmin == false {
		return "", fmt.Errorf("You are not authorized to modify this item (not admin of item shop)")
	}

	// Find item in the shop item list

	indexInItemList = 0
	for index, element := range shop.Items {
		if element == args[0] {
			indexInItemList = index
			break
		}
	}

	shop.Items[len(shop.Items)-1], shop.Items[indexInItemList] = shop.Items[indexInItemList], shop.Items[len(shop.Items)-1]
	shop.Items = shop.Items[:len(shop.Items)-1]

	//writing shop to ledger

	shopBytes, err = json.Marshal(shop)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal shop object: %s", err)
	}
	err = STUB.PutState(item.ShopId, shopBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update shop object: %s", err)
	}

	//deleting item key

	shopBytes, err = json.Marshal(shop)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal shop object: %s", err)
	}
	err = STUB.DelState(args[0])
	if err != nil {
		return "", fmt.Errorf("Cannot delete item object: %s", err)
	}

	return "Deletion success", nil
}
