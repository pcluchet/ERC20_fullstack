package main

import "encoding/json"
import "fmt"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	checkSaleItem(saleItem SaleItem) (uint64, error) {
	var	err		error
	var	item	ShopItem
	var	bytes	[]byte

	/// CHECK QUANTITY
	if (saleItem.Quantity == 0) {
		return 0, fmt.Errorf("Uncorrect item %s purchase quantity of 0.",
		SaleItem.ItemId)
	}
	/// CHECK ITEM EXISTENCE
	item, err = getItem(saleItem.ItemId)
	if err != nil {
		return 0, fmt.Errorf("Cannot get item %s", SaleItem.ItemId)
	} else if saleItem.Quantity > item.Quantity {
		return 0, fmt.Errorf("Not enough item %s in the shop")
	} else if item.Bidable == true {
		return 0, fmt.Errorf("Cannot buy bidable item %s", SaleItem.ItemId)
	}
	/// UPDATE ITEM INTO LEDGER
	item.Quantity -= saleItem.Quantity
	bytes, err = json.Marshal(Item)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal item %s.", SaleItem.ItemId)
	}
	err = STUB.PutState(SaleItem.ItemId, bytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update item %s.", SaleItem.ItemId)
	}
	/// GET PRICE
	return item.Price * SaleItem.Quantity, nil
}

func	transferToShops(shops map[string][]SaleItem) error {
	var	shop

	for shop = range(toPay) {
	}
}

func	handleSaleItems(submission SaleSubmission) (uint64, error) {
	var	err			error
	var	totalPrice	uint64
	var	price		uint64
	var	saleItem	SaleItem
	var	item		ShopItem
	var	shops		map[string][]SaleItem
	var	isIn		bool

	shops = make(map[string][]SaleItem)
	totalPrice = 0
	/// LOOP THROUGH ITEMS
	for _, saleItem = range(submission) {
		/// HANDLE ITEM
		price, err = checkSaleItem(saleItem)
		if err != nil {
			return 0, err
		}
		totalPrice += price
		/// HANDLE SHOP
		_, err = getShop(item.ShopId)
		if err != nil {
			return 0, fmt.Errorf("Cannot get shop of item %s", SaleItem.ItemId)
		}
		/// GET TRANSFER TO DO
		_, isIn = shops[saleItem.ShopId]
		if isIn == false {
			shops[saleItem.ShopId] = make([]SaleItem)
		}
		append(shops[saleItem.ShopId], saleItem)
	}
	err = transferToShops(shops)
	if err != nil {
		return 0, err
	}
	return totalPrice, nil
}

func	handleSale(userKey string, arg string) (Sale, error) {
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
	sale.Price, err = handleSaleItems(submission)
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
	sale, err = handleSale(userKey, args[0])
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
