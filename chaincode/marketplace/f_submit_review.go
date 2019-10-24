package main

import (
	"encoding/json"
	"fmt"
)

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
func updateReviewMean(itm ShopItem) ShopItem {

	if len(itm.Reviews) == 0 {
		return itm
	}

	var result float64
	for _, element := range itm.Reviews {
		result += float64(element.Grade)
		// element is the element from someSlice for where we are
	}
	itm.ReviewsMean = result / float64(len(itm.Reviews))

	return itm
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////
func submitReview(args []string) (string, error) {

	var err error
	var reviewSubm ReviewSubmission
	var itemBytes []byte

	// CHECK ARGUMENTS
	if len(args) != 1 {
		return "", fmt.Errorf("submitting a review requires one argument")
	}

	/// GET ARGUMENT
	err = json.Unmarshal([]byte(args[0]), &reviewSubm)
	if err != nil {
		return "", fmt.Errorf("Cannot unmarshal review: %s", err)
	}

	userKey, err := getPublicKey()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	txTimeStamp, err2 := STUB.GetTxTimestamp()
	if err2 != nil {
		return "", fmt.Errorf("Error :%s", err2)
	}

	var ReviewToAdd Review

	ReviewToAdd.Author = userKey
	ReviewToAdd.Comment = reviewSubm.Comment
	ReviewToAdd.Grade = reviewSubm.Grade
	ReviewToAdd.Timestamp = uint64(txTimeStamp.Seconds)

	//checking bid proposition againt current state of item
	var itm ShopItem

	itm, err = getItem(reviewSubm.ItemId)
	if err != nil {
		return "", fmt.Errorf("Error: %s", err)
	}

	if itm.Uploader == userKey {
		//return "", fmt.Errorf("You cannot review your own item")
	}

	if reviewSubm.Grade < 0 || reviewSubm.Grade > 5 {
		return "", fmt.Errorf("Grad must be an integer between 0 and 5, included")
	}

	itm.Reviews = append(itm.Reviews, ReviewToAdd)
	itm = updateReviewMean(itm)

	//commit item key
	itemBytes, err = json.Marshal(itm)
	if err != nil {
		return "", fmt.Errorf("Cannot marshal item informations: %s", err)
	}
	err = STUB.PutState(reviewSubm.ItemId, itemBytes)
	if err != nil {
		return "", fmt.Errorf("Cannot update item informations: %s", err)
	}

	return "Review successfully Added", nil
}
