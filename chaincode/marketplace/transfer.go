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

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	transfer(to string, amount uint64) (error) {
	var	amountString	string
	var	ccArgs			[][]byte

	amountString = strconv.FormatUint(amount, 10)
	ccArgs = toChaincodeArgs("transfer", to, amountString)
	response := STUB.InvokeChaincode("ERC20", ccArgs, "")
	if response.Status != shim.OK {
		return fmt.Errorf("Cannot make transfer for sale: %s", response.Message)
	}
	return nil
}
