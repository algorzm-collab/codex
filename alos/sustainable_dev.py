from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

from .models import AgentType
from .native_surfaces import Surface


class ContextMode(str, Enum):
    CAVE = "cave"
    NORMAL = "normal"


class WorkKind(str, Enum):
    CEO_INTENT = "ceo_intent"
    LOCAL_DETERMINISTIC = "local_deterministic"
    BOUNDED_CODE = "bounded_code"
    BROWSER_CHATGPT = "browser_chatgpt"
    COMPLEX_IDE = "complex_ide"


@dataclass
class DevelopmentRoute:
    agent: AgentType
    surface: Surface
    context_mode: ContextMode
    reason: str
    ceo_burden: str = "goal only"


@dataclass
class NextWorkReport:
    next_work: str
    expected_tokens: str
    expected_effect: str
    why: str

    def one_line(self) -> str:
        return (
            f"다음작업: {self.next_work} | 예상토큰: {self.expected_tokens} | "
            f"기대효과: {self.expected_effect} | 이유: {self.why}"
        )


class SustainableDevelopmentRouter:
    """Token-frugal routing for CEO-goal-driven development."""

    def route(self, work_kind: WorkKind | str, risk: str = "low") -> DevelopmentRoute:
        kind = WorkKind(work_kind)
        risk_text = risk.lower()

        if risk_text == "high":
            return DevelopmentRoute(
                agent=AgentType.CTO,
                surface=Surface.PROJECT,
                context_mode=ContextMode.CAVE,
                reason="High-risk work needs ChatGPT CTO framing before execution.",
            )

        if kind == WorkKind.CEO_INTENT:
            return DevelopmentRoute(
                agent=AgentType.CTO,
                surface=Surface.PROJECT,
                context_mode=ContextMode.CAVE,
                reason="CEO states goals in browser ChatGPT; the OS translates means.",
            )

        if kind == WorkKind.BROWSER_CHATGPT:
            return DevelopmentRoute(
                agent=AgentType.CTO,
                surface=Surface.PROJECT,
                context_mode=ContextMode.CAVE,
                reason="Browser ChatGPT is the CEO-facing cockpit and renderer.",
            )

        if kind == WorkKind.LOCAL_DETERMINISTIC:
            return DevelopmentRoute(
                agent=AgentType.HERMES,
                surface=Surface.CODEX,
                context_mode=ContextMode.CAVE,
                reason="Hermes local should handle repeatable local execution with minimal tokens.",
            )

        if kind == WorkKind.COMPLEX_IDE:
            return DevelopmentRoute(
                agent=AgentType.ANTIGRAVITY,
                surface=Surface.CODEX,
                context_mode=ContextMode.CAVE,
                reason="Use Antigravity only when an IDE-grade operating surface is worth the overhead.",
            )

        return DevelopmentRoute(
            agent=AgentType.CODEX,
            surface=Surface.CODEX,
            context_mode=ContextMode.CAVE,
            reason="Codex handles bounded implementation tasks from repo state.",
        )


class LeverageBrain:
    """Global brain for token-minimal, high-performance vibe coding."""

    def __init__(self) -> None:
        self.router = SustainableDevelopmentRouter()
        self.reporter = NextWorkReporter()

    def decide(self, work_kind: WorkKind | str, next_work: str, risk: str = "low") -> dict[str, object]:
        route = self.router.route(work_kind, risk=risk)
        token_budget = "~500" if route.context_mode == ContextMode.CAVE else "~1500"
        effect = "max performance with minimal context"
        why = "ChatGPT handles intent, Hermes handles local repeatables, Codex handles bounded code"
        return {
            "route": route,
            "next_report": self.reporter.report(next_work, token_budget, effect, why),
        }


class NextWorkReporter:
    def report(
        self,
        next_work: str,
        expected_tokens: str = "~1k",
        expected_effect: str = "continuity improves",
        why: str = "keeps execution recoverable with low CEO context cost",
    ) -> NextWorkReport:
        return NextWorkReport(
            next_work=next_work,
            expected_tokens=expected_tokens,
            expected_effect=expected_effect,
            why=why,
        )
