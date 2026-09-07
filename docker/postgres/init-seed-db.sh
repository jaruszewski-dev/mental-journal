#!/bin/bash
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
SELECT 'CREATE DATABASE mental_journal_seed'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mental_journal_seed')\gexec
EOSQL
