#!/bin/sh
set -e

CODE_PATH="/app/work/code.c"
INPUT_PATH="/app/work/input.txt"
WORK_DIR="/app/work"

BUILD_DIR="/tmp/build"
EXEC_PATH="/tmp/app"

mkdir -p "$BUILD_DIR"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.c not found"
  exit 1
fi

gcc "$CODE_PATH" -O2 -std=c17 -o "$BUILD_DIR/app" 2> "$WORK_DIR/error.txt" || true

if [ -s "$WORK_DIR/error.txt" ]; then
  cat "$WORK_DIR/error.txt"
  exit 1
fi

cp "$BUILD_DIR/app" "$EXEC_PATH"
chmod +x "$EXEC_PATH"

if [ -f "$INPUT_PATH" ]; then
  "$EXEC_PATH" < "$INPUT_PATH"
else
  "$EXEC_PATH"
fi
