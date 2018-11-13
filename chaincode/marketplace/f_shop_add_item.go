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
func shopAddItem(args []string) (string, error) {

	var itemBytes []byte
	var shopBytes []byte
	//var listBytes []byte
	var newItmId string
	var err error
	var hasThisShop bool

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 2 {
		return "", fmt.Errorf("add item requires two arguments, the shop id where to add the item, and a item json")
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

	var itm_toadd ShopItemSubmission
	/// GET ARGUMENT
	err = json.Unmarshal([]byte(args[1]), &itm_toadd)
	if err != nil {
		return "", fmt.Errorf("Cannot unmarshal item: %s", err)
	}

	//filling new item, calculating expiration timestamp etc
	newItmId = STUB.GetTxID()
	var newItm ShopItem

	newItm.Name = itm_toadd.Name
	newItm.Detail = itm_toadd.Detail
	newItm.Picture = itm_toadd.Picture
	//TODO : verify arg
	newItm.ShopId = args[0]
	newItm.DocType = "ShopItem"
	newItm.Biddable = itm_toadd.Bidable

	if itm_toadd.Price < 0 {
		return "", fmt.Errorf("Item price cannot be negative ")
	}

	newItm.Price = itm_toadd.Price

	if itm_toadd.Bidable {
		var endtime uint64
		if itm_toadd.Duration <= 0 {
			return "", fmt.Errorf("Offer duration cannot be 0 or negative")
		}

		endtime = itm_toadd.Duration * 3600

		txTimeStamp, err2 := STUB.GetTxTimestamp()
		if err2 != nil {
			return "", fmt.Errorf("Error :%s", err2)
		}

		newItm.ExpireDate = uint64(txTimeStamp.Seconds) + endtime
	} else {
		newItm.ExpireDate = 0
	}

	//update the shop to include the new item
	var shp Shop

	shp, err = getShop(args[0])
	if err != nil {
		return "", fmt.Errorf("Shop not found : %s", err)
	}

	shp.Items = append(shp.Items, newItmId)

	//commit shop key
	shopBytes, err = json.Marshal(shp)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal shop informations: %s", err)
	}
	err = STUB.PutState(args[0], shopBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot write shop informations: %s", err)
	}

	//commit item key
	itemBytes, err = json.Marshal(newItm)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal user informations: %s", err)
	}
	err = STUB.PutState(newItmId, itemBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update user informations: %s", err)
	}

	//Couchdb FTW
	/*
		//updating item list
		var newItemList []string
		newItemList, err = getItms()
		if err != nil {
			return "", fmt.Errorf("Error: %s", err)
		}

		newItemList = append(newItemList, newItmId)

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

	return newItmId, nil
}
