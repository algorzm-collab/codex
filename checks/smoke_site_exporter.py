from pathlib import Path
import json
import sys

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root))

from alos.briefing import Briefing
from alos.site_exporter import SiteExporter


target = root / "site" / "_smoke_data.json"

brief = Briefing(
    headline="Dashboard viability review",
    progress=72,
    current_owner="codex_implementer",
    next_action="Keep read-only evidence sync first.",
    attention_needed="Do not add approval controls yet.",
    critique="Continue, but simplify.",
)

try:
    SiteExporter().write(
        {
            "brief": brief,
            "decision": "continue, but simplify",
            "failure_lessons": [
                "GitHub remains the durable source of truth.",
                "Do not build live control before read-only sync.",
            ],
            "prompts": ["Update site/data.json from GitHub evidence."],
        },
        str(target),
    )

    data = json.loads(target.read_text(encoding="utf-8"))
    assert data["brief"]["decision"] == "continue, but simplify"
    assert data["failure_lessons"][0] == "GitHub remains the durable source of truth."
    assert data["next_prompts"] == ["Update site/data.json from GitHub evidence."]
finally:
    target.unlink(missing_ok=True)
