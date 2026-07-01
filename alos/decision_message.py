from __future__ import annotations

from dataclasses import dataclass


@dataclass
class DecisionMessage:
    decision: str
    recommendation: str
    level: str
    scope: str
    if_yes: str
    if_no: str


class DecisionMessageFormatter:
    def format(self, item: DecisionMessage) -> str:
        return "\n".join(
            [
                "Decision needed",
                "",
                f"Decision: {item.decision}",
                f"Recommendation: {item.recommendation}",
                f"Level: {item.level}",
                f"Scope: {item.scope}",
                f"If yes: {item.if_yes}",
                f"If no: {item.if_no}",
                "Reply: YES / NO / CHANGE",
            ]
        )
