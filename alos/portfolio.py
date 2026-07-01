from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class ProjectStatus(str, Enum):
    IDEA = "idea"
    ACTIVE = "active"
    PAUSED = "paused"
    REVIEW = "review"
    DONE = "done"


@dataclass
class ProjectRecord:
    name: str
    repo: str = ""
    objective: str = ""
    status: ProjectStatus = ProjectStatus.IDEA
    owner: str = "chatgpt_cto"
    progress: int = 0
    next_action: str = "define mission"
    attention_needed: str = "none"
    links: list[str] = field(default_factory=list)


class PortfolioRegistry:
    def __init__(self) -> None:
        self.projects: list[ProjectRecord] = []

    def add(self, project: ProjectRecord) -> None:
        self.projects.append(project)

    def active(self) -> list[ProjectRecord]:
        return [item for item in self.projects if item.status == ProjectStatus.ACTIVE]

    def needs_attention(self) -> list[ProjectRecord]:
        return [item for item in self.projects if item.attention_needed != "none"]

    def summary(self) -> list[dict[str, object]]:
        return [
            {
                "name": item.name,
                "repo": item.repo,
                "status": item.status.value,
                "progress": item.progress,
                "next_action": item.next_action,
                "attention_needed": item.attention_needed,
            }
            for item in self.projects
        ]
