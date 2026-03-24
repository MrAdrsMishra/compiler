#!/bin/sh
set -e

CODE_PATH="/app/work/code.swift"
INPUT_PATH="/app/work/input.txt"
WORK_DIR="/app/work"
BIN_PATH="/tmp/app"

export HOME="/tmp"
export TMPDIR="/tmp"
export SWIFT_MODULECACHE_PATH="/tmp/swift-module-cache"
export CLANG_MODULE_CACHE_PATH="/tmp/clang-module-cache"

mkdir -p "$SWIFT_MODULECACHE_PATH" "$CLANG_MODULE_CACHE_PATH"

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.swift not found"
  exit 1
fi

swiftc "$CODE_PATH" -O -o "$BIN_PATH" 2> "$WORK_DIR/error.txt" || true

if [ -s "$WORK_DIR/error.txt" ]; then
  cat "$WORK_DIR/error.txt"
  exit 1
fi

if [ -f "$INPUT_PATH" ]; then
  "$BIN_PATH" < "$INPUT_PATH"
else
  "$BIN_PATH"
fi
