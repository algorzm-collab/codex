from __future__ import annotations

from dataclasses import dataclass


@dataclass
class WorkWindow:
    name: str
    max_minutes: int
    broad_scope: bool
    note_required: bool


class WorkWindowPlanner:
    def choose(self, level: int, default_minutes: int = 10) -> WorkWindow:
        if level > 8:
            return WorkWindow("wrapup", 3, False, True)
        if level > 6:
            return WorkWindow("short", min(5, default_minutes), False, False)
        return WorkWindow("normal", default_minutes, True, False)
