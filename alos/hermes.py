from __future__ import annotations

import subprocess
from dataclasses import dataclass
from pathlib import Path

from .executors import ExecutionResult, Executor
from .models import AgentType, MicroTask


@dataclass(frozen=True)
class HermesCommand:
    name: str
    argv: tuple[str, ...]
    cwd: str = "."


class HermesLocalAdapter:
    """Safe local adapter for deterministic, allowlisted commands."""

    COMMANDS: dict[str, HermesCommand] = {
        "sync_audit": HermesCommand("sync_audit", ("python", "-m", "checks.smoke_sync_auditor")),
        "sustainable_smoke": HermesCommand("sustainable_smoke", ("python", "-m", "checks.smoke_sustainable_dev")),
    }

    def __init__(self, root: str | Path = ".") -> None:
        self.root = Path(root).resolve()

    def command_for_task(self, task: MicroTask) -> HermesCommand | None:
        text = f"{task.title} {task.objective}".lower()
        if "sync" in text or "handoff" in text:
            return self.COMMANDS["sync_audit"]
        if "sustainable" in text or "token" in text or "hermes" in text:
            return self.COMMANDS["sustainable_smoke"]
        return None

    def validate(self, command: HermesCommand) -> bool:
        allowed = self.COMMANDS.get(command.name)
        if allowed != command:
            return False
        target = (self.root / command.cwd).resolve()
        return target == self.root or self.root in target.parents

    def run(self, command: HermesCommand, execute: bool = False) -> ExecutionResult:
        if not self.validate(command):
            return ExecutionResult(
                agent=AgentType.HERMES,
                summary=f"Hermes rejected non-allowlisted command: {command.name}",
                next_step="Use a named allowlisted local command.",
                needs_review=True,
            )

        if not execute:
            return ExecutionResult(
                agent=AgentType.HERMES,
                summary=f"Hermes prepared allowlisted command: {' '.join(command.argv)}",
                next_step="Run with execute=True when local execution is approved.",
                needs_review=False,
            )

        completed = subprocess.run(
            command.argv,
            cwd=str((self.root / command.cwd).resolve()),
            capture_output=True,
            check=False,
            text=True,
        )
        return ExecutionResult(
            agent=AgentType.HERMES,
            summary=f"Hermes ran {command.name} with exit code {completed.returncode}",
            next_step=(completed.stdout or completed.stderr or "no output").strip(),
            needs_review=completed.returncode != 0,
        )


class HermesExecutor(Executor):
    """Local worker for deterministic hands-and-feet tasks."""

    agent_type = AgentType.HERMES

    def __init__(self, adapter: HermesLocalAdapter | None = None) -> None:
        self.adapter = adapter or HermesLocalAdapter()

    def run(self, task: MicroTask) -> ExecutionResult:
        command = self.adapter.command_for_task(task)
        if command:
            return self.adapter.run(command, execute=False)

        return ExecutionResult(
            agent=self.agent_type,
            summary=f"Hermes prepared local task: {task.title}",
            next_step="No allowlisted local command matched this task.",
            needs_review=True,
        )
