#!/bin/sh
set -e

export HOME="/tmp"
export TMPDIR="/tmp"

CODE_PATH="/app/work/code.sh"
INPUT_PATH="/app/work/input.txt"
RUN_PATH="/tmp/code.sh"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.sh not found"
  exit 1
fi

# Mount is read-only: copy onto the exec-capable tmpfs before running
cp "$CODE_PATH" "$RUN_PATH"
chmod +x "$RUN_PATH"

if [ -f "$INPUT_PATH" ]; then
  bash "$RUN_PATH" < "$INPUT_PATH"
else
  bash "$RUN_PATH"
fi
