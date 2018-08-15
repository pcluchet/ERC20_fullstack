#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

LANGUAGE="golang"
CC_SRC_PATH=github.com/chaincode/ERC20/chaincode
set -e

docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n ERC20 -v $1 -p "$CC_SRC_PATH" -l "$LANGUAGE"
	
docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode upgrade -o orderer.example.com:7050 -C ptwist -n ERC20 -l "$LANGUAGE" -v $1 -c '{"function": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEunUWDj0GbeDC1FVcaoopXNYJMFnEOHVGruBkqc6kYtTEMKMRKZ5YapFNDVvY22S2vE8fQu+BeVGMsi1oHpnVAA==", "Args":["lol", "lol"]}' -P "OR ('MEDSOSMSP.member')"
	
