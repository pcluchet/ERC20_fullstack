#!/usr/bin/env bash

### ENV
export ORDERER_ADDR=grpc://localhost:7050
export PEER_ADDR=grpc://localhost:7051
export PEER_LISTENER_ADDR=grpc://localhost:7053
export COUCHDB_ADDR=http://localhost:5984
export CA_ADDR=http://localhost:7054

### START SERVER
npm start
