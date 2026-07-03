from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .briefing import Briefing
from .site_exporter import SiteExporter


def _count_done(items: list[dict[str, Any]]) -> int:
    return sum(1 for item in items if str(item.get("status", "")).lower() == "done")


def _first_open(items: list[dict[str, Any]]) -> dict[str, Any] | None:
    for item in items:
        if str(item.get("status", "")).lower() != "done":
            return item
    return None


def _issue_number(issue: dict[str, Any]) -> str:
    number = issue.get("number") or issue.get("issue_number")
    return f"#{number}" if number else str(issue.get("issue", ""))


def _issue_status(issue: dict[str, Any]) -> str:
    state = str(issue.get("state", "")).lower()
    title = str(issue.get("title", ""))
    labels = " ".join(
        label.get("name", "") if isinstance(label, dict) else str(label)
        for label in issue.get("labels", [])
    ).lower()

    if "done" in labels or "status: done" in labels:
        return "done"
    if state == "closed":
        return "done"
    if "[micro task]" in title.lower():
        return "ready"
    return "open"


def evidence_from_issues(
    issues: list[dict[str, Any]],
    *,
    headline: str = "GitHub queue cockpit",
    owner: str = "codex_implementer",
) -> dict[str, Any]:
    queue = [
        {
            "issue": _issue_number(issue),
            "title": issue.get("title", ""),
            "status": _issue_status(issue),
        }
        for issue in issues
    ]
    blockers = [
        f"{_issue_number(issue)}: {issue.get('title', '')}"
        for issue in issues
        if "blocked" in str(issue.get("title", "")).lower()
    ]
    return {
        "headline": headline,
        "owner": owner,
        "decision": "continue, but keep read-only",
        "queue": queue,
        "blockers": blockers,
        "failure_lessons": [
            "GitHub issues and pull requests remain the durable source of truth.",
        ],
        "next_prompts": [
            "Run the next ready micro task from GitHub evidence.",
        ],
    }


class GitHubEvidenceDashboard:
    def from_evidence(self, evidence: dict[str, Any]) -> dict[str, object]:
        queue = list(evidence.get("queue", []))
        done = _count_done(queue)
        total = len(queue)
        progress = int(round((done / total) * 100)) if total else 0
        next_item = _first_open(queue)

        blockers = list(evidence.get("blockers", []))
        attention = blockers[0] if blockers else "none"
        next_action = (
            f"Run {next_item.get('issue', 'next issue')}: {next_item.get('title', 'next queued task')}"
            if next_item
            else "Review completed queue and choose the next mission"
        )

        brief = Briefing(
            headline=evidence.get("headline", "GitHub evidence cockpit"),
            progress=progress,
            current_owner=evidence.get("owner", "codex_implementer"),
            next_action=next_action,
            attention_needed=attention,
            critique=evidence.get(
                "critique",
                "Read-only GitHub evidence is available; do not add live control until this stays reliable.",
            ),
        )

        return {
            "brief": brief,
            "decision": evidence.get("decision", "continue, but keep read-only"),
            "failure_lessons": evidence.get("failure_lessons", []),
            "prompts": evidence.get("next_prompts", []),
        }

    def write_site_data(self, evidence_path: str, target_path: str = "site/data.json") -> Path:
        evidence = json.loads(Path(evidence_path).read_text(encoding="utf-8"))
        return SiteExporter().write(self.from_evidence(evidence), target_path)

    def write_site_data_from_issues(self, issues_path: str, target_path: str = "site/data.json") -> Path:
        issues = json.loads(Path(issues_path).read_text(encoding="utf-8"))
        if isinstance(issues, dict):
            issues = issues.get("issues", [])
        return SiteExporter().write(self.from_evidence(evidence_from_issues(list(issues))), target_path)
