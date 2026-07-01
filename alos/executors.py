from __future__ import annotations

from dataclasses import dataclass

from .models import AgentType, MicroTask


@dataclass
class ExecutionResult:
    agent: AgentType
    summary: str
    next_step: str
    needs_review: bool = True


class Executor:
    agent_type: AgentType

    def run(self, task: MicroTask) -> ExecutionResult:
        raise NotImplementedError


class DryRunExecutor(Executor):
    def __init__(self, agent_type: AgentType) -> None:
        self.agent_type = agent_type

    def run(self, task: MicroTask) -> ExecutionResult:
        return ExecutionResult(
            agent=self.agent_type,
            summary=f"Prepared execution for: {task.title}",
            next_step="Route to actual worker or create a focused GitHub issue.",
            needs_review=True,
        )
