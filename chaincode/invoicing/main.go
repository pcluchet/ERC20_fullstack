package main

import	"fmt"
import	"os"
import	"github.com/hyperledger/fabric/core/chaincode/shim"

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func main() {
	err := shim.Start(new(SimpleAsset))
	if err != nil {
		fmt.Fprint(os.Stderr, "Error starting Simple chaincode: %s", err)
		os.Exit(1)
	}
}
