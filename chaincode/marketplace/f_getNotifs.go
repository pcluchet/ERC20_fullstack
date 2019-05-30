package main

import (
	"encoding/json"
	"fmt"
	"strconv"
)

func getNotifs(args []string) (string, error) {

	//   0
	// "queryString"
	if len(args) > 1 {
		return "", fmt.Errorf("Incorrect number of arguments. Expecting timestamp")
	}

	_, err := strconv.ParseUint(args[0], 10, 64)
	if err != nil {
		return "", fmt.Errorf("Cannot parse timestamp : %s", err)
	}

	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	queryShops := `{"selector":{"DocType":"Shop","Users":{"$elemMatch" :  { "$eq" : "` + userKey + `"}   }}}`

	queryResults, err := getQueryResultForQueryString(queryShops)
	if err != nil {
		return "", fmt.Errorf("Error : %s", err)
	}
	fmt.Println(string(queryResults))

	var MangoUserShops MangoResultsForShops
	json.Unmarshal(queryResults, &MangoUserShops)

	var ShopList []string
	for _, value := range MangoUserShops {
		ShopList = append(ShopList, value.Key)
		fmt.Println("Shop : " + value.Key)
	}

	var ShopListJSONbytes []byte
	ShopListJSONbytes, err = json.Marshal(ShopList)
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}
	fmt.Println(string(ShopListJSONbytes))

	querySolds := `{"selector":{"DocType":"Sale","ShopId": { "$in" : ` + string(ShopListJSONbytes) + `}, "Timestamp" : {"$gt" : ` + args[0] + `} }}`

	queryResults, err = getQueryResultForQueryString(querySolds)
	if err != nil {
		return "", fmt.Errorf("Error : %s", err)
	}
	fmt.Println("SOLDS : " + string(queryResults))

	var MangoSaleList MangoResultsForSales
	json.Unmarshal(queryResults, &MangoSaleList)

	var notifList []SaleNotification
	for _, value := range MangoSaleList {

		var newnotif SaleNotification

		solditem, err := getItem(value.Record.ItemId)
		if err != nil {
			return "", fmt.Errorf("Error : %s", err)
		}
		newnotif.Timestamp = value.Record.Timestamp
		newnotif.Sale = value.Record
		newnotif.ItemId = value.Record.ItemId
		newnotif.SaleId = value.Key
		newnotif.Item = solditem
		newnotif.Doctype = "SaleNotification"
		notifList = append(notifList, newnotif)
	}

	returnbytes, err := json.Marshal(notifList)
	if err != nil {
		return "", fmt.Errorf("Error : %s", err)
	}

	return string(returnbytes), nil
}
