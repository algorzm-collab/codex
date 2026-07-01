from __future__ import annotations

from dataclasses import dataclass


@dataclass
class MicroTaskIssueDraft:
    title: str
    body: str
    labels: list[str]


class MicroTaskIssueBuilder:
    def build(
        self,
        project: str,
        project_issue: str,
        objective: str,
        scope: str,
        success: str,
    ) -> MicroTaskIssueDraft:
        title = f"[Micro Task] {project}: {objective[:60]}"
        body = "\n".join(
            [
                "## Project Cell",
                project_issue,
                "",
                "## Objective",
                objective,
                "",
                "## Scope",
                scope,
                "",
                "## Success Criteria",
                success,
                "",
                "## Handoff",
                "Report changed files, result, risk, and next action.",
            ]
        )
        return MicroTaskIssueDraft(title=title, body=body, labels=["micro-task", "portfolio"])
