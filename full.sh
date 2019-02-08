#!/usr/bin/env bash

function		part() {
	echo "################################################################################"
	echo "### ${1}"
	echo "################################################################################"
}

### STRICT MODE
set -e

### NODE SERVER
part "NODE SERVER"
cd ./nodejs-server-server
./build_container.sh

### WEBSERVICES
part "WEBSERVICES"
cd ../webservices
./build_container.sh

### NETWORK
cd ../network
part "NETWORK INIT"
./ptwist.sh init
part "NETWORK UP"
./ptwist.sh up

### DATABASE
part "CREATE DATABASE"
docker exec api.MEDSOS.example.com node create_db.js

### ENROLL ADMIN
part "ENROLL ADMIN"
docker exec api.MEDSOS.example.com node enrollAdmin.js

### CENTRALBANK PUBLIC KEY
curl \
	-X POST \
	--header 'Content-Type: application/json' \
	--header 'Accept: application/json' \
	--header 'X-request-password: cbpassword' \
	'http://localhost:80/users/centralbank/auth' > .tmp
cat .tmp | jq -r .pubkey > ../centralbank_pubkey.txt
rm .tmp

### DEPLOY
part "DEPLOY"
./ptwist.sh deploy "$(cat ../centralbank_pubkey.txt)"
