#!/bin/bash

for i in proxy debomatic-webui ; do
  cd $i
  rm -fr node_modules
  npm install
  git add -f node_modules
  cd -
done
