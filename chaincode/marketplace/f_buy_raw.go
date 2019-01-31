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

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("buyItem requires one argument.")
	}

	println("Some log")

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
	} else if raw.Quantity >= sale.Items[0].Quantity {
		return "", fmt.Errorf("Not enough raw material.")
	}
	/// GET SHOP
	shop, err = getShop(raw.ShopId)
	if err != nil {
		return "", err
	}


	/// UPDATE OBJECTS
	if sale.Items[0].Quantity < raw.MinQuantity {
		return "", fmt.Errorf("Minimum required quantity of %s", raw.MinQuantity)
	}
	sale.Price = raw.Price
	raw.Quantity -= sale.Items[0].Quantity

	/// TRANSFER MONEY
	err = transferMoneyRaw(shop, raw, sale)
	if err != nil {
		return "", err
	}

	txId = STUB.GetTxID()

	/// PUT SALE TO LEDGER
	bytes, err = json.Marshal(sale)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal sale struct.")
	}
	err = STUB.PutState(txId, bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot put sale to ledger.")
	}

	/// UPADTE ITEM FROM LEDGER
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
