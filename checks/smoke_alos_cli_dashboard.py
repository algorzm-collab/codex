from pathlib import Path
import json
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
source = root / "site" / "_cli_issues_smoke.json"
target = root / "site" / "_cli_dashboard_data.json"

issues = [
    {"number": 37, "title": "[Micro Task] G2B MVP definition", "state": "closed"},
    {"number": 38, "title": "[Micro Task] Branding template", "state": "open"},
]

try:
    source.write_text(json.dumps(issues), encoding="utf-8")
    result = subprocess.run(
        [
            sys.executable,
            "alos_cli.py",
            "dashboard-from-issues",
            str(source),
            "--out",
            str(target),
        ],
        cwd=root,
        check=True,
        capture_output=True,
        text=True,
    )
    assert "Wrote dashboard data:" in result.stdout
    data = json.loads(target.read_text(encoding="utf-8"))
    assert data["brief"]["progress"] == 50
    assert data["brief"]["next_action"] == "Run #38: [Micro Task] Branding template"
finally:
    source.unlink(missing_ok=True)
    target.unlink(missing_ok=True)
