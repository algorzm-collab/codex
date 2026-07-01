from __future__ import annotations

from .agent_router import AgentRouter
from .briefing import BriefingBuilder
from .context_engine import ContextEngine
from .executors import DryRunExecutor, ExecutionResult
from .harness_engine import HarnessEngine
from .intake import IntakeConverter, IntakeText
from .mission_compiler import MissionCompiler
from .models import AgentType, Mission
from .prompt_emitter import PromptEmitter


class ALOSRuntime:
    def __init__(self) -> None:
        self.context = ContextEngine()
        self.compiler = MissionCompiler()
        self.router = AgentRouter()
        self.harness = HarnessEngine()
        self.intake = IntakeConverter()
        self.prompts = PromptEmitter()
        self.briefs = BriefingBuilder()

    def from_text(self, title: str, body: str = "", source: str = "") -> Mission:
        return self.intake.convert(IntakeText(title=title, body=body, source=source))

    def prepare(self, mission: Mission) -> dict[str, object]:
        context_plan = self.context.plan(mission.objective, mission.metadata.get("read_only"))
        tasks = self.compiler.compile(mission)
        evaluated = [(task, self.harness.evaluate_plan(task)) for task in tasks]
        routes = [self.router.route(task) for task, result in evaluated if result.passed]
        prompts = [self.prompts.emit(route.task) for route in routes]
        brief = self.briefs.build(mission, tasks)

        return {
            "mission": mission,
            "context_plan": context_plan,
            "tasks": tasks,
            "evaluations": evaluated,
            "routes": routes,
            "prompts": prompts,
            "brief": brief,
        }

    def dry_run(self, mission: Mission) -> list[ExecutionResult]:
        plan = self.prepare(mission)
        results: list[ExecutionResult] = []

        for route in plan["routes"]:  # type: ignore[index]
            executor = DryRunExecutor(route.agent if isinstance(route.agent, AgentType) else AgentType.CTO)
            results.append(executor.run(route.task))

        return results
