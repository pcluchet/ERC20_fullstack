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
func makeBid(args []string) (string, error) {

	var err error
	var newBidId string
	var bidBytes []byte
	var itemBytes []byte
	var autoBidCase bool
	autoBidCase = false

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("bidding requires one argument")
	}

	//generate proposed bid

	var proposedBid BidSubmission
	/// GET ARGUMENT
	err = json.Unmarshal([]byte(args[0]), &proposedBid)
	if err != nil {
		return "", fmt.Errorf("Cannot unmarshal bid: %s", err)
	}

	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	var bidToAdd Bid

	newBidId = STUB.GetTxID()
	bidToAdd.Price = proposedBid.Price
	bidToAdd.ItemId = proposedBid.ItemId
	bidToAdd.DocType = "Bid"

	txTimeStamp, err2 := STUB.GetTxTimestamp()
	if err2 != nil {
		return "", fmt.Errorf("Error :%s", err2)
	}

	bidToAdd.Timestamp = uint64(txTimeStamp.Seconds)

	bidToAdd.Owner = userKey

	//checking bid proposition againt current state of item
	var itm ShopItem

	itm, err = getItem(bidToAdd.ItemId)
	if err != nil {
		return "", fmt.Errorf("Error: %s", err)
	}

	if itm.Biddable == false {
		return "", fmt.Errorf("You cannot bid on that item")
	}

	if itm.Price >= bidToAdd.Price {
		return "", fmt.Errorf("The price is already higher than you bid")
	}

	if itm.ExpireDate < bidToAdd.Timestamp {
		return "", fmt.Errorf("Auctions for this item are over")
	}

	var winningBid Bid

	winningBid, err = getWinningBid(bidToAdd.ItemId)

	mash, err2 := json.Marshal(winningBid)
	println("WINNINGBID = ")
	println(string(mash))
	if err != nil {
		return "", fmt.Errorf("Cannot get winning bid: %s", err)
	}

	itm.BidList = append(itm.BidList, newBidId)
	//if the bid price is inferior than the currently winning bid, make an auto bid on behalf of the current winner

	fmt.Println("win owner :" + winningBid.Owner + "userkey : " + userKey)
	var autoBid Bid
	var autoBidId string
	if winningBid.Price != 0 {
		if winningBid.Price > bidToAdd.Price {
			//forbid users to auto outbid themselves
			fmt.Println("win owner :" + winningBid.Owner + "userkey : " + userKey)
			if winningBid.Owner == userKey {
				return "", fmt.Errorf("You cannot bid lower than your previous winning bid")
			}
			autoBidCase = true
			autoBidId = newBidId + "_auto"
			autoBid.Price = bidToAdd.Price + 1
			autoBid.Owner = winningBid.Owner
			autoBid.DocType = "Bid"
			autoBid.ItemId = winningBid.ItemId
			autoBid.ShownPrice = bidToAdd.Price + 1
			autoBid.Timestamp = uint64(txTimeStamp.Seconds)

			itm.Price = bidToAdd.Price + 1
			itm.BidList = append(itm.BidList, autoBidId)
			itm.Winner = winningBid.Owner
			bidToAdd.ShownPrice = bidToAdd.Price
		} else {
			//case where user outbid himself, doesnt take into account the previous lower bid
			if winningBid.Owner != userKey {
				itm.Price = winningBid.Price + 1
				bidToAdd.ShownPrice = itm.Price
			}
			bidToAdd.ShownPrice = itm.Price
			itm.Winner = bidToAdd.Owner
		}
	} else {

		bidToAdd.ShownPrice = itm.Price + 1
		itm.Winner = bidToAdd.Owner
		itm.Price++
	}

	//commit item key
	itemBytes, err = json.Marshal(itm)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal item informations: %s", err)
	}
	err = STUB.PutState(bidToAdd.ItemId, itemBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update item informations: %s", err)
	}

	//commit bid key
	bidBytes, err = json.Marshal(bidToAdd)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal bid informations: %s", err)
	}
	err = STUB.PutState(newBidId, bidBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update user informations: %s", err)
	}

	//commit auto bid key
	if autoBidCase {
		bidBytes, err = json.Marshal(autoBid)
		if err != nil {
			return "", fmt.Errorf("Cannot marshal bid informations: %s", err)
		}
		err = STUB.PutState(autoBidId, bidBytes)
		if err != nil {
			return "", fmt.Errorf("Cannot update user informations: %s", err)
		}
	}

	return newBidId, nil
}
