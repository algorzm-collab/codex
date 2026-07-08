# STRATEGY Site Release Status

Updated: 2026-07-08 KST

## Current Build

- Build label: `20260708-v10-evidence-os`
- Public company name: `STRATEGY`
- Domain target: `https://strat.kr/`
- Static root: `outputs/strat_site_mvp/static/`
- Backend entrypoint: `outputs/strat_site_mvp/app.py`

## What Is Implemented

- Award-style public homepage motion layer:
  - GSAP 3.13.0
  - ScrollTrigger
  - Lenis 1.3.8
  - native fallback when CDN libraries do not load
- Hero diagnosis experience:
  - animated strategy canvas
  - impact frame
  - command deck
  - Issue Finder panel
- Conversion system:
  - Issue Finder diagnosis flow
  - result meter
  - Case Radar proof map
  - radar lens filters
  - Diagnosis Dock
  - inquiry context auto-fill
- Trust and proof:
  - flagship proof panels
  - case cards reordered by diagnosis type
  - contact trust strip
- Legacy beta content absorption:
  - Method Lab
  - representative-led leadership board
  - expert project cells
  - masked credential stack
  - selected leadership/methodology assets
- STRATEGY 2.0 case-study conversion:
  - masked Case Study Lab
  - case-study type filters
  - Situation / Real Problem / Judgment / Method / Deliverables / Visitor Hook structure
  - first-meeting questions and hypothetical solution prompts
  - conservative Before / After and Decision Impact blocks without unverified performance numbers
  - case-study CTA context passed into inquiry form
- STRATEGY Evidence OS v10:
  - v10 public-safe JSON/JSONL/CSV data loaded from `static/strategy-v10/`
  - internal v10 planning/source files moved out of the deploy folder to `internal/strategy-v10-source/`
  - RFP retrieval utility exposed as `window.STRATEGY_EVIDENCE_OS.retrieveSimilarCases()`
  - direct / adjacent / indirect relevance sorting
  - evidence layer separation for company official, key-person PM, prior leadership, and internal context
  - public projection masks raw client names and removes years, amounts, previous-company names, and unsupported impact claims from deployable data
  - homepage sections for interactive evidence search, trust strip, heatmap, constellation, value chain, anchor map, person card, evidence pyramid, and Korea secondary map
- Static deploy assets:
  - `_headers`
  - `_redirects`
  - `404.html`
  - `favicon.svg`
  - `site.webmanifest`
  - `robots.txt`
  - `sitemap.xml`

## Must-Run Checks

From `outputs/strat_site_mvp/`:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' check_static_release.py
```

After Cloudflare deployment:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' check_deployed_site.py https://strat.kr/
```

General syntax checks:

```powershell
node --check static\app.js
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m py_compile app.py
```

Optional release package:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' package_static_release.py
```

Output:

- `release/strategy_static_20260708-v10-evidence-os.zip`
- `release/strategy_static_20260708-v10-evidence-os_manifest.json`

## Known Limitation

Local browser QA passed for `#evidence-os` on desktop and mobile viewport:

- desktop: Evidence OS rendered 4 direct, 6 adjacent, and 4 indirect cases; no console errors; no horizontal overflow
- mobile 390px width: Evidence OS rendered 14 matched cases; no console errors; no horizontal overflow
- local HTTP smoke check passed for `/`, `/app.js?v=v10-evidence`, and `/strategy-v10/strategy_v10_records.jsonl`

After the public-safe data projection, the current release was rechecked with:

- `node --check static\app.js`
- `node --check serve-static.cjs`
- `check_static_release.py`
- `package_static_release.py`

Final deployed QA still needs to be run after uploading to Cloudflare because CDN, headers, and public domain cache behavior can differ from local static serving.

## Next Best Work

1. Deploy `static/` to Cloudflare, including the full `strategy-v10/` directory.
2. Run `check_deployed_site.py https://strat.kr/`.
3. Perform deployed visual QA at desktop and mobile breakpoints listed in `AWARD_QA_CHECKLIST.md`, especially `#evidence-os`.
4. Confirm `/api/*` behavior:
   - if using static-only Cloudflare, API endpoints will not work;
   - use the Python backend or replace endpoints with Worker/API routes.
5. Upgrade content using:
   - `CONTENT_STRATEGY.md`
   - `CONTENT_REQUESTS.md`
6. Commit and push when ready.

## Git Status Caveat

The bundled Git executable is available through the Codex runtime path if normal `git` is not on PATH.

