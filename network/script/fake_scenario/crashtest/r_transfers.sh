#!/bin/bash
# first arg : how much transfers

for (( i=0; i<$1; i++ ))
do
	echo "Transfer attempt #$i";

	bash ./random_transfer.sh 20 2
	echo "";
done

