from __future__ import annotations

import json
import urllib.parse
import urllib.request
from dataclasses import dataclass


@dataclass
class ProjectCell:
    number: int
    title: str
    url: str
    body: str


class ProjectCellReporter:
    def __init__(self, repo: str = "algorzm-collab/codex") -> None:
        self.repo = repo

    def list_cells(self) -> list[ProjectCell]:
        query = urllib.parse.urlencode({"labels": "project-cell", "state": "open", "per_page": "100"})
        url = f"https://api.github.com/repos/{self.repo}/issues?{query}"
        request = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json"})
        with urllib.request.urlopen(request, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))

        return [
            ProjectCell(
                number=item.get("number", 0),
                title=item.get("title", ""),
                url=item.get("html_url", ""),
                body=item.get("body") or "",
            )
            for item in payload
            if "pull_request" not in item
        ]

    def brief(self) -> str:
        cells = self.list_cells()
        lines = ["Portfolio Brief", "", f"Project cells: {len(cells)}", ""]
        for cell in cells:
            lines.append(f"#{cell.number} {cell.title}")
            lines.append(f"{cell.url}")
            lines.append("")
        return "\n".join(lines)
