package main

import (
	"encoding/json"
	"fmt"
)

///////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////
func settleBid(args []string) (string, error) {
	var err			error
	var winningBid	Bid
	var saidItem	ShopItem
	var saleId		string
	var	saleSpoof	SaleItem


	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("setteling bid requires one argument => itemid")
	}

	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	winningBid, err = getWinningBid(args[0])
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	saidItem, err = getItem(args[0])
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

	if saidItem.ExpireDate > uint64(txTimeStamp.Seconds) {
		return "", fmt.Errorf("Auctions on this item are not over")
	}

	saleSpoof.ItemId = args[0]
	saleSpoof.ShopId = saidItem.ShopId
	saleSpoof.Quantity = 1

	var bytes []byte
	bytes, err = json.Marshal(saleSpoof)

	var fakeargs []string

	fakeargs = append(fakeargs, string(bytes))

	saleId, err = buyBid(fakeargs)

	if err != nil {
		return "", fmt.Errorf("Error :%s", err)
	}

	return saleId, nil
}
