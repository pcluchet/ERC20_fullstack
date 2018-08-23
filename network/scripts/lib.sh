#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

################################################################################
###                                   MAIN                                   ###
################################################################################

function _err {
	if [ $1 != 0 ]; then
		echo
		echo "$2"
		exit 1
	fi
}

set_globals() {
	PEER=$1
	ORG=$2
	
	CORE_PEER_LOCALMSPID="${ORG}MSP"
	CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG}.com/peers/peer${PEER}.${ORG}.com/tls/ca.crt
	CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG}.com/users/Admin@${ORG}.com/msp
	CORE_PEER_ADDRESS=peer${PEER}.${ORG}.com:7051
}

