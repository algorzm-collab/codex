from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class MissionStatus(str, Enum):
    BACKLOG = "backlog"
    PLANNING = "planning"
    READY = "ready"
    RUNNING = "running"
    HANDOFF = "handoff"
    REVIEW = "review"
    DONE = "done"


class AgentType(str, Enum):
    CTO = "chatgpt_cto"
    CODEX = "codex"
    CLAUDE = "claude"
    GEMINI = "gemini"
    HERMES = "hermes_local"
    ANTIGRAVITY = "antigravity"
    HUMAN = "human"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


@dataclass
class Budget:
    max_minutes: int = 10
    max_context_percent: int = 25
    max_cost_units: int = 1


@dataclass
class Mission:
    title: str
    objective: str
    business_context: str = ""
    success_criteria: list[str] = field(default_factory=list)
    constraints: list[str] = field(default_factory=list)
    status: MissionStatus = MissionStatus.BACKLOG
    risk: RiskLevel = RiskLevel.LOW
    budget: Budget = field(default_factory=Budget)
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class MicroTask:
    title: str
    objective: str
    scope: list[str]
    read_only: list[str]
    success_criteria: list[str]
    owner: AgentType
    stop_condition: str = "one focused commit or concise report"
    risk: RiskLevel = RiskLevel.LOW


@dataclass
class HarnessResult:
    passed: bool
    score: float
    notes: list[str] = field(default_factory=list)


@dataclass
class RouteDecision:
    agent: AgentType
    reason: str
    task: MicroTask
