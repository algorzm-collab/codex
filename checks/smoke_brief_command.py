import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from alos.brief_command import is_portfolio_brief_command

assert is_portfolio_brief_command("?ы듃?대━??釉뚮━??")
assert is_portfolio_brief_command("포트폴리오 브리핑")
assert is_portfolio_brief_command("portfolio brief")
assert not is_portfolio_brief_command("?ν몴癒몄떊 ?ㅼ쓬 誘몄뀡")
