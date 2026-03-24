#!/bin/sh
set -e

CODE_PATH="/app/work/code.kt"
INPUT_PATH="/app/work/input.txt"
WORK_DIR="/app/work"
JAR_PATH="/tmp/app.jar"

export HOME="/tmp"
export TMPDIR="/tmp"

mkdir -p /tmp/.kotlin

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.kt not found"
  exit 1
fi

kotlinc "$CODE_PATH" -include-runtime -d "$JAR_PATH" 2> "$WORK_DIR/error.txt" || true

if [ -s "$WORK_DIR/error.txt" ]; then
  cat "$WORK_DIR/error.txt"
  exit 1
fi

if [ -f "$INPUT_PATH" ]; then
  java -jar "$JAR_PATH" < "$INPUT_PATH"
else
  java -jar "$JAR_PATH"
fi
