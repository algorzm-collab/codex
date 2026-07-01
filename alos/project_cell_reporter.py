from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from dataclasses import dataclass


@dataclass
class ProjectCell:
    number: int
    title: str
    url: str
    body: str

    @property
    def name(self) -> str:
        return self.title.replace("[Project Cell]", "").strip()


def _section(body: str, heading: str) -> str:
    pattern = re.compile(rf"^## {re.escape(heading)}\s*$", re.MULTILINE)
    match = pattern.search(body or "")
    if not match:
        return ""
    start = match.end()
    next_heading = re.search(r"^## ", body[start:], re.MULTILINE)
    end = start + next_heading.start() if next_heading else len(body)
    return body[start:end].strip()


def _progress(value: str) -> str:
    text = (value or "0").strip()
    return text if text.endswith("%") else f"{text}%"


def _need(value: str) -> str:
    text = (value or "none").strip().lower()
    return "없음" if text in {"", "none", "no", "없음"} else "필요"


class ProjectCellReporter:
    def __init__(self, repo: str = "algorzm-collab/codex") -> None:
        self.repo = repo

    def list_cells(self) -> list[ProjectCell]:
        query = urllib.parse.urlencode({"labels": "project-cell", "state": "open", "per_page": "100"})
        url = f"https://api.github.com/repos/{self.repo}/issues?{query}"
        request = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json"})
        with urllib.request.urlopen(request, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))

        cells = [
            ProjectCell(
                number=int(item.get("number", 0)),
                title=str(item.get("title", "")),
                url=str(item.get("html_url", "")),
                body=str(item.get("body") or ""),
            )
            for item in payload
            if "pull_request" not in item
        ]
        return sorted(cells, key=lambda item: item.number)

    def records(self, cells: list[ProjectCell] | None = None) -> list[dict[str, str]]:
        source = cells if cells is not None else self.list_cells()
        rows: list[dict[str, str]] = []
        for cell in source:
            rows.append(
                {
                    "project": cell.name,
                    "status": _section(cell.body, "Current Status") or "unknown",
                    "progress": _progress(_section(cell.body, "Progress")),
                    "next": _section(cell.body, "Next Action") or "정의 필요",
                    "ceo": _need(_section(cell.body, "CEO Decision Needed")),
                    "issue": f"#{cell.number}",
                    "url": cell.url,
                }
            )
        return rows

    def table(self, cells: list[ProjectCell] | None = None) -> str:
        rows = self.records(cells)
        lines = [
            "ALGORZM Portfolio Cockpit",
            "",
            "프로젝트 | 상태 | 진행률 | 다음 액션 | CEO 필요 | Issue",
            "---|---|---:|---|---|---",
        ]
        for row in rows:
            lines.append(
                f"{row['project']} | {row['status']} | {row['progress']} | {row['next']} | {row['ceo']} | {row['issue']}"
            )
        return "\n".join(lines)

    def brief(self) -> str:
        return self.table()
