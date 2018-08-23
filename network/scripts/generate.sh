#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

source "./network/scripts/lib.sh"

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

################################################################################
###                                   MAIN                                   ###
################################################################################

cryptogen																			\
	generate --config="./network/crypto-config.yaml"								\
	--output="./network/crypto-config"												\
1>/dev/null 2>/dev/null
result=$?
_err $result "certificates"

configtxgen																			\
	-profile MultipleOrgsOrdererGenesis												\
	-outputBlock ./network/channel-artifacts/genesis.block							\
1>/dev/null 2>/dev/null
result=$?
_err $result "orderer genesis block"

configtxgen																			\
	-profile MultipleOrgsChannel													\
	-outputCreateChannelTx ./network/channel-artifacts/channel.tx					\
	-channelID $CHANNEL_NAME														\
1>/dev/null 2>/dev/null
result=$?
_err $result "channel configuration transaction"

for index in medsos bff lucerne; do
	configtxgen																		\
		-profile MultipleOrgsChannel												\
		-outputAnchorPeersUpdate ./network/channel-artifacts/${index}MSPanchors.tx	\
		-channelID $CHANNEL_NAME													\
		-asOrg ${index}MSP															\
	1>/dev/null 2>/dev/null
	result=$?
	_err $result "anchor peer update for ${index}MSP"
done
