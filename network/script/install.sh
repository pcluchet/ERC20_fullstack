#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

LANGUAGE="golang"
CC_NAME="golang"
CC_SRC_PATH=github.com/chaincode/facture/chaincode/facture
set -e

docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n facture -v $1 -p "$CC_SRC_PATH" -l "$LANGUAGE"
	
docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C ptwist -n facture -l "$LANGUAGE" -v $1 -c '{"function": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEd6Re3BXULHVzupsmGpMbAFagoJfSrwS6EsCL6zo32HcJTpC2U8WuAYpMU0hJMRf73C9qapgah/ZxCThxM+U80g==", "Args":["lol", "lol"]}' -P "OR ('MEDSOSMSP.member')"
	
