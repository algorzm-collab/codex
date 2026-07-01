from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path
from typing import Any


class CEOViewExporter:
    def to_payload(self, plan: dict[str, object]) -> dict[str, Any]:
        brief = plan.get("brief")
        tasks = plan.get("tasks", [])
        routes = plan.get("routes", [])

        return {
            "brief": asdict(brief) if brief else {},
            "task_count": len(tasks) if isinstance(tasks, list) else 0,
            "route_count": len(routes) if isinstance(routes, list) else 0,
            "next_prompts": plan.get("prompts", []),
        }

    def write(self, plan: dict[str, object], path: str = ".alos/ceo_view.json") -> Path:
        target = Path(path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(self.to_payload(plan), ensure_ascii=False, indent=2), encoding="utf-8")
        return target
