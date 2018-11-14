package	main

import "fmt"
import "github.com/hyperledger/fabric/core/chaincode/shim"

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
	var	ccArgs		[][]byte

	ccArgs = toChaincodeArgs("transfer", to, fmt.Sprintf("%u", amount))
	response := STUB.InvokeChaincode("ERC20", ccArgs, "")
	if response.Status != shim.OK {
		return fmt.Errorf("Cannot make transfer for sale: %s", response.Message)
	}
	return nil
}
