from __future__ import annotations

from .models import AgentType, MicroTask, RiskLevel, RouteDecision


class AgentRouter:
    """Routes a micro task to the best available worker."""

    def route(self, task: MicroTask, available: set[AgentType] | None = None) -> RouteDecision:
        available = available or {AgentType.CTO, AgentType.CODEX, AgentType.HERMES}

        if task.risk == RiskLevel.HIGH:
            return RouteDecision(
                agent=AgentType.CTO,
                reason="High-risk task requires CTO planning before execution.",
                task=task,
            )

        if task.owner in available:
            return RouteDecision(
                agent=task.owner,
                reason="Preferred owner is available.",
                task=task,
            )

        if AgentType.CODEX in available and task.risk == RiskLevel.LOW:
            return RouteDecision(
                agent=AgentType.CODEX,
                reason="Low-risk implementation task can be handled by Codex.",
                task=task,
            )

        if AgentType.HERMES in available:
            return RouteDecision(
                agent=AgentType.HERMES,
                reason="Local execution worker is available for deterministic tasks.",
                task=task,
            )

        return RouteDecision(
            agent=AgentType.CTO,
            reason="Fallback to CTO for continuity.",
            task=task,
        )
