#! /bin/bash
set -e
rm -vrf ./hfc-key-store && docker cp api.MEDSOS.example.com:/usr/src/app/hfc-key-store ./hfc-key-store && echo "Copied hfc-key-store from container" && ./build_container.sh
cd ../network
docker kill api.MEDSOS.example.com
docker-compose -f ./docker-compose.yml up -d api.MEDSOS.example.com
