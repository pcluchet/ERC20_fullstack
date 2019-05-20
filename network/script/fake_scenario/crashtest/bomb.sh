#!/bin/bash
# first arg : how much transfers



for (( i=0; i<$1; i++ ))
do
	echo "Launching background transfers #$i";
 	bash ./r_transfers.sh 20 20 &
	sleep 0.5
done

