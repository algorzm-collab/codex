from __future__ import annotations

from dataclasses import asdict


class ExecutiveReport:
    def render(self, plan: dict[str, object]) -> str:
        brief = plan.get("brief")
        data = asdict(brief) if brief else {}
        prompts = plan.get("prompts", [])

        lines = [
            "ALOS Report",
            "",
            f"Headline: {data.get('headline', '-')}",
            f"Progress: {data.get('progress', '-')}%",
            f"Owner: {data.get('current_owner', '-')}",
            f"Next: {data.get('next_action', '-')}",
            f"Attention: {data.get('attention_needed', '-')}",
            "",
            "Critique:",
            data.get("critique", "-"),
            "",
            f"Prepared prompts: {len(prompts) if isinstance(prompts, list) else 0}",
        ]
        return "\n".join(lines)
