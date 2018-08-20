#this script resolve the adresses of peer/orderer since it has caused some issues
#should not be necessary in production, seems like docker problem

#extraction of the adress
CORE_ADDR=$(grep -oP 'grpc://\K.*?(?=:)' <<< "$PEER_ADDR")

#resolving ip
echo $CORE_ADDR
CORE_IP=$(getent hosts $CORE_ADDR | awk '{ print $1 }')
echo $CORE_IP

#replacing adress with ip in the env variable
export PEER_ADDR=$(echo $PEER_ADDR | sed -e "s/$(echo $CORE_ADDR)/$(echo $CORE_IP)/g")


#extraction of the adress
CORE_ADDR=$(grep -oP 'grpc://\K.*?(?=:)' <<< "$PEER_LISTENER_ADDR")

#resolving ip
echo $CORE_ADDR
CORE_IP=$(getent hosts $CORE_ADDR | awk '{ print $1 }')
echo $CORE_IP

#replacing adress with ip in the env variable
export PEER_LISTENER_ADDR=$(echo $PEER_LISTENER_ADDR | sed -e "s/$(echo $CORE_ADDR)/$(echo $CORE_IP)/g")


#extraction of the adress
CORE_ADDR=$(grep -oP 'grpc://\K.*?(?=:)' <<< "$ORDERER_ADDR")

#resolving ip
echo $CORE_ADDR
CORE_IP=$(getent hosts $CORE_ADDR | awk '{ print $1 }')
echo $CORE_IP

#replacing adress with ip in the env variable
export ORDERER_ADDR=$(echo $ORDERER_ADDR | sed -e "s/$(echo $CORE_ADDR)/$(echo $CORE_IP)/g")