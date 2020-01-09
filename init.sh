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
	printf "${C_RED}ERROR: ${C_NO}%s\n" "${1}" >&2
	exit 1
}

function		success()
{
	printf "${C_GREEN}SUCCESS: ${C_NO}%s\n" "${1}"
}

function		check_bin()
{
	which ${1} > /dev/null
	if [[ $? -ne 0 ]]; then
		fail "Cannot find ${1} program"
	fi
}

function		docker_pull()
{
	docker images | grep hyperledger/fabric-${1} | grep ${2} > /dev/null
	if [[ $? -ne 0 ]]; then
		docker pull hyperledger/fabric-${1}:${2} > /dev/null
		if [[ $? -ne 0 ]]; then
			fail "Cannot pull \"${1}\" docker image"
		fi
		docker tag hyperledger/fabric-${1}:${2} hyperledger/fabric-${1} > /dev/null
		if [[ $? -ne 0 ]]; then
			fail "Cannot tag \"${1}\" docker image"
		fi
	fi
}

################################################################################
###                                   MAIN                                   ###
################################################################################

##################################################
### CHECK DEPENDENCIES
##################################################

export PATH="${PATH}:/usr/local/go/bin/"
check_bin	docker
check_bin	docker-compose
check_bin	node
check_bin	jq
check_bin	go
check_bin	npm
check_bin	curl
success "Dependencies found"

##################################################
### DOWNLOAD FABRIC BINARIES
##################################################

version=1.2.0
kernel="$(uname -s | tr '[:upper:]' '[:lower:]' | sed 's/mingw64_nt.*/windows/')"
machine="$(uname -m | sed 's/x86_64/amd64/g')"
arch="${kernel}-${machine}"
binary_file=hyperledger-fabric-${arch}-${version}.tar.gz
url=https://nexus.hyperledger.org/content/repositories/releases/org/\
hyperledger/fabric/hyperledger-fabric/${arch}-${version}/${binary_file}

if [[ ! -d network/bin ]]; then
	curl ${url} | tar xz || fail "Cannot download fabric binaries"
	mv bin/ network/bin/
fi
success "Binaries imported"

##################################################
### GO DEPENDENCIES
##################################################

mkdir -p network/go
export GOPATH=${PWD}/network/go
go get \
    github.com/hyperledger/fabric/core/chaincode/lib/cid \
    github.com/hyperledger/fabric/core/chaincode/shim \
    github.com/hyperledger/fabric/protos/peer \
	|| fail "Cannot get go dependecies"
success "Go dependencies imported"

##################################################
### DOCKER IMAGES
##################################################

docker_pull	peer	1.4.0
docker_pull	orderer	1.4.0
docker_pull	ccenv	1.4.0
docker_pull	tools	1.4.0
docker_pull	couchdb	0.4.10
docker_pull	ca		1.4.0
success "Docker images pulled"
