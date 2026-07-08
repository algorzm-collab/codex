import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "static"


REQUIRED_FILES = [
    "index.html",
    "styles.css",
    "app.js",
    "_headers",
    "_redirects",
    "404.html",
    "favicon.svg",
    "site.webmanifest",
    "robots.txt",
    "sitemap.xml",
    "case-universe.json",
    "strategy-v10/strategy_v10_records.jsonl",
    "strategy-v10/strategy_v10_people.json",
    "strategy-v10/strategy_v10_evidence_layers.json",
    "strategy-v10/strategy_v10_similarity_engine.json",
    "strategy-v10/strategy_v10_rfp_retrieval_schema.json",
    "strategy-v10/strategy_v10_visualization_schema.json",
    "strategy-v10/strategy_v10_forbidden_claims.json",
]

REQUIRED_INDEX_MARKERS = [
    "https://cdn.jsdelivr.net/npm/gsap@3.13.0",
    "https://cdn.jsdelivr.net/npm/lenis@1.3.8",
    "https://cdn.jsdelivr.net/npm/3d-force-graph",
    "/styles.css?v=v10-evidence",
    "/app.js?v=v10-evidence",
    "id=\"diagnosisDock\"",
    "id=\"caseRadarCanvas\"",
    "id=\"caseUniverseGraph\"",
    "id=\"evidence-os\"",
    "id=\"v10SearchForm\"",
    "id=\"v10DirectCases\"",
    "id=\"v10ConstellationCanvas\"",
    "id=\"v10EvidencePyramid\"",
    "application/ld+json",
    "site.webmanifest",
    "favicon.svg",
    "id=\"credential-stack\"",
    "method-lab",
    "Case Universe",
    "Evidence OS v10",
]

REQUIRED_APP_MARKERS = [
    "initAwardMotion",
    "initLenisScroll",
    "initCaseRadar",
    "initCaseUniverse",
    "buildCaseUniverseData",
    "loadCaseUniverseContent",
    "applyRadarLens",
    "buildResultMeter",
    "updateDiagnosisDock",
    "loadStrategyV10Data",
    "retrieveSimilarCases",
    "renderV10EvidenceOS",
    "drawV10Constellation",
    "STRATEGY_EVIDENCE_OS",
    "stripPublicUnsafeText",
]

REQUIRED_CSS_MARKERS = [
    ".case-radar",
    ".case-universe",
    ".case-universe-graph",
    ".radar-lens",
    ".result-meter",
    ".diagnosis-dock",
    ".hero-proof-ticker",
    ".contact-proof-strip",
    ".sr-only",
    ".skip-link",
    ".method-lab",
    ".case-study-grid",
    ".landing-proofline",
    ".evidence-os",
    ".evidence-command",
    ".evidence-tier-grid",
    ".evidence-visual-grid",
    ".evidence-pyramid",
    ".heatmap-grid",
]

PUBLIC_SOURCE_FORBIDDEN_PATTERNS = [
    r"\bRNC\b",
    r"\biOKI\b",
    r"아이오키",
    r"계약금액",
    r"사업금액",
    r"예산증가",
    r"정원증가",
    r"2020/2023",
    r"\?\?\?\?",
    r"/styles\.css\?v=20260708",
    r"/app\.js\?v=20260708",
]
PUBLIC_TEXT_SUFFIXES = {
    ".html",
    ".css",
    ".js",
    ".json",
    ".jsonl",
    ".csv",
    ".xml",
    ".txt",
    ".webmanifest",
    ".svg",
}


def fail(message):
    print(f"FAIL: {message}")
    return 1


def read_text(path):
    return path.read_text(encoding="utf-8")


def check_required_files():
    missing = [name for name in REQUIRED_FILES if not (STATIC / name).exists()]
    if missing:
        return fail(f"missing static files: {', '.join(missing)}")
    return 0


def check_duplicate_ids(index):
    ids = re.findall(r'(?<![-\w])id="([^"]+)"', index)
    duplicates = sorted({item for item in ids if ids.count(item) > 1})
    if duplicates:
      return fail(f"duplicate ids: {', '.join(duplicates)}")
    return 0


