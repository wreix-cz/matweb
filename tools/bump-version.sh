#!/usr/bin/env bash
# bump-version.sh — bump the manual cache-buster (?v=N) in every HTML page.
# Run from the repo root after any change to style.css / main.js / obsah.js:
#   ./tools/bump-version.sh
# It increments every ?v=N occurrence by one (e.g. ?v=8 -> ?v=9) so returning
# visitors never get a stale cached JS/CSS file.
set -euo pipefail

cd "$(dirname "$0")/.."

current="$(grep -ohE '\?v=[0-9]+' *.html | grep -oE '[0-9]+' | sort -n | tail -1)"
if [ -z "$current" ]; then
  echo "No ?v=N found in HTML files — nothing to bump."
  exit 1
fi

next=$((current + 1))
# Replace every occurrence (whatever its current value) so versions stay uniform
sed -i "s/?v=[0-9]\+/?v=${next}/g" *.html
echo "Bumped cache version: ?v=${current} -> ?v=${next}"