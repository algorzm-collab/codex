from pathlib import Path
import json
import sys

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root))

from alos.github_evidence import GitHubEvidenceDashboard, evidence_from_issues


issues = [
    {"number": 37, "title": "[Micro Task] G2B MVP definition", "state": "closed"},
    {"number": 38, "title": "[Micro Task] Branding template", "state": "open", "labels": ["done"]},
    {"number": 39, "title": "[Micro Task] D3HR one-pager", "state": "open"},
    {"number": 99, "title": "Blocked: PR has corrupted Korean text", "state": "open"},
]

evidence = evidence_from_issues(issues)
assert evidence["queue"][0]["status"] == "done"
assert evidence["queue"][1]["status"] == "done"
assert evidence["queue"][2]["status"] == "ready"
assert evidence["blockers"] == ["#99: Blocked: PR has corrupted Korean text"]

source = root / "site" / "_issues_smoke.json"
target = root / "site" / "_issues_data.json"

try:
    source.write_text(json.dumps({"issues": issues}), encoding="utf-8")
    GitHubEvidenceDashboard().write_site_data_from_issues(str(source), str(target))
    data = json.loads(target.read_text(encoding="utf-8"))
    assert data["brief"]["progress"] == 50
    assert data["brief"]["next_action"] == "Run #39: [Micro Task] D3HR one-pager"
    assert data["brief"]["attention_needed"] == "#99: Blocked: PR has corrupted Korean text"
finally:
    source.unlink(missing_ok=True)
    target.unlink(missing_ok=True)
