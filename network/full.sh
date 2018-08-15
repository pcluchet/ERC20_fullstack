./ptwist.sh up
docker exec api.MEDSOS.example.com node create_db.js
docker exec api.MEDSOS.example.com node enrollAdmin.js
curl --data "username=ace" --data "password=hello"      http://localhost:8080/register
