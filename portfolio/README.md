# Portfolio Operating Layer

This folder defines how ALGORZM manages many projects without relying on one ChatGPT chat.

## Source of Truth

GitHub Project Cell issues are the long-term project rooms.

## First Interface

The first cockpit is text rendered by ChatGPT.

The CEO command is:

```text
포트폴리오 브리핑
```

## Execution

Codex receives only micro-task issues.

## Key Files

- `GITHUB_PROJECT_CELLS.md`
- `TEXT_COCKPIT_PROTOCOL.md`
- `OPERATION_COMMANDS.md`
- `CODEX_EXECUTION_POLICY.md`
- `status_snapshot.md`

## Engine Files

- `alos/project_cell_reporter.py`
- `alos/micro_task_issue.py`
- `alos/brief_command.py`
