#!/usr/bin/env bash
################################ BY CACTUSFLUO #################################

function		header() {
	80
	echo "### ${1}"
	80
}

export SOFTHSM2_CONF=./hsm-config.config

header "HSM TOKEN"
softhsm2-util \
  --init-token \
  --slot 0 \
  --label "erc20"

header "RUN TESTS"
node test.js
