from __future__ import annotations


def is_portfolio_brief_command(text: str) -> bool:
    normalized = " ".join((text or "").strip().lower().split())
    return normalized in {
        "?ы듃?대━??釉뚮━??",
        "포트폴리오 브리핑",
        "portfolio brief",
        "portfolio briefing",
        "cockpit",
    }
