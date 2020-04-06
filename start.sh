#!/bin/bash
if ! [ -x "$(command -v node)" ]; then
  echo Error: Please install Node.js to use this server.
  echo To do this install Node.js from https://nodejs.org/
  exit 1
fi
if [ ! -d "node_modules" ]; then
  npm i
fi
npm run-script start
