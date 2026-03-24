#!/bin/sh
set -e

CODE_PATH="/app/work/code.php"
INPUT_PATH="/app/work/input.txt"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.php not found"
  exit 1
fi

if [ -f "$INPUT_PATH" ]; then
  php "$CODE_PATH" < "$INPUT_PATH"
else
  php "$CODE_PATH"
fi
