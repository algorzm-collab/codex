from __future__ import annotations

from pathlib import Path

from .ceo_view import CEOViewExporter
from .executive_report import ExecutiveReport
from .gh_reader import GitHubReader
from .models import Mission
from .runtime import ALOSRuntime
from .site_exporter import SiteExporter
from .state_store import MissionState, StateStore


class ALOSPipeline:
    def __init__(self, repo: str = "algorzm-collab/codex") -> None:
        self.repo = repo
        self.reader = GitHubReader(repo)
        self.runtime = ALOSRuntime()
        self.view = CEOViewExporter()
        self.site = SiteExporter()
        self.store = StateStore()
        self.report = ExecutiveReport()

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
        self.site.write(plan)
        Path(".alos").mkdir(exist_ok=True)
        Path(".alos/report.txt").write_text(self.report.render(plan), encoding="utf-8")
        return plan
