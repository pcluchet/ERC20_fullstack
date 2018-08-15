#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

set -e

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

function down {
	docker-compose -f ./docker-compose.yml stop
	docker-compose -f ./docker-compose.yml kill && docker-compose -f docker-compose.yml down
}

function clean {
	rm -f ~/.hfc-key-store/*
	docker rm $(docker ps -aq)
	docker rmi $(docker images dev-* -q)
}

################################################################################
###                                   MAIN                                   ###
################################################################################

down
clean
