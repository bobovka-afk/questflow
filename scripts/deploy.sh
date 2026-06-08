#!/usr/bin/env bash
set -euo pipefail

ROOT="${QUESTFLOW_ROOT:-/opt/questflow}"
BACKEND="${ROOT}/backend"
FRONTEND="${ROOT}/frontend"

if [[ ! -f "${BACKEND}/.env" ]]; then
  echo "Missing ${BACKEND}/.env — create it on the server before deploy."
  exit 1
fi

SERVER_URL="$(
  grep -E '^SERVER_URL=' "${BACKEND}/.env" \
    | cut -d= -f2- \
    | tr -d '\r"' \
    | sed 's/[[:space:]]*$//'
)"

if [[ -z "${SERVER_URL}" ]]; then
  echo "SERVER_URL is empty in ${BACKEND}/.env"
  exit 1
fi

echo "==> Backend (docker compose build + migrate + start)"
cd "${BACKEND}"
docker compose up -d --build app

echo "==> Frontend (vite build)"
cd "${FRONTEND}"
npm ci
VITE_API_URL="${SERVER_URL}" npm run build

echo "==> Reload nginx"
if command -v nginx >/dev/null 2>&1; then
  nginx -t
  systemctl reload nginx
fi

echo "Deploy OK at $(date -Iseconds)"
