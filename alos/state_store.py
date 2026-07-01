from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any


@dataclass
class MissionState:
    title: str
    status: str
    progress: int
    owner: str
    next_step: str
    updated_by: str = "alos"


class StateStore:
    def __init__(self, path: str = ".alos/state.json") -> None:
        self.path = Path(path)

    def save(self, states: list[MissionState]) -> Path:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = [asdict(state) for state in states]
        self.path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        return self.path

    def load(self) -> list[dict[str, Any]]:
        if not self.path.exists():
            return []
        return json.loads(self.path.read_text(encoding="utf-8"))
