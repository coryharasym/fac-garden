#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="${TMPDIR:-/tmp}/fac-garden-quartz-5"
if [ ! -d "$TMP/.git" ]; then
  git clone https://github.com/jackyzha0/quartz.git "$TMP"
fi
git -C "$TMP" fetch origin 97a2d05f80c4c50534959b1d0d41cc4b3895625e
git -C "$TMP" checkout --detach 97a2d05f80c4c50534959b1d0d41cc4b3895625e
cd "$TMP"
npm ci
rm -rf content
cp -R "$ROOT/content" content
cp "$ROOT/quartz.config.yaml" quartz.config.yaml
npx quartz plugin install --from-config
npx quartz build --serve
