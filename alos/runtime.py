from __future__ import annotations

from .agent_router import AgentRouter
from .context_engine import ContextEngine
from .executors import DryRunExecutor, ExecutionResult
from .harness_engine import HarnessEngine
from .mission_compiler import MissionCompiler
from .models import AgentType, Mission


class ALOSRuntime:
    """Coordinates mission planning, routing, and dry-run execution."""

    def __init__(self) -> None:
        self.context = ContextEngine()
        self.compiler = MissionCompiler()
        self.router = AgentRouter()
        self.harness = HarnessEngine()

    def prepare(self, mission: Mission) -> dict[str, object]:
        context_plan = self.context.plan(mission.objective, mission.metadata.get("read_only"))
        tasks = self.compiler.compile(mission)
        evaluated = [(task, self.harness.evaluate_plan(task)) for task in tasks]
        routes = [self.router.route(task) for task, result in evaluated if result.passed]

        return {
            "mission": mission,
            "context_plan": context_plan,
            "tasks": tasks,
            "evaluations": evaluated,
            "routes": routes,
        }

    def dry_run(self, mission: Mission) -> list[ExecutionResult]:
        plan = self.prepare(mission)
        results: list[ExecutionResult] = []

        for route in plan["routes"]:  # type: ignore[index]
            executor = DryRunExecutor(route.agent if isinstance(route.agent, AgentType) else AgentType.CTO)
            results.append(executor.run(route.task))

        return results
