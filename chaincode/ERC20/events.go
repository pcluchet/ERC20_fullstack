package main

import (
	"encoding/json"
	"fmt"
)

/* ************************************************************************** */
/*		PUBLIC																  */
/* ************************************************************************** */

func event(from string, to string, value uint64, typeofEvent string) error {
	var err error
	var ret []byte
	var last10_key string

	if ret, err = json.Marshal(Events{from, to, value}); err != nil {
		return err
	}
	if err = STUB.PutState(typeofEvent, ret); err != nil {
		return err
	}
	if typeofEvent == "transfer" {
		last10_key = fmt.Sprintf("%s_transfers", from)
		if err = STUB.PutState(last10_key, ret); err != nil {
			return err
		}
	}

	return nil
}
