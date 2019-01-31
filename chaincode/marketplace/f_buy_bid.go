package main

//import "encoding/json"
//import "fmt"

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

/// TODO: Handle this with buyItems
func buyBid(args []string) (string, error) {
	return "COUCOU", nil
	//var err error
	//var userKey string
	//var sale Sale
	//var item ShopItem
	//var bytes []byte
	//var txId string
	////var	user			User

	///// CHECK ARGUMENTS
	///// TODO : when better API, check this better
	//if len(args) != 1 {
	//	return "", fmt.Errorf("buyItem requires one argument.")
	//}

	//println("Some log")

	///// GET USER INFO
	//userKey, err = getPublicKey()
	//if err != nil {
	//	return "", fmt.Errorf("Cannot get user public key.")
	//}
	//_, err = getUser(userKey)
	//if err != nil {
	//	return "", fmt.Errorf("Cannot get user informations.")
	//}

	///// GET SALE
	////sale, err = getSale(userKey, args[0])
	////if err != nil {
	////	return "", err
	////}

	///// GET ITEM
	//item, err = getItem(sale.ItemId)
	//if err != nil {
	//	return "", fmt.Errorf("Cannot get bought item.")
	//} else if item.Quantity < sale.Quantity {
	//	return "", fmt.Errorf("Not enough available items.")
	//}

	///// UPDATE OBJECTS
	//sale.Price = item.Price
	//item.Quantity -= sale.Quantity

	//var shop Shop

	//shop, err = getShop(item.ShopId)
	//if err != nil {
	//	return "", err
	//}

	//err = transferMoneyItem(shop, item, sale)
	//if err != nil {
	//	return "", err
	//}
	////////////////////////
	////////////////////////

	//txId = STUB.GetTxID()

	///// PUT SALE TO LEDGER
	//bytes, err = json.Marshal(sale)
	//if err != nil {
	//	return "", fmt.Errorf("Cannot marshal sale struct.")
	//}
	//err = STUB.PutState(txId, bytes)
	//if err != nil {
	//	return "", fmt.Errorf("Cannot put sale to ledger.")
	//}

	///// UPADTE ITEM FROM LEDGER
	//bytes, err = json.Marshal(item)
	//if err != nil {
	//	return "", fmt.Errorf("Cannot marshal item struct.")
	//}
	//err = STUB.PutState(sale.ItemId, bytes)
	//if err != nil {
	//	return "", fmt.Errorf("Cannot put sale to ledger.")
	//}
	//return txId, nil
}
