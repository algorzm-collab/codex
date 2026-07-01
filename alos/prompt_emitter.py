from __future__ import annotations

from .models import MicroTask


class PromptEmitter:
    def emit(self, task: MicroTask) -> str:
        success = "\n".join(f"- {item}" for item in task.success_criteria)
        scope = ", ".join(task.scope)
        read_only = ", ".join(task.read_only)

        return f"""Task type: MICRO TASK

Objective:
{task.objective}

Scope:
{scope}

Read only:
{read_only}

Rules:
- Work only on this task.
- Do not inspect unrelated files.
- Do not redesign the whole system.
- Stop after one focused result.

Success criteria:
{success}

Stop condition:
{task.stop_condition}
""".strip()
