# Mission Compiler v1

## Purpose

Mission Compiler converts CEO intent into small, executable tasks that minimize Codex usage and preserve continuity across agents.

The goal is not to use Codex more.

The goal is to make each Codex run short, focused, and high-leverage.

---

## Core Flow

```text
CEO intent
  ↓
Mission
  ↓
Epic
  ↓
Feature
  ↓
Task
  ↓
Micro Task
  ↓
Agent Prompt
  ↓
Commit / PR / Issue Update
```

---

## Codex Usage Policy

Codex is the primary implementation engine, but not the primary thinking engine.

Codex should receive micro tasks, not broad strategy prompts.

Do not ask Codex to:

- audit the entire repository unless explicitly needed
- redesign the full architecture in one run
- read every document for a small task
- combine research, planning, implementation, review, and PR creation in one prompt
- continue large work past shift warning thresholds

Ask Codex to:

- change one file or one small group of files
- implement one bounded feature
- fix one bug
- add one test
- produce one focused commit
- update `.handoff/latest.yml` before interruption

---

## Micro Task Definition

A micro task should fit within 5-10 minutes of agent execution.

A good micro task has:

- one objective
- clear files or scope
- clear success criteria
- no strategic ambiguity
- no production deployment
- no sensitive access
- a defined stop condition

---

## Micro Task Prompt Template

```text
Task type: MICRO TASK

Objective:
[one specific outcome]

Scope:
[files / folders / issue]

Read only:
[list only the minimum files needed]

Do not:
- audit the whole repository
- redesign architecture
- touch unrelated files
- start a second task

Success criteria:
- [criterion 1]
- [criterion 2]

Stop after:
- one focused commit, or
- a concise report if no change is needed

If approaching limits:
- update .handoff/latest.yml
- stop large work
```

---

## CEO Output

The CEO should see:

- current mission
- status
- next action
- approval needed or not
- owner agent

The CEO should not see prompt engineering details unless requested.

---

## Golden Rule

Large thinking belongs to the CTO layer.

Short execution belongs to Codex.
