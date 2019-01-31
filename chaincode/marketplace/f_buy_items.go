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
		return "", 0, fmt.Errorf("Uncorrect item %s purchase quantity of 0.",
		SaleItem.ItemId)
	}
	/// CHECK ITEM EXISTENCE
	item, err = getItem(saleItem.ItemId)
	if err != nil {
		return "", 0, fmt.Errorf("Cannot get item %s", SaleItem.ItemId)
	} else if saleItem.Quantity > item.Quantity {
		return "", 0, fmt.Errorf("Not enough item %s in the shop")
	} else if item.Bidable == true {
		return "", 0, fmt.Errorf("Cannot buy bidable item %s", SaleItem.ItemId)
	}
	/// UPDATE ITEM INTO LEDGER
	item.Quantity -= saleItem.Quantity
	bytes, err = json.Marshal(Item)
	if err != nil {
		return "", 0, fmt.Errorf("Cannot marshal item %s.", SaleItem.ItemId)
	}
	err = STUB.PutState(SaleItem.ItemId, bytes)
	if err != nil {
		return "", 0, fmt.Errorf("Cannot update item %s.", SaleItem.ItemId)
	}
	/// RETURN NAME & PRICE
	return item.Name, item.Price * SaleItem.Quantity, nil
}

func	transferToShops(shops map[string][]SaleItem) (uint64, error) {
	var	shopId			string
	var	item			SaleItem
	var	items			[]SaleItem
	var	totalPrice		uint64
	var	shopPrice		uint64
	var	price			uint64
	var	name			string
	var	details			string
	var	itemsDetails	string
	var	shop			Shop

	totalPrice = 0
	for shopId, items = range(toPay) {
		/// GET SHOP
		shop, err = getShop(item.ShopId)
		if err != nil {
			return 0, fmt.Errorf("Cannot get shop of item %s", SaleItem.ItemId)
		}
		itemsDetails = ""
		shopPrice = 0
		for _, item = range(items) {
			/// CHECK ITEM
			name, price, err = checkSaleItem(saleItem)
			if err != nil {
				return 0, err
			}
			/// ADD DETAILS
			itemsDetails += fmt.Sprintf("%s (%v) x %v", name, price,
			saleItem.Quantity)
			/// SET SHOP PRICE
			shopPrice += price
		}
		/// BUILD SALE DETAILS
		details = fmt.Sprintf("purchase of %v from %s: [%s]", ShopPrice, shopId,
		itemsDetails)
		/// TRANSFER TO SHOP
		err = transfer(shop.ERC20Address, shopPrice, details)
		if err != nil {
			return 0, err
		}
		totalPrice += shopPrice
	}
	return totalPrice, nil
}

func	handleSaleItems(submission SaleSubmission) (uint64, error) {
	var	err			error
	var	price		uint64
	var	saleItem	SaleItem
	var	item		ShopItem
	var	shops		map[string][]SaleItem
	var	isIn		bool

	shops = make(map[string][]SaleItem)
	/// BUILD SHOPS MAP OF ITEMS
	for _, saleItem = range(submission) {
		/// ADD TO TRANSFER TO DO
		_, isIn = shops[saleItem.ShopId]
		if isIn == false {
			shops[saleItem.ShopId] = make([]SaleItem)
		}
		append(shops[saleItem.ShopId], saleItem)
	}
	return transferToShops(shops)
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

	/// GET TRANSACTION ID
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

	/// RETURN TRANSACTION ID
	return txId, nil
}
