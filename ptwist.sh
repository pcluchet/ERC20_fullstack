#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

set -e 

readonly port=(8080 9080 10080)
readonly orgs=(medsos bff lucerne)

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

function create_images {
	for index in `seq 0 2`; do
		cd io/${orgs[$index]}/api ; ./build_container.sh ; cd -
	done
}

function launch_containers {
	cd network ; ./scripts/generate.sh ; ./scripts/up.sh
}

function init_apis {
	for index in `seq 0 2`; do
		docker exec api.${orgs[$index]}.com node create_db.js
		docker exec api.${orgs[$index]}.com node enrollAdmin.js

		echo 
		cbkey="$(curl --data 'username=centralbank' --data 'password=cbpassword'      http://localhost:${port[$index]}/register | jq -r '.pubkey')"
		echo "${orgs[$index]} central_bank key: ${cbkey}"
		echo
	done
}

function down {
	cd network ; ./scripts/down.sh
}

function usage {
	echo "Usage: ./ptwist.sh [up || down]"
}

################################################################################
###                                   MAIN                                   ###
################################################################################

case $1 in
	up )
		create_images
		launch_containers
		init_apis ;;
	down )
		down ;;
	* )
		usage ;;
esac