def check_markers(label, content, markers):
    missing = [marker for marker in markers if marker not in content]
    if missing:
        return fail(f"{label} missing markers: {', '.join(missing)}")
    return 0


def iter_public_text_files():
    return sorted(path for path in STATIC.rglob("*") if path.is_file() and path.suffix.lower() in PUBLIC_TEXT_SUFFIXES)


def check_public_safety():
    hits = []
    for path in iter_public_text_files():
        content = read_text(path)
        for pattern in PUBLIC_SOURCE_FORBIDDEN_PATTERNS:
            if re.search(pattern, content, flags=re.IGNORECASE):
                hits.append(f"{path.relative_to(STATIC).as_posix()}::{pattern}")
    if hits:
        return fail(f"public source contains forbidden markers: {', '.join(hits)}")
    return 0


def check_v10_records():
    records_path = STATIC / "strategy-v10" / "strategy_v10_records.jsonl"
    try:
        records = [json.loads(line) for line in read_text(records_path).splitlines() if line.strip()]
    except Exception as exc:
        return fail(f"strategy_v10_records.jsonl invalid: {exc}")
    if len(records) < 100:
        return fail("strategy_v10_records.jsonl must contain at least 100 records")
    for item in records:
        for field in ["hide_year_by_default", "hide_amount_by_default", "hide_previous_company_by_default"]:
            if item.get(field) is not True:
                return fail(f"{item.get('record_id', 'unknown')} missing {field}=true")
        if item.get("public_projection") is not True:
            return fail(f"{item.get('record_id', 'unknown')} missing public_projection=true")
        if item.get("public_client_allowed") is not False:
            return fail(f"{item.get('record_id', 'unknown')} must keep public_client_allowed=false")
        if "forbidden_claims" in item:
            return fail(f"{item.get('record_id', 'unknown')} must not expose forbidden_claims in public records")
        item_text = json.dumps(item, ensure_ascii=False)
        if re.search(r"(?:19|20)\d{2}", item_text):
            return fail(f"{item.get('record_id', 'unknown')} exposes a year-like token")
    return 0


def check_manifest():
    try:
        manifest = json.loads(read_text(STATIC / "site.webmanifest"))
    except Exception as exc:
        return fail(f"manifest json invalid: {exc}")
    if manifest.get("name") != "STRATEGY":
        return fail("manifest name must be STRATEGY")
    if manifest.get("theme_color") != "#15171a":
        return fail("manifest theme_color mismatch")
    return 0


def check_sitemap():
    try:
        tree = ET.parse(STATIC / "sitemap.xml")
    except Exception as exc:
        return fail(f"sitemap xml invalid: {exc}")
    text = ET.tostring(tree.getroot(), encoding="unicode")
    for url in ["https://strat.kr/", "https://strat.kr/#finder", "https://strat.kr/#cases", "https://strat.kr/#contact"]:
        if url not in text:
            return fail(f"sitemap missing {url}")
    return 0


def check_headers_and_redirects():
    headers = read_text(STATIC / "_headers")
    redirects = read_text(STATIC / "_redirects")
    for marker in ["X-Content-Type-Options", "/favicon.svg", "/site.webmanifest", "/404.html"]:
        if marker not in headers:
            return fail(f"_headers missing {marker}")
    for marker in ["/contact /#contact", "/cases /#cases", "/finder /#finder"]:
        if marker not in redirects:
            return fail(f"_redirects missing {marker}")
    return 0


def main():
    checks = []
    checks.append(check_required_files())
    index = read_text(STATIC / "index.html")
    app = read_text(STATIC / "app.js")
    css = read_text(STATIC / "styles.css")
    checks.append(check_duplicate_ids(index))
    checks.append(check_markers("index.html", index, REQUIRED_INDEX_MARKERS))
    checks.append(check_markers("app.js", app, REQUIRED_APP_MARKERS))
    checks.append(check_markers("styles.css", css, REQUIRED_CSS_MARKERS))
    checks.append(check_public_safety())
    checks.append(check_v10_records())
    checks.append(check_manifest())
    checks.append(check_sitemap())
    checks.append(check_headers_and_redirects())
    if any(checks):
        return 1
    print("OK: STRATEGY static release checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())

