#!/bin/bash
# SessionStart hook for Claude Code on the web: installs dependencies,
# brings up a local Postgres, and pushes + seeds the Prisma schema so
# `npm run dev`, lint and typecheck work immediately in a fresh session.
set -euo pipefail

# Only needed in remote (web) sessions; local machines manage their own setup.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# 1. Dependencies (postinstall runs `prisma generate`).
npm install

# 2. Local Postgres. The web container ships PostgreSQL 16; start it if it
#    isn't running and create the app role/database idempotently.
if command -v pg_lsclusters >/dev/null 2>&1; then
  if ! sudo -u postgres psql -c "SELECT 1" >/dev/null 2>&1; then
    service postgresql start || pg_ctlcluster 16 main start
  fi
  sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='poorstudents'" | grep -q 1 \
    || sudo -u postgres psql -c "CREATE USER poorstudents WITH PASSWORD 'poorstudents' CREATEDB"
  sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='poorstudents'" | grep -q 1 \
    || sudo -u postgres psql -c "CREATE DATABASE poorstudents OWNER poorstudents"
else
  echo "WARNING: PostgreSQL not found in this environment; skipping database setup." >&2
  exit 0
fi

# 3. Dev .env (only if missing — never overwrite real config).
if [ ! -f .env ]; then
  cat > .env << 'ENV'
DATABASE_URL="postgresql://poorstudents:poorstudents@localhost:5432/poorstudents"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-not-for-production"
ADMIN_EMAILS="admin@example.com"
ENV
fi

# 4. Schema + seed data (both idempotent: db push diffs, seed upserts).
npm run db:setup
