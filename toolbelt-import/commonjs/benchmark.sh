#!/bin/bash

display_info() {
  printf "Usage ./bench.sh resultsPath [OPT]\nOptions are:\n"
  printf "  -h: Show this message\n"
  exit 0
}

while getopts "h" OPT; do
  case "$OPT" in
    "h") display_info;;
    "?") display_info;;
  esac
done

OUTPUTDIR=$1

echo "--------- Starting commonjs tests ---------"

function run {

  OUTPUT_FILE=$OUTPUTDIR/commonjs-$1.md
  echo "Node $1 tests"
  echo "Output will be exported to $OUTPUT_FILE"

  nvm install $1
  nvm use $1
  hyperfine --warmup 5 --min-runs 30 --style=full \
    'node axios-require.js' \
    'node vtex-api-require.js' \
    'node simple-require.js' \
    'node destructure-require.js' \
    --export-markdown $OUTPUT_FILE

  ../node_modules/.bin/envinfo envinfo --system --binaries --markdown >> $OUTPUT_FILE

  printf "\n\n"
}

# Setup nvm
. ~/.nvm/nvm.sh

run 14.0.0