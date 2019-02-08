#!/usr/bin/env bash

set -e
curl \
	-X POST \
	--header 'Content-Type: application/json' \
	--header 'Accept: application/json' \
	--header 'X-request-password: cbpassword' \
	'http://localhost:8080/users/centralbank' > .tmp
cat .tmp | jq -r .pubkey > ../centralbank_pubkey.txt
echo OK
