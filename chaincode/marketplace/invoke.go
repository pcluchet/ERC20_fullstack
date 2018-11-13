package main

import "fmt"
import "github.com/hyperledger/fabric/core/chaincode/shim"
import "github.com/hyperledger/fabric/protos/peer"

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
	case "new_user":
		ret, err = newUser(argv)
	case "new_shop":
		ret, err = shopCreate(argv)
	case "shop_add_user":
		ret, err = shopAddUser(argv)
	case "shop_add_item":
		ret, err = shopAddItem(argv)
	case "make_bid":
		ret, err = makeBid(argv)
	case "query_data":
		ret, err = queryData(argv)
	case "is_admin":
		ret, err = isAdmin(argv)
	case "admin_get":
		ret, err = adminGet(argv)
	case "admin_set":
		ret, err = adminSet(argv)
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
