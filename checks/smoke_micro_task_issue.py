from alos.micro_task_issue import MicroTaskIssueBuilder

issue = MicroTaskIssueBuilder().build(
    project="Sample",
    project_issue="#99",
    objective="Prepare a short brief",
    scope="Only create a brief.",
    success="Brief includes next action.",
)

assert issue.title.startswith("[Micro Task] Sample")
assert "#99" in issue.body
assert "Prepare a short brief" in issue.body
assert "micro-task" in issue.labels
