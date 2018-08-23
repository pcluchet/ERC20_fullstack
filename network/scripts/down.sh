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

function network_down {
	docker-compose -f ${COMPOSE_FILE} down --volumes --remove-orphans
	docker run -v ${PWD}:/tmp/first-network --rm hyperledger/fabric-tools:${IMAGETAG} rm -Rf /tmp/first-network/ledgers-backup
}

function clear_containers() {
	CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /dev-peer.*.ptwist.*/) {print $1}')
	
	if [ -z "${CONTAINER_IDS}" -o "${CONTAINER_IDS}" == " " ]; then
		echo "---- No containers available for deletion ----"
	else
		docker rm -f ${CONTAINER_IDS}
	fi
}

function remove_unwanted_images() {
	DOCKER_IMAGE_IDS=$(docker images | awk '($1 ~ /dev-peer.*.ptwist.*/) {print $3}')
	
	if [ -z "${DOCKER_IMAGE_IDS}" -o "${DOCKER_IMAGE_IDS}" == " " ]; then
		echo "---- No images available for deletion ----"
	else
		docker rmi -f ${DOCKER_IMAGE_IDS}
	fi
}

################################################################################
###                                   MAIN                                   ###
################################################################################

network_down
clear_containers
remove_unwanted_images
