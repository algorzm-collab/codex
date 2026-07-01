from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class Surface(str, Enum):
    PROJECT = "chatgpt_project"
    LIBRARY = "library"
    APP = "app"
    CODEX = "codex"
    GITHUB = "github"
    EXTERNAL_DASHBOARD = "external_dashboard"


@dataclass
class SurfaceDecision:
    surface: Surface
    reason: str


class NativeSurfaceRouter:
    def choose(self, work_type: str) -> SurfaceDecision:
        text = work_type.lower()

        if any(word in text for word in ["strategy", "portfolio", "project", "planning"]):
            return SurfaceDecision(Surface.PROJECT, "Use ChatGPT Project as the CEO workspace.")

        if any(word in text for word in ["template", "playbook", "reference", "asset"]):
            return SurfaceDecision(Surface.LIBRARY, "Use Library for reusable assets.")

        if any(word in text for word in ["slides", "sheet", "calendar", "doc", "visualization"]):
            return SurfaceDecision(Surface.APP, "Use native Apps before custom integration.")

        if any(word in text for word in ["code", "bug", "test", "refactor", "implementation"]):
            return SurfaceDecision(Surface.CODEX, "Use Codex for bounded micro execution.")

        if any(word in text for word in ["issue", "pr", "commit", "repo"]):
            return SurfaceDecision(Surface.GITHUB, "Use GitHub as source of truth.")

        return SurfaceDecision(Surface.PROJECT, "Default to ChatGPT Project for CEO-facing work.")
