#! /bin/bash

while read record; do
        uname=$(echo $record | cut -d '|' -f 1)
        pubkey=$(echo $record | cut -d '|' -f 2)
        echo -n "$uname : ";


	echo $(curl -s -X GET --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: '"$pubkey"'' 'http://api.plastictwist.com:80/ledger/ptwist/ERC20/balanceOf' | jq -r '.response')
done <usrlist.txt
