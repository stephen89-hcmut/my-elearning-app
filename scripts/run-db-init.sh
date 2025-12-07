#!/usr/bin/env bash
set -euo pipefail

HOST=${HOST:-127.0.0.1}
PORT=${PORT:-3306}
USER=${USER:-appuser}
PASSWORD=${PASSWORD:-apppass}
FILE=${FILE:-../db_init.sql}

# Runs the db_init.sql script against the configured MySQL instance.
# Requires the mysql client installed and available on PATH.

if [ ! -f "$FILE" ]; then
  echo "SQL file not found at '$FILE'" >&2
  exit 1
fi

export MYSQL_PWD="$PASSWORD"
mysql -h "$HOST" -P "$PORT" -u "$USER" < "$FILE"

echo "Database initialized successfully."