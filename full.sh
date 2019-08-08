cd ./nodejs-server-server
./build_container.sh
cd ../webservices
./build_container.sh
cd ../network
./ptwist.sh init
./ptwist.sh up
docker exec api.MEDSOS.example.com node create_db.js
docker exec api.MEDSOS.example.com node enrollAdmin.js
cbkey="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-misc-private: {"nuro":{"web":{"firstname":"","lastname":"","email":"p.cluchet@pm.me","location":"Lucerne"}}}' --header 'X-request-password: cbpassword' 'http://localhost:80/users/centralbank/auth' | jq -r '.pubkey')"
echo "central bank user address :${cbkey}"
echo "${cbkey}" > ../centralbank_pubkey.txt

docker exec api.HSLU.example.com node create_db.js
docker exec api.HSLU.example.com node enrollAdmin.js

docker exec api.BLUECITY.example.com node create_db.js
docker exec api.BLUECITY.example.com node enrollAdmin.js



./ptwist.sh deploy $cbkey

