#!/usr/bin/env python3
"""check-csp.py — verify that every inline executable script on every page
has its sha256 hash whitelisted in the Content-Security-Policy in _headers.

Usage:  python3 tools/check-csp.py   (from repo root)

Exits 0 when the CSP covers every inline script and contains no
'unsafe-inline' / 'unsafe-eval' in script-src. Exits 1 otherwise.
"""
import base64
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HEADERS = ROOT / "_headers"


def inline_scripts(path):
    """Yield the text content of every inline, executable <script> block."""
    s = path.read_text(encoding="utf-8")
    for m in re.finditer(r"<script(?P<attrs>[^>]*)>(?P<body>.*?)</script>", s, re.S):
        attrs = m.group("attrs")
        if "src=" in attrs or "ld+json" in attrs:
            continue
        yield m.group("body")


def sha256_b64(text):
    # CSP hashes inline script text exactly as written in the element
    # (leading/trailing whitespace included — verified against Chromium)
    return base64.b64encode(hashlib.sha256(text.encode("utf-8")).digest()).decode()


def csp_script_src(headers_text):
    m = re.search(r"script-src\s+([^;]+);?", headers_text)
    if not m:
        return []
    return [tok.strip() for tok in m.group(1).split()]


def main():
    headers = HEADERS.read_text(encoding="utf-8")
    allowed = set(csp_script_src(headers))
    if not allowed:
        print("FAIL: no script-src found in _headers")
        return 1

    problems = []
    seen = set()

    for html in sorted(ROOT.glob("*.html")):
        for body in inline_scripts(html):
            h = sha256_b64(body)
            if h not in seen:
                seen.add(h)
                if f"'sha256-{h}'" not in allowed:
                    problems.append(f"{html.name}: inline script not whitelisted (sha256-{h})")

    for tok in ("'unsafe-inline'", "'unsafe-eval'"):
        if tok in allowed:
            problems.append(f"script-src contains {tok}")

    if problems:
        print("FAIL:")
        for p in problems:
            print("  -", p)
        return 1

    print(f"OK: {len(seen)} distinct inline scripts covered; script-src has no unsafe-*")
    return 0


if __name__ == "__main__":
    sys.exit(main())