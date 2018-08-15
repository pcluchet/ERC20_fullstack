
export GOPATH=/usr/local/gopath
cd ./io
./build_container.sh
cd ../network
./ptwist.sh init
./ptwist.sh up
docker exec api.MEDSOS.example.com node create_db.js
docker exec api.MEDSOS.example.com node enrollAdmin.js
cbkey="$(curl --data 'username=centralbank' --data 'password=cbpassword'      http://localhost:8080/register | jq -r '.pubkey')"
echo "central bank user address :${cbkey}"
./ptwist.sh deploy $cbkey

