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
set -e

	
	echo "central bank address :" $1
	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n ERC20 -v 1.0 -p "$ERC20_CC_SRC_PATH" -l "$LANGUAGE"
	
	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C ptwist -n ERC20 -l "$LANGUAGE" -v 1.0 -c "{\"function\": \"$1\", \"Args\":[\"$1\", \"$1\"]}" -P "OR ('MEDSOSMSP.member')"
	
	sleep 10

	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n invoicing -v 1.0 -p "$INVOICING_CC_SRC_PATH" -l "$LANGUAGE"
	
	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C ptwist -n invoicing -l "$LANGUAGE" -v 1.0 -c "{\"function\": \"$1\", \"Args\":[\"$1\", \"$1\"]}" -P "OR ('MEDSOSMSP.member')"
	
	sleep 10
