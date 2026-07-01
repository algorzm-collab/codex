from __future__ import annotations

from dataclasses import dataclass

from .models import Mission


@dataclass
class IntakeText:
    title: str
    body: str = ""
    source: str = ""


class IntakeConverter:
    def convert(self, item: IntakeText) -> Mission:
        lines = [line.strip() for line in item.body.splitlines() if line.strip()]
        objective = lines[0] if lines else item.title
        criteria = [line[2:].strip() for line in lines if line.startswith("- ")]

        return Mission(
            title=item.title,
            objective=objective,
            business_context=item.body,
            success_criteria=criteria,
            metadata={"source": item.source},
        )
