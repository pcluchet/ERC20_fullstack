package main

import (
	"encoding/json"
	"fmt"
	"strconv"
)

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func buyItems(args []string) (string, error) {
	var err error
	var submissions SalesSubmission
	var subNow []byte
	var temp_payload string
	var full_payload string

	/// CHECK ARGUMENTS
	/// TODO : when better API, check this better
	if len(args) != 1 {
		return "", fmt.Errorf("buyItems requires one argument.")
	}

	println("Some log")

	err = json.Unmarshal([]byte(args[0]), &submissions)
	if err != nil {
		return "", fmt.Errorf("Cannot unmarshal list of sale submission.")
	}

	for index, submission := range submissions {
		//creating a fake args array to call buyItem for each sale submission
		fakeargs := make([]string, 0)
		subNow, err = json.Marshal(submission)
		if err != nil {
			return "", fmt.Errorf("Cannot re-marshal sale submission from list ")
		}
		fakeargs = append(fakeargs, (string(subNow)))
		temp_payload, err = buyItem(fakeargs)

		if index == 0 {
			full_payload += temp_payload
		} else {
			full_payload += " | " + temp_payload
		}
		if err != nil {
			return full_payload, fmt.Errorf("At least one of the sale submissions was unsuccessfull (" + strconv.Itoa(index) + " : " + err.Error() + ") no sales have been commited to the ledger")
		}
	}
	return full_payload, nil
}
