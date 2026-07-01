from __future__ import annotations

from dataclasses import dataclass


@dataclass
class HarnessCheck:
    name: str
    passed: bool
    note: str


@dataclass
class HarnessMatrixResult:
    passed: bool
    score: int
    checks: list[HarnessCheck]


class HarnessMatrix:
    def evaluate(self, item: dict[str, object]) -> HarnessMatrixResult:
        checks = [
            HarnessCheck("context", bool(item.get("context")), "Context should be explicit."),
            HarnessCheck("scope", bool(item.get("scope")), "Scope should be bounded."),
            HarnessCheck("success", bool(item.get("success")), "Success criteria should exist."),
            HarnessCheck("evidence", bool(item.get("evidence")), "Evidence should be attached."),
            HarnessCheck("handoff", bool(item.get("handoff")), "Next agent should be able to continue."),
            HarnessCheck("executive", bool(item.get("executive")), "CEO status should be readable quickly."),
        ]
        passed_count = sum(1 for check in checks if check.passed)
        score = round(passed_count * 100 / len(checks))
        return HarnessMatrixResult(passed=score >= 80, score=score, checks=checks)
