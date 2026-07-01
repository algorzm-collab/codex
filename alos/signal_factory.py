from __future__ import annotations

from .models import Mission
from .radar import Signal


class SignalMissionFactory:
    def create(self, signal: Signal) -> Mission:
        return Mission(
            title=f"Explore signal: {signal.title}",
            objective=signal.possible_use or signal.why_it_matters or signal.title,
            business_context=signal.why_it_matters,
            success_criteria=["pattern identified", "next small task created"],
            metadata={"source": signal.source.value, "url": signal.url},
        )
