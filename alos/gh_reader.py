from __future__ import annotations

import json
import urllib.request
from dataclasses import dataclass

from .intake import IntakeConverter, IntakeText
from .models import Mission


@dataclass
class RemoteItem:
    title: str
    body: str
    url: str
    number: int
    labels: list[str]


class GitHubReader:
    def __init__(self, repo: str) -> None:
        self.repo = repo
        self.converter = IntakeConverter()

    def read_issue(self, number: int) -> RemoteItem:
        url = f"https://api.github.com/repos/{self.repo}/issues/{number}"
        request = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json"})
        with urllib.request.urlopen(request, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))

        labels = [item.get("name", "") for item in payload.get("labels", [])]
        return RemoteItem(
            title=payload.get("title", ""),
            body=payload.get("body") or "",
            url=payload.get("html_url", url),
            number=payload.get("number", number),
            labels=[label for label in labels if label],
        )

    def mission_from_issue(self, number: int) -> Mission:
        item = self.read_issue(number)
        body = item.body or item.title
        mission = self.converter.convert(IntakeText(title=item.title, body=body, source=item.url))
        mission.metadata["issue_number"] = item.number
        mission.metadata["labels"] = item.labels
        mission.metadata["source_url"] = item.url
        return mission
