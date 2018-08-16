#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

os=$(uname)
export PATH=${PWD}/go/src/github.com/hyperledger/fabric/build/bin:"${PWD}/bin:${PATH}"
export FABRIC_CFG_PATH="${PWD}"
CHANNEL_NAME=ptwist

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

function clean {
	mkdir -p ./config/
	mkdir -p ./crypto-config
	rm -rf ./config/*
	rm -rf ./crypto-config/*
}

function _err {
	echo "Failed to generate $1..."
	exit 1
}

function generate {	
	cryptogen generate \
		--config=./crypto-config.yaml \
		|| _err						"crypto material"
	configtxgen \
		-profile					OneOrgOrdererGenesis \
		-outputBlock				./config/genesis.block \
		|| _err						"orderer genesis block"
	configtxgen \
		-profile					OneOrgChannel \
		-outputCreateChannelTx		./config/channel.tx \
		-channelID					${CHANNEL_NAME} \
		|| _err						"channel configuration transaction" 
	configtxgen \
		-profile					OneOrgChannel \
		-outputAnchorPeersUpdate	./config/MEDSOSMSPanchors.tx \
		-channelID					${CHANNEL_NAME} \
		-asOrg						MEDSOSMSP \
		|| _err						"anchor peer update for MEDSOSMSP"
}

################################################################################
###                                   MAIN                                   ###
################################################################################

clean
generate
