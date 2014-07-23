#!/bin/bash

ARCH=$1
PORT=$2

echo "###
debomatic-webui $ARCH configuration
###

architecture = \"$ARCH\"
port = $PORT

# DO NOT EDIT THIS LINE:
config = require(process.env.DWCONFIG + '/mergerconfig.coffee')(architecture, port)
