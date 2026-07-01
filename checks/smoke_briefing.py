from alos.runtime import ALOSRuntime

runtime = ALOSRuntime()
mission = runtime.from_text(
    title="Build continuity layer",
    body="Turn broad work into an executable mission.\n- create brief\n- create prompts",
    source="smoke",
)
plan = runtime.prepare(mission)

assert plan["brief"].progress >= 0
assert plan["prompts"]
