package main

import "fmt"
import "github.com/hyperledger/fabric/core/chaincode/shim"

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func generic_invoke(cc string, channel string, ccArgs [][]byte) (string, error) {

	response := STUB.InvokeChaincode(cc, ccArgs, channel)
	if response.Status != shim.OK {
		return "", fmt.Errorf("Cannot make invoke: %s", response.GetMessage())
	}
	return string(response.Payload), nil
}
