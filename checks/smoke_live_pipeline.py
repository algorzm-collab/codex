from alos.pipeline import ALOSPipeline
from alos.models import Mission

pipeline = ALOSPipeline()
mission = Mission(title="Live pipeline", objective="Create CEO view and mission state")
plan = pipeline.run(mission)

assert plan["brief"].progress >= 0
assert plan["prompts"]
