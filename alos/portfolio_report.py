from __future__ import annotations

from .portfolio import PortfolioRegistry


class PortfolioReport:
    def render(self, registry: PortfolioRegistry) -> str:
        projects = registry.summary()
        active = [item for item in projects if item["status"] == "active"]
        attention = [item for item in projects if item["attention_needed"] != "none"]

        lines = [
            "Portfolio Report",
            "",
            f"Projects: {len(projects)}",
            f"Active: {len(active)}",
            f"Need attention: {len(attention)}",
            "",
            "Top next actions:",
        ]

        for item in projects[:10]:
            lines.append(
                f"- {item['name']} | {item['status']} | {item['progress']}% | next: {item['next_action']}"
            )

        return "\n".join(lines)
