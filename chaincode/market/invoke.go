package main

import "fmt"
import "github.com/hyperledger/fabric/core/chaincode/shim"
import "github.com/hyperledger/fabric/protos/peer"

////////////////////////////////////////////////////////////////////////////////
/// PRIVATE
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC
////////////////////////////////////////////////////////////////////////////////

func (t *Base) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	var err		error
	var fct		string
	var argv	[]string
	var ret		string

	fct, argv = stub.GetFunctionAndParameters()
	STUB = stub
	LOG = shim.NewLogger("Pcoin")
	LOG.SetLevel(shim.LogInfo)

	switch fct {
	// Temporary, not in production
	//case "get":
	//	ret, err = _get(argv)
	//case "set":
	//	ret, err = _set(argv)
	//case "history":
	//	ret, err = gethistory(stub, argv)
	case "newUser":
		ret, err = funcNewUser(argv)
	case "buyItems":
		ret, err = funcBuyItems(argv)
	case "buyRaw":
		ret, err = funcBuyRaw(argv)
	case "makeOffer":
		ret, err = funcMakeOffer(argv)
	case "shopCreate":
		ret, err = funcShopCreate(argv)
	case "shopAddUser":
		ret, err = funcShopAddUser(argv)
	case "shopAddItem":
		ret, err = funcShopAddItem(argv)
	case "shopAddRaw":
		ret, err = funcShopAddRaw(argv)
	case "shopItemUpdateBid":
		ret, err = funcShopItemUpdateBid(argv)
	case "shopItemListSold":
		ret, err = funcShopItemListSold(argv)
	case "shopRawListSold":
		ret, err = funcShopRawListSold(argv)
	case "rawNew":
		ret, err = funcRawNew(argv)
	case "rawUpdate":
		ret, err = funcRawUpdate(argv)
	default:
		err = fmt.Errorf("Illegal function called \"%s\"\n", fct)
	}

	if err != nil {
		LOG.Error(err)
		return shim.Error(err.Error())
	}

	return shim.Success([]byte(ret))
}
