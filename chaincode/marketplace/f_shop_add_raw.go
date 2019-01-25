package main

import (
	"encoding/json"
	"fmt"
)

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	getRawStruct(submitString string, shopId string) (ShopRaw, error) {
	var	err			error
	var	submission	ShopRawSubmission
	var	raw			ShopRaw

	err = json.Unmarshal([]byte(submitString), &submission)
	if err != nil {
		return raw, fmt.Errorf("Cannot unmarshal raw submission.")
	}
	if submission.MinQuantity == 0 {
		return raw, fmt.Errorf("Cannot set a minimum quantity purchase of 0")
	}
	raw.RawId = submission.RawId
	raw.Price = submission.Price
	raw.Quantity = submission.Quantity
	raw.MinQuantity = submission.MinQuantity
	raw.AdditionalFields = submission.AdditionalFields
	raw.ShopId = shopId
	raw.DocType = "ShopRaw"
	return raw, nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	shopAddRaw(args []string) (string, error) {
	var	err			error
	var	bytes		[]byte
	var	raw			ShopRaw
	var	rawId		string
	var	shop		Shop
	//var listBytes []byte

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 2 {
		return "", fmt.Errorf("ShopAddRaw requires two arguments, the shop id where to add the item, and a item json")
	}

	println("Some log")

	/// GET USER PUBLIC KEY
	userKey, err := getPublicKey()
	if err != nil {
		return "", err
	}

	/// GET SHOP
	shop, err = getShop(args[0])
	if err != nil {
		return "", fmt.Errorf("Cannot get shop informations.")
	} else if isShopAdmin(shop, userKey) == false {
		return "", fmt.Errorf("You are not authorized to modify this shop user list.")
	}

	/// GET RAW SUBMISSION
	raw, err = getRawStruct(args[1], args[0])
	if err != nil {
		return "", err
	}

	//TODO: Check if this shop already sell this raw material (with couchdb)

	/////////////////////////////////////////
	//TODO: This will be useless with couchdb
	/// UPDATE SHOP
	rawId = STUB.GetTxID()
	shop, err = getShop(args[0])
	if err != nil {
		return "", fmt.Errorf("Cannot get shop info.")
	}
	shop.Raw = append(shop.Raw, rawId)

	/////////////////////////////////////////
	//TODO: This will be useless with couchdb
	/// UPDATE SHOP TO LEDGER
	bytes, err = json.Marshal(shop)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal shop informations.")
	}
	err = STUB.PutState(args[0], bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update shop informations.")
	}

	/// ADD SHOP-RAW TO LEDGER
	bytes, err = json.Marshal(raw)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal raw informations.")
	}
	err = STUB.PutState(rawId, bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update raw informations.")
	}
	return rawId, nil
}
