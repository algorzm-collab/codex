from alos.project_cell_reporter import ProjectCell, ProjectCellReporter

body = """## Objective
Build a portfolio view.

## Current Status
active

## Progress
42%

## Next Action
Prepare a compact brief.

## CEO Decision Needed
none
"""

cell = ProjectCell(
    number=99,
    title="[Project Cell] Sample",
    url="https://example.com/issues/99",
    body=body,
)

report = ProjectCellReporter().table([cell])

assert "ALGORZM Portfolio Cockpit" in report
assert "Sample" in report
assert "active" in report
assert "42%" in report
assert "없음" in report
assert "#99" in report
