#!/bin/bash
# first arg : how much transfers

u1_pk="$(cat ./u1_pubkey.txt)"
u2_pk="$(cat ./u2_pubkey.txt)"


for (( i=0; i<$1; i++ ))
do
	echo "Transfer attempt #$i";

	curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user7' --header 'X-request-password: cbpassword' --header 'params: '"$u2_pk"'|42|Crashtest' 'http://localhost:80/ledger/ptwist/ERC20/transfer'

	echo "";

	curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user8' --header 'X-request-password: cbpassword' --header 'params: '"$u1_pk"'|42|Crashtest' 'http://localhost:80/ledger/ptwist/ERC20/transfer'
	echo "";
done

