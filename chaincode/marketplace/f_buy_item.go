package main

import "encoding/json"
import "fmt"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

//func	getRaw(arg string) ([]byte, error) {
//	var	err				error
//	var	raw				Raw
//	var	rawSubmission	RawSubmission
//	var	rawBytes		[]byte
//
//	err = json.Unmarshal([]byte(arg), &rawSubmission)
//	if err != nil {
//		return nil, fmt.Errorf("Cannot unmarshal raw submission.")
//	}
//	raw.Name = rawSubmission.Name
//	raw.Detail = rawSubmission.Detail
//	raw.Picture = rawSubmission.Picture
//	raw.DocType = "Raw"
//	// TO DO: check if raw name is taken ?
//	rawBytes, err = json.Marshal(raw)
//	if err != nil {
//		return nil, fmt.Errorf("Cannot marshal raw structure.")
//	}
//	return rawBytes, nil
//}

func	getSale(userKey string, arg string) (Sale, error) {
	var	err				error
	var	submission		SaleSubmission
	var	sale			Sale

	err = json.Unmarshal([]byte(arg), &submission)
	if err != nil {
		return sale, fmt.Errorf("Cannot unmarshal sale submission.")
	}
	sale.User = userKey
	sale.ItemId = submission.ItemId
	sale.DocType = "Sale"
	return sale, nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	buyItem(args []string) (string, error) {
	var err				error
	var	userKey			string
	var	sale			Sale
	var	item			ShopItem
	var	bytes			[]byte
	var	txId			string
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
	} else if item.Quantity == 0 {
		return "", fmt.Errorf("This item is out of stock.")
	}

	/// SET PRICE
	sale.Price = item.Price

	//////////////////////
	//TODO: MONEY TRANSFER
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
	item.Quantity -= 1
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
