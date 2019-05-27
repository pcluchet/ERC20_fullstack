package main

import "fmt"
import "github.com/hyperledger/fabric/core/chaincode/shim"
import "github.com/hyperledger/fabric/protos/peer"

/* ************************************************************************** */
/*		PUBLIC																  */
/* ************************************************************************** */

func gethistory(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key")
	}

	value, err := stub.GetHistoryForKey(args[0])

	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", args[0], err)
	}
	if value == nil {
		return "", fmt.Errorf("Asset not found: %s", args[0])
	}

	var history string
	history = "\n"

	for value.HasNext() {
		history = fmt.Sprintf("%s%s", history, fmt.Sprintln(value.Next()))
	}

	return string(history), nil
}

func (t *SimpleAsset) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	var fct string
	var argv []string
	var ret string
	var err error

	fct, argv = stub.GetFunctionAndParameters()
	if fct != "balanceOf" && fct != "whoOwesMe" && fct != "whoOweI" { // TEMP
		fmt.Println("---------------> Invoke <---------------")
	}

	STUB = stub
	LOG = shim.NewLogger("Pcoin")
	LOG.SetLevel(shim.LogInfo)

	switch fct {
	// Temporary, not in production
	case "get":
		ret, err = _get(argv)
	case "set":
		ret, err = _set(argv)
	case "history":
		ret, err = gethistory(stub, argv)
	case "latest":
		ret, err = getlatest(stub, argv)
	case "balanceOf":
		ret, err = balanceOf(argv)
	case "register":
		ret, err = register(argv)
	case "allowance":
		ret, err = allowance(argv)
	case "transfer":
		ret, err = transfer(argv)
	case "transferFrom":
		ret, err = transferFrom(argv)
	case "approve":
		ret, err = approve(argv)
	case "totalSupply":
		ret, err = totalSupply()
	case "listUsers":
		ret, err = listUsers()
	case "whoOwesMe":
		ret, err = whoOwesMe()
	case "whoOweI":
		ret, err = whoOweI()
	case "cashIn":
		ret, err = cashIn(argv)
	case "cashOut":
		ret, err = cashOut(argv)

	default:
		err = fmt.Errorf("Illegal function called \n")
	}

	if err != nil {
		LOG.Error(err)
		return shim.Error(err.Error())
	}

	return shim.Success([]byte(ret))
}
