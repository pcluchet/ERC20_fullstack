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
func	shopAddItem(args []string) (string, error) {
	var	err			error
	var	shop		Shop
	var	userKey		string
	var	bytes		[]byte
	var	newItemId	string
	var	itemToAdd	ShopItemSubmission
	var	newItem		ShopItem
	var	endtime		uint64
	//var listBytes []byte

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 2 {
		return "", fmt.Errorf("add item requires two arguments, the shop id where to add the item, and a item json")
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
		return "", fmt.Errorf("You are not authorized to modify this shop user list")
	}

	/// GET ITEM SUBMISSION
	err = json.Unmarshal([]byte(args[1]), &itemToAdd)
	if err != nil {
		return "", fmt.Errorf("Cannot unmarshal item: %s", err)
	}

	/// CREATE NEW ITEM
	newItemId = STUB.GetTxID()

	if itemToAdd.Price < 0 {
		return "", fmt.Errorf("Item price cannot be negative ")
	} else if itemToAdd.Duration <= 0 {
		return "", fmt.Errorf("Offer duration cannot be 0 or negative")
	}
	if itemToAdd.Bidable == false && itemToAdd.MinQuantity < 0 {
		return "", fmt.Errorf("Cannot set a minimum quantity purchase of 0")
	}
	newItem.Name = itemToAdd.Name
	newItem.Quantity = itemToAdd.Quantity
	newItem.MinQuantity = itemToAdd.MinQuantity
	newItem.Detail = itemToAdd.Detail
	newItem.AdditionalFields = itemToAdd.AdditionalFields
	newItem.Picture = itemToAdd.Picture
	//TODO: verify arg
	newItem.ShopId = args[0]
	newItem.Biddable = itemToAdd.Bidable
	newItem.DocType = "ShopItem"
	newItem.Price = itemToAdd.Price
	endtime = itemToAdd.Duration * 3600

	/// CREATE ITEM TIMESTAMP
	txTimeStamp, err2 := STUB.GetTxTimestamp()
	if err2 != nil {
		return "", fmt.Errorf("Error :%s", err2)
	}
	newItem.CreationDate = uint64(txTimeStamp.Seconds)
	newItem.ExpireDate = uint64(txTimeStamp.Seconds) + endtime

	/// ADD ITEM TO SHOP
	//TODO: useless with couchdb
	shop, err = getShop(args[0])
	if err != nil {
		return "", fmt.Errorf("Shop not found : %s", err)
	}
	shop.Items = append(shop.Items, newItemId)

	/// PUT SHOP TO LEDGER
	bytes, err = json.Marshal(shop)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal shop informations: %s", err)
	}
	err = STUB.PutState(args[0], bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot write shop informations: %s", err)
	}

	/// PUT ITEM TO LEDGER
	bytes, err = json.Marshal(newItem)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal user informations: %s", err)
	}
	err = STUB.PutState(newItemId, bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update user informations: %s", err)
	}

	//Couchdb FTW
	/*
		//updating item list
		var newItemList []string
		newItemList, err = getItems()
		if err != nil {
			return "", fmt.Errorf("Error: %s", err)
		}

		newItemList = append(newItemList, newItemId)

		//commit item list
		listBytes, err = json.Marshal(newItemList)
		if err != nil {
			return "", fmt.Errorf("Cannot marshal item list informations: %s", err)
		}
		err = STUB.PutState("Items", listBytes)
		if err != nil {
			return "", fmt.Errorf("Cannot update item list informations: %s", err)
		}
	*/

	return newItemId, nil
}
