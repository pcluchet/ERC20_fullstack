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

function up {
	for index in medsos bff lucerne; do
		cd io/$index/api ; ./build_container.sh ; cd -
	done

	cd network ; ./scripts/generate.sh ; ./scripts/up.sh
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
		up ;;
	down )
		down ;;
	* )
		usage ;;
esac
