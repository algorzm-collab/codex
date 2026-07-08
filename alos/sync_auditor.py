from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from .portfolio_loader import PortfolioLoader


@dataclass
class SyncCheck:
    name: str
    passed: bool
    note: str


@dataclass
class SyncAuditResult:
    score: int
    checks: list[SyncCheck]

    @property
    def passed(self) -> bool:
        return self.score == 100


class SyncAuditor:
    def __init__(self, root: str | Path = ".") -> None:
        self.root = Path(root)

    def audit(self) -> SyncAuditResult:
        registry = PortfolioLoader().load(str(self.root / "portfolio" / "registry.json"))
        cell_root = self.root / "portfolio" / "project_cells"
        cell_dirs = sorted(path for path in cell_root.iterdir() if path.is_dir()) if cell_root.exists() else []
        cell_docs = [path / "PROJECT_CELL.md" for path in cell_dirs]

        checks = [
            SyncCheck(
                "registry_has_10_projects",
                len(registry.projects) == 10,
                f"registry projects: {len(registry.projects)}",
            ),
            SyncCheck(
                "project_cell_dirs_match_registry",
                len(cell_dirs) == len(registry.projects),
                f"cell dirs: {len(cell_dirs)}, registry projects: {len(registry.projects)}",
            ),
            SyncCheck(
                "every_cell_has_doc",
                bool(cell_docs) and all(path.exists() for path in cell_docs),
                "each Project Cell folder needs PROJECT_CELL.md",
            ),
            SyncCheck(
                "cell_index_exists",
                (cell_root / "README.md").exists(),
                "portfolio/project_cells/README.md should index the cells",
            ),
            SyncCheck(
                "handoff_exists",
                (self.root / ".handoff" / "latest.yml").exists(),
                ".handoff/latest.yml should preserve shift continuity",
            ),
            SyncCheck(
                "human_entrypoints_exist",
                all((self.root / path).exists() for path in ["START_HERE.md", "REPOSITORY_MAP.md"]),
                "START_HERE.md and REPOSITORY_MAP.md should make GitHub readable",
            ),
        ]
        passed_count = sum(1 for check in checks if check.passed)
        score = round(passed_count * 100 / len(checks))
        return SyncAuditResult(score=score, checks=checks)

    def report(self) -> str:
        result = self.audit()
        lines = [f"Sync score: {result.score}%"]
        for check in result.checks:
            marker = "PASS" if check.passed else "FAIL"
            lines.append(f"- {marker} {check.name}: {check.note}")
        return "\n".join(lines)

