#!/usr/bin/env bash
# Deploys the latest main to the shared VM. Builds in a fresh release folder while
# the current release keeps serving, then switches /opt/amador/current and restarts.
# Usage: deploy/deploy.sh [ssh-target]   (default: luigi@68.155.151.1)
set -euo pipefail
TARGET="${1:-luigi@68.155.151.1}"

ssh "$TARGET" 'sudo -u amador bash -s' <<'REMOTE'
set -euo pipefail
set -a; . /etc/amador/amador.env; set +a
export PATH=/opt/node/bin:$PATH NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=2048
repo=https://github.com/joseamador0898/amador_asset_management.git
sha=$(git ls-remote "$repo" refs/heads/main | cut -c1-7)
dir=/opt/amador/releases/$(date -u +%Y%m%d-%H%M)-$sha
git clone --quiet --depth 1 "$repo" "$dir"
cd "$dir"
nice -n 10 npm ci --include=dev --no-audit --no-fund --loglevel=error
nice -n 10 npm run build
ln -sfn "$dir" /opt/amador/current.new && mv -T /opt/amador/current.new /opt/amador/current
# Keep the three newest releases.
ls -1dt /opt/amador/releases/*/ | tail -n +4 | xargs -r rm -rf
echo "built $sha"
REMOTE

ssh "$TARGET" 'sudo systemctl restart amador-web && sleep 3 && systemctl is-active amador-web && curl -fsS -o /dev/null -w "app: HTTP %{http_code}\n" http://127.0.0.1:8781/'
