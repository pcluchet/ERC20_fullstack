package	main

import "fmt"
import "github.com/hyperledger/fabric/core/chaincode/shim"
import "strconv"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	toChaincodeArgs(args ...string) [][]byte {
	var	bargs	[][]byte

	bargs = make([][]byte, len(args))
	for i, arg := range args {
		bargs[i] = []byte(arg)
	}
	return bargs
}

func	transfer(to string, amount uint64, details string) (error) {
	var	amountString	string
	var	ccArgs			[][]byte

	amountString = strconv.FormatUint(amount, 10)
	ccArgs = toChaincodeArgs("transfer", to, amountString, details)
	response := STUB.InvokeChaincode("ERC20", ccArgs, "")
	if response.Status != shim.OK {
		return fmt.Errorf("Cannot make transfer for sale: %s", response.Message)
	}
	return nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	transferMoneyItem(shop Shop, item ShopItem, sale Sale) error {
	var	details		string
	var	totalAmount	uint64

	/// COMPUTE TOTAL AMOUNT
	totalAmount = sale.Price * sale.Quantity
	/// BUILD TRANSACTION DETAILS
	details = fmt.Sprintf("purchase of %v: [%s from %s (%v) x %v]", totalAmount,
	item.Name, shop.Name, item.Price, sale.Quantity)
	/// MAKE TRANSFER
	return transfer(shop.ERC20Address, totalAmount, details)
}
func	transferMoneyRaw(shop Shop, raw ShopRaw, sale Sale) error {
	var	details		string
	var	totalAmount	uint64

	/// COMPUTE TOTAL AMOUNT
	totalAmount = sale.Price * sale.Quantity
	/// BUILD TRANSACTION DETAILS
	details = fmt.Sprintf("purchase of %v: [raw %s from %s (%v) x %v]",
	totalAmount, raw.RawId, shop.Name, raw.Price, sale.Quantity)
	/// MAKE TRANSFER
	return transfer(shop.ERC20Address, totalAmount, details)
}
