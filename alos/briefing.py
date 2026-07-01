from __future__ import annotations

from dataclasses import dataclass

from .models import Mission, MicroTask


@dataclass
class Briefing:
    headline: str
    progress: int
    current_owner: str
    next_action: str
    attention_needed: str
    critique: str


class BriefingBuilder:
    def build(self, mission: Mission, tasks: list[MicroTask]) -> Briefing:
        if not tasks:
            return Briefing(
                headline=mission.title,
                progress=0,
                current_owner="cto",
                next_action="create first small task",
                attention_needed="none",
                critique="mission has not been decomposed yet",
            )

        return Briefing(
            headline=mission.title,
            progress=65,
            current_owner=tasks[0].owner.value,
            next_action=tasks[0].objective,
            attention_needed="none",
            critique="engine exists, but live GitHub intake and real local execution are not complete",
        )
