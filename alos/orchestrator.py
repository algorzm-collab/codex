from __future__ import annotations

from dataclasses import dataclass

from .portfolio import PortfolioRegistry, ProjectRecord


@dataclass
class OrchestrationDecision:
    project: str
    next_action: str
    reason: str
    owner: str


class PortfolioOrchestrator:
    def choose_next(self, registry: PortfolioRegistry) -> OrchestrationDecision | None:
        projects = registry.summary()
        if not projects:
            return None

        needs_attention = [p for p in projects if p["attention_needed"] != "none"]
        active = [p for p in projects if p["status"] == "active"]

        if needs_attention:
            item = needs_attention[0]
            return OrchestrationDecision(
                project=str(item["name"]),
                next_action=str(item["next_action"]),
                reason="Project requires attention before execution can continue.",
                owner="chatgpt_cto",
            )

        if active:
            item = sorted(active, key=lambda p: int(p["progress"]))[0]
            return OrchestrationDecision(
                project=str(item["name"]),
                next_action=str(item["next_action"]),
                reason="Active project with lowest progress should move next.",
                owner=str(item.get("owner", "chatgpt_cto")),
            )

        item = projects[0]
        return OrchestrationDecision(
            project=str(item["name"]),
            next_action=str(item["next_action"]),
            reason="Default first project selected.",
            owner=str(item.get("owner", "chatgpt_cto")),
        )
