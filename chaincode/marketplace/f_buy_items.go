package main

import "encoding/json"
import "fmt"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	checkSaleItem(saleItem SaleItem) (string, uint64, error) {
	var	err		error
	var	item	ShopItem
	var	bytes	[]byte

	/// CHECK QUANTITY
	if (saleItem.Quantity == 0) {
		return "", 0, fmt.Errorf("Uncorrect item %s purchase quantity of 0.",
		saleItem.ItemId)
	}
	/// CHECK ITEM EXISTENCE
	item, err = getItem(saleItem.ItemId)
	if err != nil {
		return "", 0, fmt.Errorf("Cannot get item %s", item.Name)
	/// CHECK ITEM PROPERTIES
	} else if item.Biddable == true {
		return "", 0, fmt.Errorf("Cannot buy biddable item %s", item.Name)
	} else if saleItem.Quantity == 0 {
		return "", 0, fmt.Errorf("Minimum purchase quantity of %v for item %s",
		item.MinQuantity, item.Name)
	} else if saleItem.Quantity > item.Quantity {
		return "", 0, fmt.Errorf("Not enough item %s in the shop", item.Name)
	} else if saleItem.Quantity < item.MinQuantity {
		return "", 0, fmt.Errorf("Minimum purchase quantity of %v for item %s",
		item.MinQuantity, item.Name)
	}
	/// UPDATE ITEM TO LEDGER
	item.Quantity -= saleItem.Quantity
	bytes, err = json.Marshal(item)
	if err != nil {
		return "", 0, fmt.Errorf("Cannot marshal item %s.", saleItem.ItemId)
	}
	err = STUB.PutState(saleItem.ItemId, bytes)
	if err != nil {
		return "", 0, fmt.Errorf("Cannot update item %s.", saleItem.ItemId)
	}
	/// RETURN NAME & PRICE
	return item.Name, item.Price, nil
}

func	transferToShops(shops map[string][]SaleItem) (uint64, error) {
	var	err				error
	var	shopId			string
	var	item			SaleItem
	var	items			[]SaleItem
	var	totalPrice		uint64
	var	shopPrice		uint64
	var	price			uint64
	var	name			string
	var	details			string
	var	shop			Shop

	totalPrice = 0
	/// FOR EACH SHOP
	for shopId, items = range(shops) {
		/// GET SHOP
		shop, err = getShop(item.ShopId)
		if err != nil {
			return 0, err
		}
		details = ""
		shopPrice = 0
		/// FOR EACH ITEM
		for _, item = range(items) {
			/// CHECK ITEM
			name, price, err = checkSaleItem(item)
			if err != nil {
				return 0, err
			}
			/// ADD DETAILS
			details = fmt.Sprintf("%s [%s (%v) x %v]", details, name, price,
			item.Quantity)
			/// SET SHOP PRICE
			shopPrice += price * item.Quantity
		}
		/// BUILD SALE DETAILS
		details = fmt.Sprintf("purchase of %v from %s:%s", shopPrice, shopId,
		details)
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
	var	saleItem	SaleItem
	var	shops		map[string][]SaleItem
	var	isIn		bool

	/// BUILD SHOPS MAP OF ITEMS
	shops = make(map[string][]SaleItem)
	/// FOR EACH ITEM
	for _, saleItem = range(submission) {
		/// ADD ITEM TO MAP
		_, isIn = shops[saleItem.ShopId]
		if isIn == false {
			shops[saleItem.ShopId] = make([]SaleItem, 0)
		}
		shops[saleItem.ShopId] = append(shops[saleItem.ShopId], saleItem)
	}
	/// TRANSFER MONEY TO SHOPS
	return transferToShops(shops)
}

func	handleSale(userKey string, arg string) (Sale, error) {
	var	err			error
	var	sale		Sale
	var	submission	SaleSubmission

	/// GET PURCHASE ITEMS
	err = json.Unmarshal([]byte(arg), &submission)
	if err != nil {
		return sale, fmt.Errorf("Cannot unmarshal sale submission.")
	} else if len(submission) == 0 {
		return sale, fmt.Errorf("Sale submission requires at least one item.")
	}
	/// BUILD SALE
	sale.User = userKey
	sale.Items = submission
	sale.DocType = "Sale"
	/// HANDLE ITEM BY ITEM
	sale.Price, err = handleSaleItems(submission)
	if err != nil {
		return sale, err
	}
	return sale, nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	buyItems(args []string) (string, error) {
	var	err			error
	var	userKey		string
	var	sale		Sale
	var	bytes		[]byte
	var	txId		string

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("buyItems requires one argument. A list of items")
	}

	/// GET USER INFO
	userKey, err = getPublicKey()
	if err != nil {
		return "", fmt.Errorf("Cannot get user public key.")
	}
	_, err = getUser(userKey)
	if err != nil {
		return "", fmt.Errorf("Cannot get user informations.")
	}

	/// HANDLE SALE
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
