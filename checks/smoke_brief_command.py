from alos.brief_command import is_portfolio_brief_command

assert is_portfolio_brief_command("포트폴리오 브리핑")
assert is_portfolio_brief_command("portfolio brief")
assert not is_portfolio_brief_command("장표머신 다음 미션")
