#!/bin/sh
set -e

export HOME="/tmp"
export TMPDIR="/tmp"

CODE_PATH="/app/work/code.cs"
INPUT_PATH="/app/work/input.txt"
BIN_PATH="/tmp/app.exe"
ERROR_PATH="/tmp/error.txt"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.cs not found"
  exit 1
fi

mcs "$CODE_PATH" -out:"$BIN_PATH" 2> "$ERROR_PATH" || true

if [ -s "$ERROR_PATH" ]; then
  cat "$ERROR_PATH"
  exit 1
fi

if [ -f "$INPUT_PATH" ]; then
  mono "$BIN_PATH" < "$INPUT_PATH"
else
  mono "$BIN_PATH"
fi
