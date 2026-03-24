#!/bin/sh
set -e

CODE_PATH="/app/work/code.r"
INPUT_PATH="/app/work/input.txt"

export HOME="/tmp"
export TMPDIR="/tmp"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.r not found"
  exit 1
fi

if [ -f "$INPUT_PATH" ]; then
  Rscript "$CODE_PATH" < "$INPUT_PATH"
else
  Rscript "$CODE_PATH"
fi
