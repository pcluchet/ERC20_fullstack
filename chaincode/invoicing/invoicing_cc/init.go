package main

import "fmt"

import "github.com/hyperledger/fabric/core/chaincode/shim"
import "github.com/hyperledger/fabric/protos/peer"

/* ************************************************************************** */
/*		PUBLIC																  */
/* ************************************************************************** */

func (t *SimpleAsset) Init(stub shim.ChaincodeStubInterface) peer.Response {
	//var argv [][]byte
	//var err error

	fmt.Println("---------------> Init <---------------")
	//argv = stub.GetArgs()
	STUB = stub
	// SET CENTRAL BANK SUPPLY
	return shim.Success(nil)
}
