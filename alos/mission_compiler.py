from __future__ import annotations

from .models import AgentType, MicroTask, Mission


class MissionCompiler:
    """Turns broad CEO intent into bounded micro tasks."""

    def compile(self, mission: Mission) -> list[MicroTask]:
        criteria = mission.success_criteria or ["produce a concise useful output"]

        return [
            MicroTask(
                title=f"Plan: {mission.title}",
                objective=f"Clarify execution plan for: {mission.objective}",
                scope=["mission-control/", "alos/"],
                read_only=["README.md", "CONSTITUTION.md", "ARCHITECTURE.md", "AGENTS.md"],
                success_criteria=["mission is decomposed", "next executable step is clear"],
                owner=AgentType.CTO,
                risk=mission.risk,
            ),
            MicroTask(
                title=f"Execute micro step: {mission.title}",
                objective=mission.objective,
                scope=mission.metadata.get("scope", ["relevant files only"]),
                read_only=mission.metadata.get("read_only", ["minimum relevant files"]),
                success_criteria=criteria,
                owner=mission.metadata.get("preferred_agent", AgentType.CODEX),
                risk=mission.risk,
            ),
        ]

    def codex_prompt(self, task: MicroTask) -> str:
        return "\n".join(
            [
                "Task type: MICRO TASK",
                "",
                f"Objective: {task.objective}",
                f"Scope: {', '.join(task.scope)}",
                f"Read only: {', '.join(task.read_only)}",
                "",
                "Do not audit the whole repository.",
                "Do not redesign architecture.",
                "Do not touch unrelated files.",
                "Do not start a second task.",
                "",
                "Success criteria:",
                *[f"- {item}" for item in task.success_criteria],
                "",
                f"Stop after: {task.stop_condition}.",
            ]
        )
