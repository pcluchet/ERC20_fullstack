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
	var	args		[][]byte
	var	adminList	AdminList

	args = STUB.GetArgs()
	if len(args) != 0 {
		return nil, fmt.Errorf("Marketplace init requires an admin list")
	}
	err = json.Unmarshal(args[0], &adminList)
	if err != nil {
		return nil, fmt.Errorf("Cannot unmarshal admin list")
	} else if len(adminList) == 0 {
		return nil, fmt.Errorf("Marketplace init requires at least one admin")
	}
	return args[0], nil
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
