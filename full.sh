cd ./nodejs-server-server
./build_container.sh
cd ../merchant_app
./build_container.sh
cd ../network
./ptwist.sh init
./ptwist.sh up
docker exec api.MEDSOS.example.com node create_db.js
docker exec api.MEDSOS.example.com node enrollAdmin.js
cbkey="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:8080/users/centralbank' | jq -r '.pubkey')"
echo "central bank user address :${cbkey}"
echo "${cbkey}" > ../centralbank_pubkey.txt
./ptwist.sh deploy $cbkey

