package main

import "fmt"

import "encoding/json"
import "github.com/hyperledger/fabric/core/chaincode/shim"
import "github.com/hyperledger/fabric/protos/peer"

////////////////////////////////////////////////////////////////////////////////
/// PRIVATE
////////////////////////////////////////////////////////////////////////////////

func	getAdminList() ([]byte, error) {
	var	err			error
	var	argv		[][]byte
	var	adminList	AdminList
	var	adminBytes	[]byte
	var	value		[]byte

	/// CREATE ADMIN LIST
	argv = STUB.GetArgs()
	for _, value = range argv {
		adminList = append(adminList, string(value))
	}
	/// MARSHAL ADMIN LIST
	adminBytes, err = json.Marshal(adminList)
	if err != nil {
		return nil, fmt.Errorf("Cannot marshal administrator keys structure.")
	}
	return adminBytes, nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC
////////////////////////////////////////////////////////////////////////////////

func (t *SimpleAsset) Init(stub shim.ChaincodeStubInterface) peer.Response {
	var err			error
	var	adminBytes	[]byte

	fmt.Println("---------------> Init <---------------")
	STUB = stub

	/// GET ADMIN LIST IN BYTES
	adminBytes, err = getAdminList()
	if err != nil {
		return shim.Error(err.Error())
	}
	/// SET ADMIN LIST TO LEDGER
	err = STUB.PutState(devKeyAdmin, adminBytes)
	if err != nil {
		return shim.Error("Cannot set administrator key")
	}
	return shim.Success(nil)
}
