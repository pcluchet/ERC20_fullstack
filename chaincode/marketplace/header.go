package	main

import	"github.com/hyperledger/fabric/core/chaincode/shim"

////////////////////////////////////////////////////////////////////////////////
/// STRUCTURES
////////////////////////////////////////////////////////////////////////////////

type	SimpleAsset	struct {
}

type	Item		struct {
		Name		string
		Amount		uint64
		Count		uint64
}

type	Bill		struct {
		OwnerId		string
		Items		[]Item
		TotalAmount	uint64
}

type	BillInfos	struct {
		OwnerId		string
		BillId		string
		Items		[]Item
		TotalAmount	uint64
}

type	UserInfos	struct {
		Bills		[]string
}

////////////////////////////////////////////////////////////////////////////////
/// GLOBAL VARIABLES
////////////////////////////////////////////////////////////////////////////////

var		STUB		shim.ChaincodeStubInterface
var		LOG			*shim.ChaincodeLogger
