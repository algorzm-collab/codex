from alos.mission_compiler import MissionCompiler
from alos.models import Mission

mission = Mission(title="T", objective="Create a focused task plan")
tasks = MissionCompiler().compile(mission)
assert tasks
