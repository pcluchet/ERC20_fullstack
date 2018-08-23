package	main

import "encoding/json"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	whoOweI() (string, error) {
	var publicKey	string
	var userInfo	string
	var ret			UserInfos
	var value		[]byte
	var err			error

	if publicKey, err = getPublicKey(); err != nil {
		return "", err
	}

	if userInfo, err = _get([]string{publicKey}); err != nil {
		return "", err
	}

	if err = json.Unmarshal([]byte(userInfo), &ret); err != nil {
		return "", err
	}

	if value, err = json.Marshal(ret.Allowances); err != nil {
		return "", err
	}


	return string(value), nil
}
