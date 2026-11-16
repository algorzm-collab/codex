import sys
import json
import urllib.error
import urllib.request
from urllib.parse import urljoin


DEFAULT_BASE_URL = "https://strat.kr/"

CHECKS = [
    ("/", ["caseUniverseGraph", "graphBatchStatus", "v10SearchForm", "/vendor/pretendard-jp.css", "inquiryForm", "evidence-os"]),
    ("/styles.css?v=v10-evidence", [".graph-shell", ".graph-item-case", ".experience-ticker", "Pretendard JP Variable", ".contact-form"]),
    ("/app.js?v=v10-evidence", ["loadExperienceData", "renderKnowledgeGraph", "advanceGraphBatch", "searchAllRecords", "/graph-experience.json", "/api/inquiry"]),
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

    graph_url = urljoin(base_url, "graph-experience.json")
    try:
        status, graph_body = fetch(graph_url)
        graph_data = json.loads(graph_body)
        records = graph_data.get("records", [])
        declared_count = graph_data.get("meta", {}).get("projectCount")
        if status != 200:
            failures.append(f"/graph-experience.json: expected 200, got {status}")
        if declared_count != 169 or len(records) != 169:
            failures.append(
                "/graph-experience.json: expected 169 declared and actual records, "
                f"got declared={declared_count}, actual={len(records)}"
            )
        if any("client" in record or "projectTitle" in record for record in records):
            failures.append("/graph-experience.json: disallowed raw client/title fields found")
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        failures.append(f"/graph-experience.json: validation failed: {exc}")

    inquiry_url = urljoin(base_url, "api/inquiry")
    inquiry_request = urllib.request.Request(
        inquiry_url,
        headers={"User-Agent": "STRATEGY-release-check/1.0"},
    )
    try:
        urllib.request.urlopen(inquiry_request, timeout=10)
        failures.append("/api/inquiry: expected GET to be rejected with 405")
    except urllib.error.HTTPError as exc:
        if exc.code != 405 or exc.headers.get("Allow") != "POST":
            failures.append(
                "/api/inquiry: expected 405 with Allow: POST, "
                f"got {exc.code} with Allow: {exc.headers.get('Allow')}"
            )
    except (urllib.error.URLError, TimeoutError) as exc:
        failures.append(f"/api/inquiry: request failed: {exc}")

    if failures:
        print("FAIL: deployed site smoke check failed")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print(f"OK: deployed site smoke check passed for {base_url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

