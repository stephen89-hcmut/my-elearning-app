#!/usr/bin/env bash
set -euo pipefail

HOST=${HOST:-127.0.0.1}
PORT=${PORT:-3306}
USER=${USER:-root}
PASSWORD=${PASSWORD:-rootpass}

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILE=${FILE:-"$SCRIPT_DIR/../db_init.sql"}

if [[ "$FILE" != /* ]]; then
  FILE="$SCRIPT_DIR/$FILE"
fi

if ! command -v mysql >/dev/null 2>&1; then
  if command -v docker >/dev/null 2>&1; then
    USE_DOCKER=1
  else
    echo "MySQL client ('mysql') not found on PATH and Docker is unavailable. Install a MySQL client or start Docker." >&2
    exit 1
  fi
fi

# Runs the db_init.sql script against the configured MySQL instance.
# Requires the mysql client installed and available on PATH.

if [ ! -f "$FILE" ]; then
  echo "SQL file not found at '$FILE'" >&2
  exit 1
fi

export MYSQL_PWD="$PASSWORD"
if [ "${USE_DOCKER:-0}" -eq 1 ]; then
  # Run via mysql client inside the elearning-mysql container
  docker exec -i elearning-mysql mysql -u"$USER" -p"$PASSWORD" < "$FILE"
else
  mysql -h "$HOST" -P "$PORT" -u "$USER" < "$FILE"
fi

echo "Database initialized successfully."