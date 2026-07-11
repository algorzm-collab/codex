# STRATEGY Site Cloudflare Deploy Notes

For the full current handoff state, read `RELEASE_STATUS.md` first.

## Static Upload Scope

Upload the contents of `static/` when deploying as a static Cloudflare site:

- `index.html`
- `styles.css`
- `app.js`
- `strategy-v10/`
- `_headers`
- `_redirects`
- `404.html`
- `favicon.svg`
- `site.webmanifest`
- `robots.txt`
- `sitemap.xml`

Only upload `static/`. Do not upload `internal/strategy-v10-source/`; that folder is retained for local/source review and is not public-safe deploy material.

## Pre-Deploy Check

Run this before uploading:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' check_static_release.py
```

Optional packaged upload artifact:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' package_static_release.py
```

This creates `release/strategy_static_20260708-v10-evidence-os.zip` and a SHA256 manifest.

After deployment, run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' check_deployed_site.py https://strat.kr/
```

The page uses CDN-hosted GSAP, ScrollTrigger, Lenis, and 3D Force Graph. If those fail to load, the native CSS/JavaScript fallback remains usable.

`strategy-v10/` must be uploaded with the static site. The Evidence OS section reads public-safe JSON/JSONL/CSV files from that directory at runtime.

## Backend Notice

The static upload alone does not run `/api/*` endpoints. Inquiry, signup, QA, and survey records need the Python backend in `app.py` or an equivalent API worker.

## Cache Rule

`_headers` keeps `index.html` uncached and lets CSS/JS cache briefly. The version query string in `index.html` should be bumped after each visible release.

