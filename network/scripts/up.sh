#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

export IMAGETAG="latest"
export VERBOSE=false

os=$(uname)
if [[ ${os} == Linux ]]; then
	export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:$PWD/bin_linux:$PATH
else
	export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:$PWD/bin_osx:$PATH
fi

COMPOSE_FILE=docker-compose.yaml
CHANNEL_NAME="ptwist"
CLI_DELAY=3
LANGUAGE=golang
CLI_TIMEOUT=10

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

function _err {
	if [ $1 != 0 ]; then
		echo "ERROR !!!! $2"
		exit 1
	fi
}

function network_up() {
	docker-compose -f $COMPOSE_FILE up -d 2>&1
	result=$?
	_err $result "Unable to start network"
	
	docker exec cli scripts/script.sh $CHANNEL_NAME $CLI_DELAY $LANGUAGE $CLI_TIMEOUT $VERBOSE
	result=$?
	_err $result "Test failed"
}

################################################################################
###                                   MAIN                                   ###
################################################################################

network_up
