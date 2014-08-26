#!/bin/bash

for i in proxy debomatic-webui ; do
  cd $i
  rm -fr node_modules
  npm install
  if [ "$i" == "debomatic-webui" ] ; then
    npm install coffee-script
  fi
  git add -f node_modules
  cd -
done
