#!/bin/sh
set -e

CODE_PATH="/app/work/code.sh"
INPUT_PATH="/app/work/input.txt"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.sh not found"
  exit 1
fi

chmod +x "$CODE_PATH"

if [ -f "$INPUT_PATH" ]; then
  bash "$CODE_PATH" < "$INPUT_PATH"
else
  bash "$CODE_PATH"
fi
