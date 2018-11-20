package main

import "encoding/json"
import "fmt"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func getSale(userKey string, arg string) (Sale, error) {
	var err error
	var submission SaleSubmission
	var sale Sale

	err = json.Unmarshal([]byte(arg), &submission)
	if err != nil {
		return sale, fmt.Errorf("Cannot unmarshal sale submission.")
	} else if submission.Quantity == 0 {
		return sale, fmt.Errorf("Sale submission's quantity must be greater than 0.")
	}
	sale.User = userKey
	sale.ItemId = submission.ItemId
	sale.Quantity = submission.Quantity
	sale.ShopId = submission.ShopId
	sale.DocType = "Sale"
	return sale, nil
}

func transferMoneyForSale(shop Shop, amount uint64) error {
	//TODO:	if == 1 admin on shop	-> transfer to admin
	//		if > 1 admin on shop	-> transfer to shop
	// Requires couchdb queries
	return transfer(shop.ERC20Address, amount)
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func buyItem(args []string) (string, error) {
	var err error
	var userKey string
	var sale Sale
	var item ShopItem
	var bytes []byte
	var txId string
	//var	user			User

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

	/// GET ITEM
	item, err = getItem(sale.ItemId)
	if err != nil {
		return "", fmt.Errorf("Cannot get bought item.")
	} else if item.Quantity < sale.Quantity {
		return "", fmt.Errorf("Not enough available items.")
	}

	/// UPDATE OBJECTS
	sale.Price = item.Price
	item.Quantity -= sale.Quantity

	//////////////////////
	//TODO: MONEY TRANSFER
	//////////////////////
	var shop Shop

	shop, err = getShop(item.ShopId)
	if err != nil {
		return "", err
	}

	err = transferMoneyForSale(shop, sale.Price*sale.Quantity)
	if err != nil {
		return "", err
	}
	//////////////////////
	//////////////////////

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
	bytes, err = json.Marshal(item)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal item struct.")
	}
	err = STUB.PutState(sale.ItemId, bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot put sale to ledger.")
	}
	return txId, nil
}
