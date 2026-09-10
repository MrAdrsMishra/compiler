#!/bin/sh
set -e

export HOME="/tmp"
export TMPDIR="/tmp"

CODE_PATH="/app/work/code.rs"
INPUT_PATH="/app/work/input.txt"

EXEC_DIR="/tmp"
BIN_EXEC="$EXEC_DIR/app"
ERROR_PATH="/tmp/error.txt"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.rs not found"
  exit 1
fi

# Compile (allowed) directly into the writable tmpfs
rustc "$CODE_PATH" -C linker=/usr/bin/gcc -O -o "$BIN_EXEC" 2> "$ERROR_PATH" || true

if [ -s "$ERROR_PATH" ]; then
  cat "$ERROR_PATH"
  exit 1
fi

chmod +x "$BIN_EXEC"

# Run
if [ -f "$INPUT_PATH" ]; then
  "$BIN_EXEC" < "$INPUT_PATH"
else
  "$BIN_EXEC"
fi
