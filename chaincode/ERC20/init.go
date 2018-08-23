package main

import "fmt"
import "strconv"
import "github.com/hyperledger/fabric/core/chaincode/shim"
import "github.com/hyperledger/fabric/protos/peer"

/* ************************************************************************** */
/*		PUBLIC																  */
/* ************************************************************************** */

func (t *SimpleAsset) Init(stub shim.ChaincodeStubInterface) peer.Response {
	var argv [][]byte
	var err error
	var bankString string

	fmt.Println("---------------> Init <---------------")
	argv = stub.GetArgs()
	STUB = stub
	// SET CENTRAL BANK SUPPLY
	bankString = fmt.Sprintf("{\"amount\":%v,\"allowances\":{}}",
		/**/ centralBankTotalSupply)

	fmt.Println("argvZERO:", string(argv[0]))
	err = stub.PutState(string(argv[0]), []byte(bankString))
	if err != nil {
		return shim.Error("Cannot set central bank")
	}
	// SET TOTAL SUPPLY
	err = stub.PutState("totalSupply",
		/**/ []byte(strconv.FormatUint(centralBankTotalSupply, 10)))
	if err != nil {
		return shim.Error("Cannot set ledger total supply")
	}
	return shim.Success(nil)
}
