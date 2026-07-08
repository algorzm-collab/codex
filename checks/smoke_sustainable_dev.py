from alos.models import AgentType
from alos.sustainable_dev import ContextMode, LeverageBrain, NextWorkReporter, SustainableDevelopmentRouter, WorkKind


router = SustainableDevelopmentRouter()

assert router.route(WorkKind.CEO_INTENT).agent == AgentType.CTO
assert router.route(WorkKind.BROWSER_CHATGPT).context_mode == ContextMode.CAVE
assert router.route(WorkKind.LOCAL_DETERMINISTIC).agent == AgentType.HERMES
assert router.route(WorkKind.BOUNDED_CODE).agent == AgentType.CODEX
assert router.route(WorkKind.COMPLEX_IDE).agent == AgentType.ANTIGRAVITY
assert router.route(WorkKind.BOUNDED_CODE, risk="high").agent == AgentType.CTO

line = NextWorkReporter().report(
    next_work="sync GitHub Project Cells",
    expected_tokens="~800",
    expected_effect="handoff friction drops",
    why="repo state should replace chat memory",
).one_line()

assert line.startswith("다음작업:")
assert "예상토큰:" in line
assert "기대효과:" in line
assert "이유:" in line
assert "\n" not in line

decision = LeverageBrain().decide(WorkKind.LOCAL_DETERMINISTIC, "run local sync check")
assert decision["route"].agent == AgentType.HERMES
assert "다음작업:" in decision["next_report"].one_line()
