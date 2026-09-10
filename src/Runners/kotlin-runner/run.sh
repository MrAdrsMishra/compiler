#!/bin/sh
set -e

export HOME="/tmp"
export TMPDIR="/tmp"

CODE_PATH="/app/work/code.kt"
INPUT_PATH="/app/work/input.txt"
JAR_PATH="/tmp/app.jar"
ERROR_PATH="/tmp/error.txt"

mkdir -p /tmp/.kotlin

if [ ! -f "$CODE_PATH" ]; then
  echo "ERROR: code.kt not found"
  exit 1
fi

kotlinc "$CODE_PATH" -include-runtime -d "$JAR_PATH" 2> "$ERROR_PATH" || true

if [ -s "$ERROR_PATH" ]; then
  cat "$ERROR_PATH"
  exit 1
fi

if [ -f "$INPUT_PATH" ]; then
  java -jar "$JAR_PATH" < "$INPUT_PATH"
else
  java -jar "$JAR_PATH"
fi
