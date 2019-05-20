#! /bin/bash
# first arg : amount of accounts to create
export LC_ALL=C

PASSWORD="hello"
for (( c=0; c<=$1; c++ ))
do

NEW_UUID=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
	echo "Creating account for $NEW_UUID"
	u1="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header "X-request-password: $PASSWORD" 'http://localhost:80/users/'$NEW_UUID'/auth' | jq -r '.pubkey')"

	echo "public key:$u1";
	echo $NEW_UUID'|'$u1 >> usrlist.txt
done

#each user register their name

while read record; do
	uname=$(echo $record | cut -d '|' -f 1)
	pubkey=$(echo $record | cut -d '|' -f 2)
	echo "Registering $uname in ERC20";
	curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header "X-request-username: $uname" --header "X-request-password: $PASSWORD" --header 'params: ' 'http://localhost:80/ledger/ptwist/ERC20/register'

	echo "";
done <usrlist.txt

#curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user7' --header 'X-request-password: cbpassword' --header 'params: 0' 'http://localhost:80/ledger/ptwist/ERC20/register'

#curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user8' --header 'X-request-password: cbpassword' --header 'params: 0' 'http://localhost:80/ledger/ptwist/ERC20/register'

#each user receive 100 tokens from centralbank

while read record; do
	uname=$(echo $record | cut -d '|' -f 1)
	pubkey=$(echo $record | cut -d '|' -f 2)
	echo "Transfering 100 tokens to $uname ";


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: '"$pubkey"'|100|Initial Dotation' 'http://localhost:80/ledger/ptwist/ERC20/transfer'
	echo "";
done <usrlist.txt

