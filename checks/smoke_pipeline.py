from alos.runtime import ALOSRuntime

runtime = ALOSRuntime()
mission = runtime.from_text(
    title="Improve Codex efficiency",
    body="Turn broad work into small executable steps.\n- produce micro tasks\n- emit short prompts",
    source="smoke",
)
plan = runtime.prepare(mission)

assert plan["tasks"]
assert plan["routes"]
assert plan["prompts"]
