from alos.hermes import HermesCommand, HermesExecutor, HermesLocalAdapter
from alos.models import AgentType, MicroTask


adapter = HermesLocalAdapter()
sync_command = adapter.COMMANDS["sync_audit"]

assert adapter.validate(sync_command)
assert not adapter.validate(HermesCommand("bad", ("python", "-c", "print(1)")))

task = MicroTask(
    title="Run sync audit",
    objective="Check sync handoff state",
    scope=["alos/", "checks/"],
    read_only=["portfolio/project_cells/README.md"],
    success_criteria=["sync audit is prepared"],
    owner=AgentType.HERMES,
)

result = HermesExecutor(adapter).run(task)
assert result.agent == AgentType.HERMES
assert "checks.smoke_sync_auditor" in result.summary
assert result.needs_review is False
