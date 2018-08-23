package	main

import	"fmt"
import	"encoding/json"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

func	getUser() (UserInfos, error) {
	var	err			error
	var	ownerId		string
	var	user		UserInfos

	/// GET USER OBJECT
	ownerId, err = getPublicKey()
	if err != nil {
		return user, fmt.Errorf("Cannot get user public key: %s", err)
	}
	user, err = getUserInfos(ownerId)
	if err != nil {
		return user, fmt.Errorf("Cannot get user info: %s", err)
	}
	return user, nil
}

func	getBillList(user UserInfos) ([]BillInfos, error) {
	var	err			error
	var	billId		string
	var	bill		Bill
	var	billInfos	BillInfos
	var	billBytes	[]byte
	var	list		[]BillInfos

	for _, billId = range user.Bills {
		billBytes, err = STUB.GetState(billId)
		if err != nil {
			return nil, fmt.Errorf("Cannot get user bills: %s", err)
		}
		if billBytes == nil {
			return nil, fmt.Errorf("Cannot find user bill \"%s\"", billId)
		}
		err = json.Unmarshal(billBytes, &bill)
		if err != nil {
			return nil, fmt.Errorf("Cannot unmarshal user bills")
		}
		billInfos.BillId = billId
		billInfos.OwnerId = bill.OwnerId
		billInfos.Items = bill.Items
		billInfos.TotalAmount = bill.TotalAmount
		list = append(list, billInfos)
	}
	return list, nil
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	listBills(args []string) (string, error) {
	var	err			error
	var	user		UserInfos
	var	list		[]BillInfos
	var	listBytes	[]byte

	/// CHECK ARGUMENTS
	if len(args) != 0 {
		return "", fmt.Errorf("listBills does not require any argument")
	}

	/// GET USER
	user, err = getUser()
	if err != nil {
		return "", err
	}

	/// GET BILL LIST
	list, err = getBillList(user)
	if err != nil {
		return "", err
	}

	/// STRINGIFY LIST
	listBytes, err = json.Marshal(list)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal bill list: %s", err)
	}

	return string(listBytes), nil
}
