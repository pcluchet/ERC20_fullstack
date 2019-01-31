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
	case "buy_item":
		ret, err = buyItem(argv)
	case "buy_raw":
		ret, err = buyRaw(argv)
	case "make_bid":
		ret, err = makeBid(argv)
	case "settle_bid":
		ret, err = settleBid(argv)
	case "new_shop":
		ret, err = shopCreate(argv)
	case "shop_add_user":
		ret, err = shopAddUser(argv)
	case "shop_add_item":
		ret, err = shopAddItem(argv)
	case "shop_add_items":
		ret, err = shopAddItems(argv)
	case "shop_add_raw":
		ret, err = shopAddRaw(argv)
	case "shop_set_item_quantity":
		ret, err = shopSetItemQuantity(argv)
	case "add_raw":
		ret, err = rawAdd(argv)
	case "is_admin":
		ret, err = isAdmin(argv)
	case "admin_get":
		ret, err = adminGet(argv)
	case "admin_set":
		ret, err = adminSet(argv)
	case "get":
		ret, err = _get(argv)
	case "set":
		ret, err = _set(argv)
	case "query_data":
		ret, err = queryData(argv)
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
