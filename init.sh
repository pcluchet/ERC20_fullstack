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

function		fail()
{
	printf "ERROR: %s\n" "${1}" >&2
	exit 1
}

function		check_bin()
{
	which ${1}
	if [[ $? -ne 0 ]]; then
		fail "Cannot find ${1} program."
	fi
}

################################################################################
###                                   MAIN                                   ###
################################################################################

export PATH="${PATH}:/usr/local/go/bin/"
check_bin	docker
check_bin	docker-compose
check_bin	node
check_bin	jq
check_bin	go
check_bin	npm

##################################################
### DOWNLOAD FABRIC BINARIES
##################################################

version=1.2.0
arch=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]' | sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')")
binary_file=hyperledger-fabric-${arch}-${version}.tar.gz
url=https://nexus.hyperledger.org/content/repositories/releases/org/hyperledger/fabric/hyperledger-fabric/${arch}-${version}/${binary_file}

curl ${url} | tar xz || fail "Cannot download fabric binaries"
mv bin/ network/bin/

##################################################
### GO DEPENDENCIES
##################################################

export GOPATH=/usr/local/gopath
go get \
    github.com/hyperledger/fabric/core/chaincode/lib/cid \
    github.com/hyperledger/fabric/core/chaincode/shim \
    github.com/hyperledger/fabric/protos/peer \
	|| fail "Cannot get go dependecies"
