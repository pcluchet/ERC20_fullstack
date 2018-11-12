package main

import "fmt"
import "github.com/hyperledger/fabric/core/chaincode/shim"
import "github.com/hyperledger/fabric/protos/peer"

/* ************************************************************************** */
/*		PUBLIC																  */
/* ************************************************************************** */

func (t *Base) Init(stub shim.ChaincodeStubInterface) peer.Response {
	fmt.Println("---------------> Init <---------------")
	STUB = stub
	return shim.Success(nil)
}
