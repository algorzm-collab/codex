from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path
from typing import Any


class SiteExporter:
    def to_payload(self, plan: dict[str, object]) -> dict[str, Any]:
        brief = plan.get("brief")
        brief_payload = asdict(brief) if brief else {}
        if "decision" in plan:
            brief_payload["decision"] = plan["decision"]
        return {
            "brief": brief_payload,
            "failure_lessons": plan.get("failure_lessons", []),
            "next_prompts": plan.get("prompts", []),
        }

    def write(self, plan: dict[str, object], path: str = "site/data.json") -> Path:
        target = Path(path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(self.to_payload(plan), ensure_ascii=False, indent=2), encoding="utf-8")
        return target
