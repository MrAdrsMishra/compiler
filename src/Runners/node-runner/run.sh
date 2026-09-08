#!/bin/sh
set -e

LANGUAGE="${SELECTED_LANGUAGE:-javascript}"
WORK_DIR="/app/work"
INPUT_PATH="$WORK_DIR/input.txt"
TS_BUILD_DIR="/tmp/ts-build"

if [ "$LANGUAGE" = "typescript" ]; then
  CODE_PATH="$WORK_DIR/code.ts"

  if [ ! -f "$CODE_PATH" ]; then
    echo "ERROR: code.ts not found"
    exit 1
  fi

  mkdir -p "$TS_BUILD_DIR"

  if ! esbuild "$CODE_PATH" --platform=node --format=cjs --target=es2020 --log-level=error --outfile="$TS_BUILD_DIR/code.js" > /dev/null 2> "$WORK_DIR/error.txt"; then
    cat "$WORK_DIR/error.txt"
    exit 1
  fi

  if [ -f "$INPUT_PATH" ]; then
    node "$TS_BUILD_DIR/code.js" < "$INPUT_PATH"
  else
    node "$TS_BUILD_DIR/code.js"
  fi

  exit 0
fi

CODE_PATH="$WORK_DIR/code.js"
if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.js not found"
  exit 1
fi

if [ -f "$INPUT_PATH" ]; then
  node "$CODE_PATH" < "$INPUT_PATH"
else
  node "$CODE_PATH"
fi
