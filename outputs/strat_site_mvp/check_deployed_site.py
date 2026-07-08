import sys
import urllib.error
import urllib.request
from urllib.parse import urljoin


DEFAULT_BASE_URL = "https://strat.kr/"

CHECKS = [
    ("/", ["diagnosisDock", "caseRadarCanvas", "site.webmanifest", "v10-evidence", "credential-stack", "case-studies", "method-lab", "evidence-os"]),
    ("/styles.css?v=v10-evidence", [".case-radar", ".diagnosis-dock", ".contact-proof-strip", ".leadership-board", ".case-study-grid", ".evidence-os"]),
    ("/app.js?v=v10-evidence", ["initAwardMotion", "applyRadarLens", "updateDiagnosisDock", "renderCaseStudies", "retrieveSimilarCases"]),
    ("/strategy-v10/strategy_v10_records.jsonl", ["public_projection", "masked-client", "hide_year_by_default"]),
    ("/favicon.svg", ["<svg", "STRATEGY"]),
    ("/site.webmanifest", ['"name"', "STRATEGY"]),
    ("/robots.txt", ["Sitemap: https://strat.kr/sitemap.xml"]),
    ("/sitemap.xml", ["https://strat.kr/", "https://strat.kr/#cases"]),
    ("/404.html", ["페이지를 찾을 수 없습니다", "홈으로 돌아가기"]),
]


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "STRATEGY-release-check/1.0"})
    with urllib.request.urlopen(request, timeout=10) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        body = response.read().decode(charset, errors="replace")
        return response.status, body


def normalize_base(url):
    return url if url.endswith("/") else f"{url}/"


def main():
    base_url = normalize_base(sys.argv[1] if len(sys.argv) > 1 else DEFAULT_BASE_URL)
    failures = []
    for path, markers in CHECKS:
        url = urljoin(base_url, path.lstrip("/"))
        try:
            status, body = fetch(url)
        except (urllib.error.URLError, TimeoutError) as exc:
            failures.append(f"{path}: request failed: {exc}")
            continue
        if status != 200:
            failures.append(f"{path}: expected 200, got {status}")
            continue
        missing = [marker for marker in markers if marker not in body]
        if missing:
            failures.append(f"{path}: missing markers: {', '.join(missing)}")
    if failures:
        print("FAIL: deployed site smoke check failed")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print(f"OK: deployed site smoke check passed for {base_url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

