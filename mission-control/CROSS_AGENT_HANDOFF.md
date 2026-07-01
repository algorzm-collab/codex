# Cross-Agent Handoff Protocol v1

## Purpose

This protocol ensures that work can continue across ChatGPT, Codex, Claude, Gemini, or any future agent without depending on one agent's session, context, quota, or local environment.

The operating system is the continuity layer.

Agents are replaceable execution workers.

---

## Core Principle

Handoff must be bidirectional.

Codex must be able to hand off to ChatGPT.

ChatGPT must be able to hand off to Codex.

Any future agent must be able to continue from the same shared state.

---

## Shared Source of Truth

Use GitHub as the shared source of truth.

Agents should not depend on private chat history, local app state, or unsynced local files.

The minimum shared state is:

- repository files
- open issues
- pull requests
- latest commits
- `.handoff/latest.yml` when active
- Mission Control documents

---

## ChatGPT to Codex Handoff

When ChatGPT advances the system through GitHub commits, Codex should resume by reading:

1. `CONSTITUTION.md`
2. `ARCHITECTURE.md`
3. `AGENTS.md`
4. `governance/`
5. `mission-control/`
6. active GitHub issue or PR
7. `.handoff/latest.yml` if present

Codex should then:

1. restate the objective
2. summarize what changed since the last local session
3. identify the next executable task
4. continue only after reconciling local state with GitHub

---

## Codex to ChatGPT Handoff

When Codex approaches interruption, it should:

1. stop large new work
2. create or update `.handoff/latest.yml`
3. preserve repository state through commit, branch, issue comment, or PR
4. list remaining tasks
5. identify risks and next recommended action

ChatGPT can then continue from GitHub without requiring the CEO to reconstruct context.

---

## Required Handoff Command for Codex

When reopening Codex after reset, use this instruction:

```text
Read CONSTITUTION.md, ARCHITECTURE.md, AGENTS.md, governance/, mission-control/, the active issue/PR, and .handoff/latest.yml if present.

You are resuming from a cross-agent handoff.

First:
1. summarize what changed in GitHub since your last session
2. identify the current mission
3. identify the next safe executable task
4. continue under Shift Management rules

Do not ask the CEO to reconstruct context.
```

---

## Required Handoff Command for ChatGPT

When Codex is unavailable, the CEO can say:

```text
현재 GitHub 기준으로 이어서 해.
```

ChatGPT should then inspect GitHub state, continue low-risk work directly where possible, and prepare Codex handoff if implementation should resume in Codex.

---

## Handoff Quality Standard

A good handoff lets the next agent continue within 3 minutes.

If the next agent cannot continue without asking the CEO basic context questions, the handoff failed.

---

## Golden Rule

Never trap mission-critical context inside one agent's private conversation.

If another agent cannot continue from GitHub, the system is not yet agentic enough.
