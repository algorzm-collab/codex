from __future__ import annotations

from .executors import ExecutionResult, Executor
from .models import AgentType, MicroTask


class HermesExecutor(Executor):
    """Local worker stub for deterministic hands-and-feet tasks."""

    agent_type = AgentType.HERMES

    def run(self, task: MicroTask) -> ExecutionResult:
        return ExecutionResult(
            agent=self.agent_type,
            summary=f"Hermes prepared local task: {task.title}",
            next_step="connect safe local command adapter after policy review",
            needs_review=True,
        )
