package main

import "encoding/json"
import "fmt"

///////////////////////////////////////////////////////////////////////////////
/// PRIVATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	payBid(userKey string, itemId string, item ShopItem) (Sale, error) {
	var	err			error
	var	shop		Shop
	var	saleItem	SaleItem
	var	sale		Sale
	var	details		string

	/// GET SHOP
	shop, err = getShop(item.ShopId)
	if err != nil {
		return sale, err
	}
	/// BUILD SALE ITEM
	saleItem.ItemId = itemId
	saleItem.ShopId = item.ShopId
	saleItem.Quantity = 1
	/// BUILD SALE
	sale.User = userKey
	sale.Items = SaleSubmission{saleItem}
	sale.Price = item.Price
	sale.DocType = "Sale"
	/// BUILD DETAILS STRING
	details = fmt.Sprintf("purchase of %v: [%s from %s (%v) x 1", sale.Price,
	item.Name, shop.Name, item.Price)
	/// MAKE TRANSFER
	err = transfer(shop.ERC20Address, sale.Price, details)
	if err != nil {
		return sale, err
	}
	/// RETURN SALE
	return sale, nil
}

///////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	settleBid(args []string) (string, error) {
	var err			error
	var winningBid	Bid
	var item		ShopItem
	var	sale		Sale
	var	saleId		string
	var	bytes		[]byte

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("setteling bid requires one argument => itemid")
	}

	/// GET USER INFO
	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	/// GET & CHECK BID
	winningBid, err = getWinningBid(args[0])
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}
	item, err = getItem(args[0])
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}
	if winningBid.Owner != userKey {
		return "", fmt.Errorf("You are not the winner of this auction, you can't settle it")
	}
	txTimeStamp, err2 := STUB.GetTxTimestamp()
	if err2 != nil {
		return "", fmt.Errorf("Error :%s", err2)
	}
	if item.ExpireDate > uint64(txTimeStamp.Seconds) {
		return "", fmt.Errorf("Auctions on this item are not over")
	}

	/// PAY BID
	sale, err = payBid(userKey, args[0], item)
	if err != nil {
		return "", err
	}

	/// UPDATE ITEM TO LEDGER
	item.Quantity--
	bytes, err = json.Marshal(item)
	if err != nil {
		return "", fmt.Errorf("Cannot update item quantity")
	}
	err = STUB.PutState(args[0], bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update item quantity")
	}
	/// PUT SALE TO LEDGER
	saleId = STUB.GetTxID()
	bytes, err = json.Marshal(sale)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal sale object")
	}
	err = STUB.PutState(saleId, bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot put sale to ledger")
	}
	/// RETURN SALE ID
	return saleId, nil
}
