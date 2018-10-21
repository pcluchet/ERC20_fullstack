package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func CountHistory(stub shim.ChaincodeStubInterface, args []string) (int, error) {
	if len(args) != 1 {
		return 0, fmt.Errorf("Incorrect arguments. Expecting a key")
	}

	value, err := stub.GetHistoryForKey(fmt.Sprintf("%s%s", args[0], "_transfers"))

	if err != nil {
		return 0, fmt.Errorf("Failed to get asset: %s with error: %s", args[0], err)
	}
	if value == nil {
		return 0, fmt.Errorf("Asset not found: %s", args[0])
	}

	var cnt int
	cnt = 0
	for value.HasNext() {
		value.Next()
		cnt++
	}

	return cnt, nil
}

func getlatest(stub shim.ChaincodeStubInterface, args []string) (string, error) {

	count, errc := CountHistory(stub, args)
	if count == 0 || errc != nil {
		return "", fmt.Errorf("Failed to get history : %s", errc)
	}

	value, err := stub.GetHistoryForKey(fmt.Sprintf("%s%s", args[0], "_transfers"))

	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", args[0], err)
	}
	if value == nil {
		return "", fmt.Errorf("Asset not found: %s", args[0])
	}

	var history string
	history = "["

	var i int
	i = 0

	fmt.Printf("count=%d\n", count)
	var stacking bool
	stacking = false
	for value.HasNext() {
		now, err := value.Next()
		if err != nil {
			return "", err
		}
		value := string(now.Value)
		txid := now.TxId
		timestamp := now.Timestamp.Seconds

		marshaled := fmt.Sprintf("{\"txid\" : \"%s\", \"timestamp\" : %d, \"value\" : %s }", txid, timestamp, value)
		//marshaled = strings.Replace(marshaled, "\"", "\\\"", -1)

		//marshaled := fmt.Sprintf("%s", now)

		if i > count-10 {

			var separator string
			separator = ","
			if !stacking {
				separator = ""
			}
			stacking = true

			history = fmt.Sprintf("%s%s%s", history, separator, marshaled)
		}
		i++
	}

	history = fmt.Sprintf("%s%s", history, "]")

	return string(history), nil
}
