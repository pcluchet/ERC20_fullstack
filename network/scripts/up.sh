#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

source "./scripts/lib.sh"

CHANNEL_NAME="$1"
LANGUAGE="$2"
ERC20_CC_SRC_PATH="$3"
INVOICING_CC_SRC_PATH="$4"

DELAY="3"
TIMEOUT="10"
VERBOSE="false"
COUNTER="1"
MAX_RETRY="5"

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

create_channel() {
	set_globals 0 medsos

	if [ -z "${CORE_PEER_TLS_ENABLED}" -o "${CORE_PEER_TLS_ENABLED}" = "false" ]; then
		echo
		echo "TLS DISABLED"

		peer channel create							\
			-o orderer.ptwist.com:7050				\
			-c ${CHANNEL_NAME}						\
			-f ./channel-artifacts/channel.tx

		result=$?
	else
		echo
		echo "TLS ACTIVATED"
		
		peer channel create							\
			-o orderer.ptwist.com:7050				\
			-c ${CHANNEL_NAME}						\
			-f ./channel-artifacts/channel.tx		\
			--tls ${CORE_PEER_TLS_ENABLED}			\
			--cafile ${ORDERER_CA}

		result=$?
	fi

	_err ${result} "Channel creation failed"
	echo
	echo "===================== Channel '${CHANNEL_NAME}' created ===================== "
}

function join_channel_with_retry {
	PEER=$1
	ORG=$2
	
	set_globals ${PEER} ${ORG}
	
	peer channel join -b ${CHANNEL_NAME}.block
	result=$?
	
	if [ ${result} -ne 0 -a ${COUNTER} -lt ${MAX_RETRY} ]; then
		COUNTER=$(expr ${COUNTER} + 1)
		echo "peer${PEER}.${ORG} failed to join the channel, Retry after ${DELAY} seconds"
		sleep ${DELAY}
		join_channel_with_retry ${PEER} ${ORG}
	else
		COUNTER="1"
	fi
	
	_err ${result} "After ${MAX_RETRY} attempts, peer${PEER}.${ORG} has failed to join channel '${CHANNEL_NAME}' "
}

function install_chaincode {
	PEER=$1
	ORG=$2
	
	set_globals ${PEER} ${ORG}
	
	peer chaincode install -n ERC20 -v 1.0 -p "${ERC20_CC_SRC_PATH}" -l "${LANGUAGE}"
	result=$?
	_err ${result} "ERC20 chaincode installation on peer${PEER}.${ORG} has failed"

	sleep 10
	
	peer chaincode install -n invoicing -v 1.0 -p "${INVOICING_CC_SRC_PATH}" -l "${LANGUAGE}"
	result=$?
	_err ${result} "Invoicing chaincode installation on peer${PEER}.${ORG} has failed"	

	sleep 10
}

############################################################################### 
###                                   MAIN                                   ###
################################################################################

create_channel

for org in medsos bff lucerne; do
	for peer in 0 1; do
		join_channel_with_retry ${peer} ${org}
		echo
		echo "===================== peer${peer}.${org} joined channel '$CHANNEL_NAME' ===================== "
		sleep $DELAY

		install_chaincode ${peer} ${org}
		echo
		echo "===================== Chaincodes are installed on peer${PEER}.${ORG} ======================== "
	done
done
