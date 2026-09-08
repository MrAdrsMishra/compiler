#!/bin/sh
set -e

LANGUAGE="${SELECTED_LANGUAGE:-c}"
WORK_DIR="/app/work"
INPUT_PATH="$WORK_DIR/input.txt"
ERROR_PATH="$WORK_DIR/error.txt"
BUILD_DIR="/tmp/build"
EXEC_DIR="/tmp/exec"
BIN_PATH="$EXEC_DIR/app"

mkdir -p "$BUILD_DIR" "$EXEC_DIR" "$WORK_DIR"

if [ "$LANGUAGE" = "cpp" ]; then
  CODE_PATH="$WORK_DIR/code.cpp"
  COMPILER="g++"
  STD_FLAG="-std=gnu++17"
else
  CODE_PATH="$WORK_DIR/code.c"
  COMPILER="gcc"
  STD_FLAG="-std=c17"
fi

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: source file not found for language $LANGUAGE"
  exit 1
fi

$COMPILER "$CODE_PATH" -O2 $STD_FLAG -o "$BUILD_DIR/app" 2> "$ERROR_PATH" || true

if [ -s "$ERROR_PATH" ]; then
  cat "$ERROR_PATH"
  exit 1
fi

cp "$BUILD_DIR/app" "$BIN_PATH"
chmod +x "$BIN_PATH"

if [ -f "$INPUT_PATH" ]; then
  "$BIN_PATH" < "$INPUT_PATH"
else
  "$BIN_PATH"
fi
