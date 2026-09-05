Mates

---

Website for MATES — a math correspondence competition for 6th and 7th graders, organized by students of Gymnázium Polička.

## Development

The site is intentionally build-less: static HTML + `obsah.js` (content) + `main.js` (rendering). There is no build or test command — verify by serving the folder (`python3 -m http.server 8734`) and opening it in a browser.

- **After any change to `style.css`, `main.js` or `obsah.js`**, bump the manual cache-buster so returning visitors don't get stale files:

  ```bash
  ./tools/bump-version.sh        # ?v=8 → ?v=9, etc.
  ```

- **After any change to inline `<script>` blocks in the HTML files**, re-verify the Content-Security-Policy in `_headers` still whitelists every inline script (no `'unsafe-inline'` allowed):

  ```bash
  python3 tools/check-csp.py
  ```