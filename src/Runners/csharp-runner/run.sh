#!/bin/sh
set -e

CODE_PATH="/app/work/code.cs"
INPUT_PATH="/app/work/input.txt"
WORK_DIR="/app/work"
BIN_PATH="/tmp/app.exe"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.cs not found"
  exit 1
fi

mcs "$CODE_PATH" -out:"$BIN_PATH" 2> "$WORK_DIR/error.txt" || true

if [ -s "$WORK_DIR/error.txt" ]; then
  cat "$WORK_DIR/error.txt"
  exit 1
fi

if [ -f "$INPUT_PATH" ]; then
  mono "$BIN_PATH" < "$INPUT_PATH"
else
  mono "$BIN_PATH"
fi
