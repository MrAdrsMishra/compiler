#!/bin/sh
set -e

export HOME="/tmp"
export TMPDIR="/tmp"

CODE_PATH="/app/work/code.ts"
INPUT_PATH="/app/work/input.txt"
BUILD_DIR="/tmp/ts-build"
ERROR_PATH="/tmp/error.txt"

mkdir -p "$BUILD_DIR"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.ts not found"
  exit 1
fi

if ! esbuild "$CODE_PATH" --platform=node --format=cjs --target=es2020 --log-level=error --outfile="$BUILD_DIR/code.js" > /dev/null 2> "$ERROR_PATH"; then
  cat "$ERROR_PATH"
  exit 1
fi

if [ ! -f "$BUILD_DIR/code.js" ]; then
  echo "ERROR: TypeScript transpilation failed"
  exit 1
fi

if [ -f "$INPUT_PATH" ]; then
  node "$BUILD_DIR/code.js" < "$INPUT_PATH"
else
  node "$BUILD_DIR/code.js"
fi
