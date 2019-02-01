package main

import "encoding/json"
import "fmt"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	buyRaw(args []string) (string, error) {
	var	err		error
	var	userKey	string
	var	sale	Sale
	var	shop	Shop
	var	raw		ShopRaw
	var	bytes	[]byte
	var	txId	string
	var	details	string

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("buyItem requires one argument.")
	}

	/// GET USER INFO
	userKey, err = getPublicKey()
	if err != nil {
		return "", fmt.Errorf("Cannot get user public key.")
	}
	_, err = getUser(userKey)
	if err != nil {
		return "", fmt.Errorf("Cannot get user informations.")
	}

	/// GET SALE
	sale, err = getSale(userKey, args[0])
	if err != nil {
		return "", err
	}
	/// GET RAW
	raw, err = getShopRaw(sale.Items[0].ItemId)
	if err != nil {
		return "", fmt.Errorf("Cannot get raw.")
	}
	/// GET SHOP
	shop, err = getShop(raw.ShopId)
	if err != nil {
		return "", err
	}

	/// CHECK SALE
	if sale.Items[0].Quantity < raw.MinQuantity {
		return "", fmt.Errorf("Minimum required quantity of %s", raw.MinQuantity)
	} else if sale.Items[0].Quantity > raw.Quantity {
		return "", fmt.Errorf("Not enough raw material.")
	}

	/// TRANSFER MONEY
	sale.Price = raw.Price * sale.Items[0].Quantity
	details = fmt.Sprintf("purchase of %v: [raw %s from %s (%v) x %v]",
	sale.Price, raw.RawId, shop.Name, raw.Price, sale.Items[0].Quantity)
	err = transfer(shop.ERC20Address, sale.Price, details)
	if err != nil {
		return "", err
	}

	/// PUT SALE TO LEDGER
	txId = STUB.GetTxID()
	bytes, err = json.Marshal(sale)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal sale struct.")
	}
	err = STUB.PutState(txId, bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot put sale to ledger.")
	}

	/// UPADTE RAW TO LEDGER
	raw.Quantity -= sale.Items[0].Quantity
	bytes, err = json.Marshal(raw)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal shop raw struct.")
	}
	err = STUB.PutState(sale.Items[0].ItemId, bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update shop raw to ledger.")
	}
	return txId, nil
}
