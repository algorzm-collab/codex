from __future__ import annotations

import json
from pathlib import Path

from .portfolio import PortfolioRegistry, ProjectRecord, ProjectStatus


class PortfolioLoader:
    def load(self, path: str = "portfolio/registry.json") -> PortfolioRegistry:
        registry = PortfolioRegistry()
        source = Path(path)
        if not source.exists():
            return registry

        data = json.loads(source.read_text(encoding="utf-8"))
        for item in data.get("projects", []):
            registry.add(
                ProjectRecord(
                    name=item.get("name", ""),
                    repo=item.get("repo", ""),
                    objective=item.get("objective", ""),
                    status=ProjectStatus(item.get("status", "idea")),
                    owner=item.get("owner", "chatgpt_cto"),
                    progress=int(item.get("progress", 0)),
                    next_action=item.get("next_action", "define mission"),
                    attention_needed=item.get("attention_needed", "none"),
                    links=item.get("links", []),
                )
            )
        return registry
