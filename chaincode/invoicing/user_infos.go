package main

import	"encoding/json"
import	"fmt"

func	getUserInfos(userPublicKey string) (UserInfos, error) {
	var	err		error
	var	user	UserInfos
	var	value	[]byte

	value, err = STUB.GetState(userPublicKey)
	if err != nil {
		return user, fmt.Errorf("Failed to get asset: %s with error: %s", userPublicKey, err)
	}
	if value == nil {
		return user, fmt.Errorf("Asset not found: %s", userPublicKey)
	}
	if err = json.Unmarshal(value, &user); err != nil {
		return user, err
	}
	return user, nil
}
