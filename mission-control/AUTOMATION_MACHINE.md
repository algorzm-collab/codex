# Mission Control Automation Machine v1

## Purpose

Mission Control is the CEO-facing automation layer for controlling AI execution agents such as Codex without forcing the CEO to operate like a developer.

The CEO should issue intent. The system should translate that intent into structured work.

---

## Core Flow

```text
CEO intent
  ↓
Mission Control intake
  ↓
Structured task
  ↓
GitHub Issue
  ↓
Execution agent assignment
  ↓
Implementation / research / design
  ↓
Commit or Pull Request
  ↓
CTO review
  ↓
CEO approval only when needed
  ↓
AI OS update
```

---

## CEO Interface

The CEO should eventually interact through one or more low-friction interfaces:

- Telegram
- mobile dashboard
- Airtable / Notion-style dashboard
- simple web app
- voice or multimodal input

The CEO should not need to manage:

- branches
- commits
- pull requests
- repository structure
- development tooling
- CI details
- agent implementation details

---

## v1 Control Surface

The first reliable control surface is GitHub Issues.

GitHub Issues are the first internal structured work object, not the only CEO interface.

CEO intent may arrive through chat, Telegram, Google Sheets, dashboard, voice, images, documents, or future multimodal systems. Mission Control should translate any reliable input surface into the same Mission Contract.

Mission Control converts CEO intent into a structured GitHub Issue with:

- objective
- business context
- success criteria
- constraints
- target agent
- required context
- approval requirements
- expected deliverable

See `MISSION_CONTRACT.md` for the canonical mission and contract fields.

---

## Agentic Execution Policy

Execution agents must not behave as shallow task runners.

Before acting, they must:

1. read the AI OS kernel
2. restate the objective
3. identify missing context
4. evaluate relevant tools, MCP servers, libraries, and existing solutions
5. propose the execution path
6. implement or research
7. verify
8. summarize results
9. propose AI OS updates if reusable learning was created

---

## Remote Codex Control Strategy

Do not remote-control a desktop app directly unless necessary.

Use repository-native control:

1. Mission Control creates structured work.
2. Codex opens the repository and reads the issue/task.
3. Codex executes against the repository.
4. Output lands in GitHub as commit, branch, issue comment, or pull request.
5. CTO reviews.
6. CEO approves only high-impact decisions.

This is more stable than trying to drive UI state in Codex Desktop.

---

## Automation Levels

### Level 0 — Manual
CEO writes instruction directly to an AI.

### Level 1 — Structured Intake
CEO instruction becomes a structured GitHub Issue.

### Level 2 — Agent Routing
System selects whether the task should go to Codex, ChatGPT, Claude, or another agent.

### Level 3 — Execution Tracking
System tracks status, blockers, and required approvals.

### Level 4 — Automated Review
CTO agent reviews output before CEO sees it.

### Level 5 — Closed Loop Learning
Useful lessons are absorbed into the AI OS.

---

## v1 Implementation Target

Build Level 1 first.

The immediate goal is not full autonomy.

The immediate goal is to remove CEO friction and standardize AI work intake.

---

## Golden Rule

The CEO should never need to ask: where do I put this instruction?

Mission Control should accept intent anywhere and turn it into structured work.
