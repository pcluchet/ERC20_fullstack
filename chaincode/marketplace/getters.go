package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func getUser(userPubKey string) (User, error) {
	var usr User
	var userBytes []byte
	var err error

	/// GET USER
	userBytes, err = STUB.GetState(userPubKey)
	if err != nil {
		return usr, fmt.Errorf("Ledger acess problem, : %s", err)
	}
	/// IF NON EXISTANT
	if userBytes == nil {
		return usr, fmt.Errorf("User not found, run new_user first")
	}

	err = json.Unmarshal(userBytes, &usr)
	if err != nil {
		return usr, fmt.Errorf("Cannot unmarshal user informations: %s", err)
	}

	return usr, nil
}

func getShop(shopUid string) (Shop, error) {
	var shp Shop
	var shopBytes []byte
	var err error

	/// GET SHOP
	shopBytes, err = STUB.GetState(shopUid)
	if err != nil {
		return shp, fmt.Errorf("Ledger acess problem, : %s", err)
	}
	/// IF NON EXISTANT
	if shopBytes == nil {
		return shp, fmt.Errorf("shop not found, run  first")
	}

	err = json.Unmarshal(shopBytes, &shp)
	if err != nil {
		return shp, fmt.Errorf("Cannot unmarshal shop informations: %s", err)
	}

	return shp, nil
}

func getItem(itemUid string) (ShopItem, error) {
	var itm ShopItem
	var shopItemBytes []byte
	var err error

	/// GET ITEM
	shopItemBytes, err = STUB.GetState(itemUid)
	if err != nil {
		return itm, fmt.Errorf("Ledger acess problem, : %s", err)
	}
	/// IF NON EXISTANT
	if shopItemBytes == nil {
		return itm, fmt.Errorf("item not found")
	}

	err = json.Unmarshal(shopItemBytes, &itm)
	if err != nil {
		return itm, fmt.Errorf("Cannot unmarshal item informations: %s", err)
	}

	return itm, nil
}

func getBid(bidUid string) (Bid, error) {
	var bid Bid
	var bidBytes []byte
	var err error

	/// GET ITEM
	bidBytes, err = STUB.GetState(bidUid)
	if err != nil {
		return bid, fmt.Errorf("Ledger acess problem, : %s", err)
	}
	/// IF NON EXISTANT
	if bidBytes == nil {
		return bid, fmt.Errorf("bid not found")
	}

	err = json.Unmarshal(bidBytes, &bid)
	if err != nil {
		return bid, fmt.Errorf("Cannot unmarshal bid informations: %s", err)
	}

	return bid, nil
}

func getWinningBid(itemUid string) (Bid, error) {
	var itm ShopItem
	var winningBid Bid
	var shopItemBytes []byte
	var err error
	var bidId string
	var tempBid Bid

	winningBid.Price = 0
	winningBid.Timestamp = math.MaxUint64
	/// GET ITEM
	shopItemBytes, err = STUB.GetState(itemUid)
	if err != nil {
		return winningBid, fmt.Errorf("Ledger acess problem, : %s", err)
	}
	/// IF NON EXISTANT
	if shopItemBytes == nil {
		return winningBid, fmt.Errorf("item not found")
	}

	err = json.Unmarshal(shopItemBytes, &itm)
	if err != nil {
		return winningBid, fmt.Errorf("Cannot unmarshal item informations: %s", err)
	}

	for _, bidId = range itm.BidList {
		tempBid, err = getBid(bidId)
		if err != nil {
			return winningBid, fmt.Errorf("Error: %s", err)
		}
		if winningBid.Price < tempBid.Price {
			winningBid = tempBid
		}
		//the first to bid @ a given price will be the winner
		if winningBid.Price == tempBid.Price && winningBid.Timestamp > tempBid.Timestamp {
			winningBid = tempBid
		}
	}

	return winningBid, nil
}

func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return &buffer, nil
}

func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	buffer, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

func queryData(args []string) (string, error) {

	//   0
	// "queryString"
	if len(args) < 1 {
		return "", fmt.Errorf("Incorrect number of arguments. Expecting 1")
	}

	queryString := args[0]

	queryResults, err := getQueryResultForQueryString(STUB, queryString)
	if err != nil {
		return "", fmt.Errorf("Error : %s", err)
	}

	return string(queryResults), nil
}
