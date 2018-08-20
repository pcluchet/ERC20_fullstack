#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

export FABRIC_CFG_PATH=${PWD}

os=$(uname)
if [[ ${os} == Linux ]]; then
	export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:$PWD/bin_linux:$PATH
else
	export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:$PWD/bin_osx:$PATH
fi

CHANNEL_NAME="ptwist"

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

function _err {
	if [ $1 != 0 ]; then
		echo "Failed to generate $2..."
		exit 1
	fi
}

function clean {
	mkdir -p ./crypto-config ./channel-artifacts
	rm -rf ./crypto-config/* ./channel-artifacts/*
}

function generate {
	cryptogen generate --config=./crypto-config.yaml
	result=$?
	_err $result "certificates"
	
	configtxgen -profile MultipleOrgsOrdererGenesis -outputBlock \
	./channel-artifacts/genesis.block
	result=$?
	_err $result "orderer genesis block"
	
	configtxgen -profile MultipleOrgsChannel -outputCreateChannelTx \
	./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
	result=$?
	_err $result "channel configuration transaction"
	
	for index in medsos bff lucerne; do
		configtxgen -profile MultipleOrgsChannel -outputAnchorPeersUpdate \
		./channel-artifacts/${index}MSPanchors.tx -channelID $CHANNEL_NAME -asOrg ${index}MSP
		result=$?
		_err $result "anchor peer update for ${index}MSP"
	done
}

################################################################################
###                                   MAIN                                   ###
################################################################################

clean
generate
