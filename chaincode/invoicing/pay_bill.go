package main

import "fmt"
import "encoding/json"
import "github.com/hyperledger/fabric/core/chaincode/shim"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func toChaincodeArgs(args ...string) [][]byte {
	var bargs [][]byte
	bargs = make([][]byte, len(args))
	for i, arg := range args {
		bargs[i] = []byte(arg)
	}
	return bargs
}

func removeBillFromList(list []string, billId string) ([]string, error) {
	var i int
	var id string

	for i, id = range list {
		if id == billId {
			list[len(list)-1], list[i] = list[i], list[len(list)-1]
			return list[:len(list)-1], nil
		}
	}
	return nil, fmt.Errorf("Cannot find bill Id in owner object")
}

func deleteBill(ownerId string, billId string) error {
	var err error
	var user UserInfos
	var userBytes []byte

	user, err = getUserInfos(ownerId)
	if err != nil {
		return fmt.Errorf("Cannot get owner informations: %s", err)
	}
	user.Bills, err = removeBillFromList(user.Bills, billId)
	if err != nil {
		return err
	}
	userBytes, err = json.Marshal(user)
	if err != nil {
		return fmt.Errorf("Cannot marshal owner object: %s", err)
	}
	err = STUB.PutState(ownerId, userBytes)
	if err != nil {
		return fmt.Errorf("Cannot update owner object: %s", err)
	}
	return nil
}

func	computeTransactionDetails(bill Bill) string {
	var	details	string
	var	item	Item

	details = fmt.Sprintf("invoicing of %v:", bill.TotalAmount)
	for _, item = range(bill.Items) {
		details = fmt.Sprintf("%s [%s (%v) x %v]", details, item.Name,
		item.Amount, item.Count)
	}
	return (details)
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	payBill(args []string) (string, error) {
	var	err			error
	var	bill		Bill
	var	billBytes	[]byte
	var	billId		string
	var	ccArgs		[][]byte
	var	txDetails	string

	/// CHECK ARGUMENT
	if len(args) != 1 {
		return "", fmt.Errorf("payBill requires one argument. A bill ID")
	}

	/// GET ARGUMENT
	billId = args[0]

	/// GET BILL
	billBytes, err = STUB.GetState(billId)
	if err != nil {
		return "", fmt.Errorf("Cannot get bill: %s", err)
	}
	if billBytes == nil {
		return "", fmt.Errorf("Innexistant bill: %s", billBytes)
	}
	err = json.Unmarshal(billBytes, &bill)
	if err != nil {
		return "", fmt.Errorf("Cannot unmarshal bill: %s", err)
	}

	/// DELETE BILL FROM LEDGER
	//err = STUB.DelState(string(billId))
	//quick & dirty
	err = STUB.PutState(string(billId), []byte("paid"))
	if err != nil {
		return "", fmt.Errorf("Cannot delete bill: %s", err)
	}

	/// DELETE BILL FROM OWNER
	err = deleteBill(bill.OwnerId, billId)
	if err != nil {
		return "", err
	}

	/// COMPUTE TRANSACTION DETAILS
	txDetails = computeTransactionDetails(bill)

	/// CALL CHAINCODE TO PAY BILL
	ccArgs = toChaincodeArgs("transfer", bill.OwnerId,
	fmt.Sprintf("%d", bill.TotalAmount), txDetails)
	response := STUB.InvokeChaincode("ERC20", ccArgs, "")

	if response.Status != shim.OK {
		return "", fmt.Errorf("Cannot transfer assets for the bill: %s", response.Message)
	}

	return fmt.Sprintf("Invoke chaincode successful. ownerid : %s, totalamount: %d, Got response %s", bill.OwnerId, bill.TotalAmount, string(response.Payload)), nil
}
