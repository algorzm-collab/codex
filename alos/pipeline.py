from __future__ import annotations

from .ceo_view import CEOViewExporter
from .gh_reader import GitHubReader
from .models import Mission
from .runtime import ALOSRuntime
from .state_store import MissionState, StateStore


class ALOSPipeline:
    def __init__(self, repo: str = "algorzm-collab/codex") -> None:
        self.repo = repo
        self.reader = GitHubReader(repo)
        self.runtime = ALOSRuntime()
        self.view = CEOViewExporter()
        self.store = StateStore()

    def from_issue(self, number: int) -> dict[str, object]:
        mission = self.reader.mission_from_issue(number)
        return self.run(mission)

    def run(self, mission: Mission) -> dict[str, object]:
        plan = self.runtime.prepare(mission)
        brief = plan["brief"]
        self.store.save([
            MissionState(
                title=brief.headline,
                status="planned",
                progress=brief.progress,
                owner=brief.current_owner,
                next_step=brief.next_action,
            )
        ])
        self.view.write(plan)
        return plan
