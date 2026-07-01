from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class SourceType(str, Enum):
    GITBAP = "gitbap"
    REDDIT = "reddit"
    GITHUB = "github"
    YOUTUBE = "youtube"
    PAPER = "paper"
    DOCS = "docs"
    OTHER = "other"


@dataclass
class Signal:
    title: str
    source: SourceType
    url: str = ""
    category: str = ""
    why_it_matters: str = ""
    possible_use: str = ""
    risks: list[str] = field(default_factory=list)


@dataclass
class Adaptation:
    copy: str
    adapt: str
    break_assumption: str
    create: str


class LeverageRadar:
    """Turns external signals into adaptation ideas."""

    def assess(self, signal: Signal) -> Adaptation:
        base = signal.possible_use or signal.why_it_matters or signal.title
        return Adaptation(
            copy=f"Identify the working pattern behind: {signal.title}",
            adapt=f"Map the pattern to Algorzm AI OS: {base}",
            break_assumption="Remove tool/vendor-specific assumptions before adopting.",
            create="Convert the adapted pattern into a rule, playbook, skill, or code module.",
        )

    def rank(self, signals: list[Signal]) -> list[Signal]:
        return sorted(signals, key=lambda item: len(item.why_it_matters) + len(item.possible_use), reverse=True)
