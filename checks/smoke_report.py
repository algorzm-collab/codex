from alos.executive_report import ExecutiveReport
from alos.runtime import ALOSRuntime

runtime = ALOSRuntime()
mission = runtime.from_text("Report check", "Create a short report\n- include next action")
plan = runtime.prepare(mission)
report = ExecutiveReport().render(plan)

assert "ALOS Report" in report
assert "Progress" in report
assert "Next" in report
