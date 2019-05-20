#! /bin/bash
#1st arg : how much users
#2nd arg : how much to transfer

PASSWORD="hello"
#get random username (sender)
r=$(( $RANDOM % $1 + 1)); echo $r

line=$(sed ''$r'q;d' usrlist.txt)
sender_uname=$(echo $line | cut -d '|' -f 1)
sender_pubkey=$(echo $line | cut -d '|' -f 2)
echo $line

#get random username (receiver)
r=$(( $RANDOM % $1 + 1)); echo $r

line=$(sed ''$r'q;d' usrlist.txt)
rec_uname=$(echo $line | cut -d '|' -f 1)
rec_pubkey=$(echo $line | cut -d '|' -f 2)
echo $line

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header "X-request-username: $sender_uname" --header "X-request-password: $PASSWORD" --header 'params: '"$rec_pubkey"'|'"$2"'|crashtest' 'http://api.plastictwist.com:80/ledger/ptwist/ERC20/transfer'





