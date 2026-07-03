from pathlib import Path
import json
import sys

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root))

from alos.github_evidence import GitHubEvidenceDashboard


tmp = root / "site" / "_github_evidence_smoke.json"
target = root / "site" / "_github_evidence_data.json"

evidence = {
    "headline": "GitHub queue cockpit",
    "owner": "codex_implementer",
    "decision": "continue, but keep read-only",
    "queue": [
        {"issue": "#37", "title": "G2B MVP definition", "status": "done"},
        {"issue": "#38", "title": "Branding template", "status": "done"},
        {"issue": "#39", "title": "D3HR one-pager", "status": "ready"},
    ],
    "blockers": ["Do not add approval controls before read-only sync."],
    "failure_lessons": ["GitHub remains source of truth."],
    "next_prompts": ["Run the next ready micro task from GitHub evidence."],
}

try:
    tmp.write_text(json.dumps(evidence, ensure_ascii=False), encoding="utf-8")
    GitHubEvidenceDashboard().write_site_data(str(tmp), str(target))
    data = json.loads(target.read_text(encoding="utf-8"))

    assert data["brief"]["headline"] == "GitHub queue cockpit"
    assert data["brief"]["progress"] == 67
    assert data["brief"]["next_action"] == "Run #39: D3HR one-pager"
    assert data["brief"]["attention_needed"] == "Do not add approval controls before read-only sync."
    assert data["brief"]["decision"] == "continue, but keep read-only"
    assert data["failure_lessons"] == ["GitHub remains source of truth."]
finally:
    tmp.unlink(missing_ok=True)
    target.unlink(missing_ok=True)
