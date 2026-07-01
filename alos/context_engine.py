from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ContextPlan:
    required_files: list[str]
    optional_files: list[str]
    excluded_patterns: list[str]
    rationale: str


class ContextEngine:
    """Selects minimum useful context before execution."""

    DEFAULT_EXCLUDES = [
        ".git/",
        "node_modules/",
        "dist/",
        "build/",
        ".venv/",
        "__pycache__/",
    ]

    def plan(self, objective: str, hints: list[str] | None = None) -> ContextPlan:
        hints = hints or []
        required = [item for item in hints if item]

        if not required:
            required = [
                "README.md",
                "CONSTITUTION.md",
                "ARCHITECTURE.md",
                "AGENTS.md",
            ]

        return ContextPlan(
            required_files=required,
            optional_files=["governance/", "mission-control/"],
            excluded_patterns=self.DEFAULT_EXCLUDES,
            rationale=(
                "Use minimal context first. Expand only if the task cannot be solved "
                "with the selected files."
            ),
        )
