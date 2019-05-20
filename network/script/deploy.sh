#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

LANGUAGE="golang"
ERC20_CC_SRC_PATH=github.com/chaincode/ERC20/
INVOICING_CC_SRC_PATH=github.com/chaincode/invoicing/
SHOP_USER_CC_SRC_PATH=github.com/chaincode/marketplace
set -e

	
### CC erc20
	echo "central bank address :" $1

	docker exec  -e "CORE_PEER_ADDRESS=peer1.MEDSOS.example.com:7051" -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n ERC20 -v 1.0 -p "$ERC20_CC_SRC_PATH" -l "$LANGUAGE"

	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n ERC20 -v 1.0 -p "$ERC20_CC_SRC_PATH" -l "$LANGUAGE"

	docker exec  -e "CORE_PEER_ADDRESS=peer0.HSLU.example.com:7051" -e "CORE_PEER_LOCALMSPID=HSLUMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/HSLU.example.com/users/Admin@HSLU.example.com/msp" cli peer chaincode install -n ERC20 -v 1.0 -p "$ERC20_CC_SRC_PATH" -l "$LANGUAGE"
	

	
	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C ptwist -n ERC20 -l "$LANGUAGE" -v 1.0 -c "{\"function\": \"$1\", \"Args\":[\"$1\", \"$1\"]}" -P "OR ('MEDSOSMSP.member', 'HSLUMSP.member')" 
	
	sleep 10


### Marketplace CC

#	docker exec  -e "CORE_PEER_ADDRESS=peer1.MEDSOS.example.com:7051" -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n marketplace -v 1.0 -p "$SHOP_USER_CC_SRC_PATH" -l "$LANGUAGE"

#	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n marketplace -v 1.0 -p "$SHOP_USER_CC_SRC_PATH" -l "$LANGUAGE"
	
#parsedkey="$(echo '[\"'"$1"'\"]')"
#	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C ptwist -n marketplace -l "$LANGUAGE" -v 1.0 -c "{\"Args\":[\"$parsedkey\"]}" -P "OR ('MEDSOSMSP.member')" 
	
#	sleep 10
