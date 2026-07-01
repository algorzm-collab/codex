# Codex Execution Policy

## Role

Codex is an execution worker, not the portfolio manager.

Codex receives micro-task issues only.

## Input

Each micro-task issue should include:

- linked Project Cell
- objective
- scope
- success criteria
- handoff note

## Output

Codex should return:

- files changed
- result
- risk
- next action

## Boundary

Project Cell issues hold long-term project memory.

Micro-task issues hold one execution unit.

Portfolio brief is rendered by ChatGPT from GitHub state.
