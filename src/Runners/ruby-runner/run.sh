#!/bin/sh
set -e

CODE_PATH="/app/work/code.rb"
INPUT_PATH="/app/work/input.txt"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.rb not found"
  exit 1
fi

if [ -f "$INPUT_PATH" ]; then
  ruby "$CODE_PATH" < "$INPUT_PATH"
else
  ruby "$CODE_PATH"
fi
