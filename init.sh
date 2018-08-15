#!/usr/bin/env bash

if [[ -t 1 ]]; then
	C_RED="\033[31;01m"
	C_GREEN="\033[32;01m"
	C_YELLOW="\033[33;01m"
	C_BLUE="\033[34;01m"
	C_PINK="\033[35;01m"
	C_CYAN="\033[36;01m"
	C_NO="\033[0m"
fi

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

################################################################################
###                                   MAIN                                   ###
################################################################################

##################################################
### DOWNLOAD FABRIC BINARIES
##################################################

version=1.2.0
arch=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]' | sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')")
binary_file=hyperledger-fabric-${arch}-${version}.tar.gz
url=https://nexus.hyperledger.org/content/repositories/releases/org/hyperledger/fabric/hyperledger-fabric/${arch}-${version}/${binary_file}

curl ${url} | tar xz
mv -r bin/ network/bin/
