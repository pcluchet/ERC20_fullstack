package	main

import	"crypto/ecdsa"
import	"crypto/x509"
import	"encoding/pem"
import	"fmt"
import	"strings"
import	"github.com/hyperledger/fabric/core/chaincode/lib/cid"

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

//Encode the given ecdsa key in pem format
func	pemEncodePublicKey(publicKey *ecdsa.PublicKey) string {
	var	x509EncodedPublicKey	[]byte
	var	pemEncodedPublicKey		[]byte

	x509EncodedPublicKey, _ = x509.MarshalPKIXPublicKey(publicKey)
	pemEncodedPublicKey = pem.EncodeToMemory(&pem.Block{Type: "PUBLIC KEY", Bytes: x509EncodedPublicKey})
	return string(pemEncodedPublicKey)
}

//return the public key of creator in pem format
func	getPemPublicKeyOfCreator() (string, error) {
	var	err				error
	var	ecdsaPublicKey	*ecdsa.PublicKey
	var	cert			*x509.Certificate

	cert, err = cid.GetX509Certificate(STUB)
	if err != nil {
		return "", fmt.Errorf("Error : %s", err)
	}
	ecdsaPublicKey = cert.PublicKey.(*ecdsa.PublicKey)
	return pemEncodePublicKey(ecdsaPublicKey), nil
}

//trim public key to remove newlines and begin/end tag
func	trimPemPubKey(key string) string {
	key = strings.Replace(key, "\n", "", -1)
	key = strings.Replace(key, "-----BEGIN PUBLIC KEY-----", "", -1)
	key = strings.Replace(key, "-----END PUBLIC KEY-----", "", -1)
	return key
}

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

//return the trimmed public key of creator in pem format
func	getPublicKey() (string, error) {
	var	err		error
	var	spender	string

	spender, err = getPemPublicKeyOfCreator()
	if err != nil {
		return "", fmt.Errorf("Cannot get creator of the transaction : %s", err)
	}
	spender = trimPemPubKey(spender)
	return spender, nil
}
