package main

import	"fmt"
import	"github.com/hyperledger/fabric/core/chaincode/shim"
import	"github.com/hyperledger/fabric/protos/peer"

////////////////////////////////////////////////////////////////////////////////
/// PRIVATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func (t *SimpleAsset) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	var fct string
	var argv []string
	var ret string
	var err error

	/// GET FUNCTION AND PARAMETERS
	fct, argv = stub.GetFunctionAndParameters()

	/// INIT ENVIRONNEMENT
	STUB = stub
	LOG = shim.NewLogger("Pcoin")
	LOG.SetLevel(shim.LogInfo)

	/// LAUNCH FUNCTION
	switch fct {
	case "createBill":
		ret, err = createBill(argv)
	case "payBill":
		ret, err = payBill(argv)
	case "listBills":
		ret, err = listBills(argv)
	case "get":
		ret, err = _get(argv)
	default:
		err = fmt.Errorf("Illegal function called \n")
	}

	/// CHECK ERROR
	if err != nil {
		LOG.Error(err)
		return shim.Error(err.Error())
	}

	return shim.Success([]byte(ret))
}
