# STRATEGY Award-Level QA Checklist

Read `RELEASE_STATUS.md` first for the current build label, deploy target, and known limitations.

## Must Verify Visually

- Hero first viewport: canvas, impact frame, command deck, finder panel must feel like a diagnosis system, not a brochure.
- Issue Finder result: result meter should appear after completion and the active diagnosis type should be visually dominant.
- Case Radar: lens buttons should reorder case cards and update the stats panel.
- Proof panels: sticky panels should not overlap incoherently on desktop and should stack cleanly on mobile.
- Contact form: inquiry context notice should reflect the path, especially `case_radar`, `issue_result`, and `flagship_case`.
- Evidence OS: direct / adjacent / indirect tiers should render, and case names should stay masked in cards and constellation labels.

## Desktop Breakpoints

- 1440 x 900
- 1280 x 720
- 1024 x 768

## Mobile Breakpoints

- 430 x 932
- 390 x 844
- 360 x 740

## Known Local QA Baseline

Local browser QA passed for the Evidence OS section at desktop and 390px mobile viewports before deployed-domain upload. Re-run this checklist on `https://strat.kr/` after Cloudflare upload because CDN cache and headers can differ from local static serving.

## Release Gate

Do not publish as final until:

- `check_static_release.py` passes.
- `check_deployed_site.py https://strat.kr/` passes after upload.
- No text overflow in hero, radar lens, result meter, proof cards, and contact form.
- CDN libraries load successfully on the deployed URL.
- If CDN fails, fallback layout remains usable.
- `/api/*` endpoints are confirmed available or replaced by an equivalent worker/API route.
