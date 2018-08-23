#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

source "./network/scripts/lib.sh"

export IMAGETAG="latest"
export COMPOSE_FILE="./network/docker-compose.yaml"
export PATH=${PATH}:"./network/bin_osx"
export FABRIC_CFG_PATH="./network"
export CHANNEL_NAME="ptwist"
export LANGUAGE="golang"
export CC_SRC_PATH="github.com/chaincode/ERC20/chaincode"
export ERC20_CC_SRC_PATH="github.com/chaincode/ERC20"
export INVOICING_CC_SRC_PATH="github.com/chaincode/invoicing"

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

function create_images {
	for org in medsos bff lucerne; do
		cd io/${org}/api
		
		./build_container.sh
		result=$?
		_err ${result} "Failed to create images"
		
		cd $OLDPWD
	done
}

function network_up {
	mkdir -p ./network/crypto-config ./network/channel-artifacts
	./network/scripts/generate.sh

	echo
	docker-compose -f ${COMPOSE_FILE} up -d
	result=$?
	_err $result "Unable to start network"
	
	docker exec cli scripts/up.sh ${CHANNEL_NAME} ${LANGUAGE} ${ERC20_CC_SRC_PATH} ${INVOICING_CC_SRC_PATH}

}

function network_down {
	rm -rf ./network/channel-artifacts ./network/crypto-config
	./network/scripts/down.sh
}

function usage {
	echo "Usage: ./ptwist.sh [up || down]"
}

################################################################################
###                                   MAIN                                   ###
################################################################################

case $1 in
	up )
		./network/scripts/init.sh
		create_images
		network_up ;;
	down )
		network_down ;;
	* )
		usage ;;
esac
