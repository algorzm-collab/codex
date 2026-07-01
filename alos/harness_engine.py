from __future__ import annotations

from .models import HarnessResult, MicroTask


class HarnessEngine:
    """Checks whether a task output is good enough to continue."""

    def evaluate_plan(self, task: MicroTask) -> HarnessResult:
        notes: list[str] = []
        score = 1.0

        if len(task.objective.strip()) < 10:
            notes.append("Objective is too vague.")
            score -= 0.3

        if not task.scope:
            notes.append("Scope is missing.")
            score -= 0.2

        if not task.success_criteria:
            notes.append("Success criteria are missing.")
            score -= 0.3

        if "whole repository" in " ".join(task.scope).lower():
            notes.append("Scope is too broad for a micro task.")
            score -= 0.3

        score = max(0.0, score)
        return HarnessResult(passed=score >= 0.7, score=score, notes=notes)
