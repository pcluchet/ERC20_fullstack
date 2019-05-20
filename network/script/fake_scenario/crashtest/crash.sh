#! /bin/bash

#create 2 users
u1="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:80/users/user7/auth' | jq -r '.pubkey')"

u2="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:80/users/user8/auth' | jq -r '.pubkey')"

echo "Public keys:";
echo "User1:$u1";
echo "User2:$u2";
echo -e "$u1" > u1_pubkey.txt;
echo -e "$u2" > u2_pubkey.txt;

#each user register their name

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user7' --header 'X-request-password: cbpassword' --header 'params: 0' 'http://localhost:80/ledger/ptwist/ERC20/register'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user8' --header 'X-request-password: cbpassword' --header 'params: 0' 'http://localhost:80/ledger/ptwist/ERC20/register'

#each user receive 100 tokens from centralbank

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: '"$u1"'|100|Initial Dotation' 'http://localhost:80/ledger/ptwist/ERC20/transfer'


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: '"$u2"'|100|Initial Dotation' 'http://localhost:80/ledger/ptwist/ERC20/transfer'

