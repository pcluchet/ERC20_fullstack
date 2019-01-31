package main

import "encoding/json"
import "fmt"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	getSalePrice(submission SaleSubmission) (uint64, error) {
	var	err			error
	var	price		uint64
	var	saleItem	SaleItem
	var	item		ShopItem

	/// LOOP THROUGH ITEMS
	for _, saleItem = range(submission) {
		/// CHECK QUANTITY
		if (saleItem.Quantity == 0) {
			return 0, fmt.Errorf("Uncorrect item %s purchase quantity of 0.",
			SaleItem.ItemId)
		}
		/// CHECK ITEM EXISTANCE
		item, err = getItem(saleItem.ItemId)
		if err != nil {
			return 0, fmt.Errorf("Cannot get item %s", SaleItem.ItemId)
		} else if item.Bidable == true {
			return 0, fmt.Errorf("Cannot buy bidable item %s", SaleItem.ItemId)
		}
		/// GET PRICE
		price += item.Price * SaleItem.Quantity
	}
	return price, nil
}

func	getSale(userKey string, arg string) (Sale, error) {
	var	err			error
	var	sale		Sale
	var	submission	SaleSubmission

	/// GET PURCHASE ITEMS
	err = json.Unmarshal([]byte(arg), &submissions)
	if err != nil {
		return sale, fmt.Errorf("Cannot unmarshal sale submission.")
	} else if len(submission) == 0 {
		return sale, fmt.Errorf("Sale submission requires at least one item.")
	}
	/// BUILD SALE
	sale.User = userKey
	sale.Items = submission
	sale.DocType = "Sale"
	/// GET SALE PRICE
	sale.Price, err = getSalePrice(submission)
	if err != nil {
		return sale, err
	}
	return sale, nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	buyItem(args []string) (string, error) {
	var	err			error
	var	userKey		string
	var	sale		Sale
	var	shop		Shop
	var	item		ShopItem
	var	bytes		[]byte
	var	txId		string

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("buyItems requires one argument. A list of items")
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
	/// GET SHOP
	shop, err = getShop(item.ShopId)
	if err != nil {
		return "", err
	}

	if item.Biddable {
		return "", fmt.Errorf("This item is an auction")
	}

	/// UPDATE OBJECTS
	if sale.Quantity < item.MinQuantity {
		return "", fmt.Errorf("Minimum required quantity of %s", item.MinQuantity)
	}
	sale.Price = item.Price
	item.Quantity -= sale.Quantity

	/// MONEY TRANSFER
	err = transferMoneyItem(shop, item, sale)
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
