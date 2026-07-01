# Cross-Agent Handoff Protocol v1.1

## Purpose

This protocol ensures that work can continue across ChatGPT, Codex, Claude, Gemini, Cursor, Windsurf, or any future agent without depending on one agent's session, context, quota, or local environment.

The operating system is the continuity layer.

Agents are replaceable execution workers.

## Core Principle

Handoff must be bidirectional.

Codex must be able to hand off to ChatGPT.

ChatGPT must be able to hand off to Codex.

Any future agent must be able to continue from the same shared state.

## Shared Source of Truth

Use GitHub as the durable shared source of truth.

Use Google Sheets as the live remote status and approval surface when available.

Agents should not depend on private chat history, local app state, or unsynced local files.

The minimum shared state is:

- repository files
- open issues
- pull requests
- latest commits
- `.handoff/latest.yml` when active
- `continuity/` packets when cross-agent continuation is active
- Mission Control documents

## ChatGPT to Codex Handoff

When ChatGPT advances the system through GitHub commits, planning, architecture review, or continuation notes, Codex should resume by reading:

1. `CONSTITUTION.md`
2. `ARCHITECTURE.md`
3. `AGENTS.md`
4. `governance/`
5. `mission-control/`
6. `interfaces/`
7. active GitHub issue or PR
8. `.handoff/latest.yml` if present
9. relevant `continuity/` return packet if present

Codex should then:

1. restate the objective
2. summarize what changed since the last local session
3. compare ChatGPT output against the AI OS kernel
4. identify the current mission and contract
5. identify the next safe executable task
6. continue only after reconciling local state with GitHub

## Codex to ChatGPT Handoff

When Codex approaches interruption, it should:

1. stop large new work
2. create or update `.handoff/latest.yml` or a `continuity/` packet
3. preserve repository state through commit, branch, issue comment, or PR when possible
4. list remaining tasks
5. identify risks and next recommended action
6. specify the exact ChatGPT task

ChatGPT can then continue from GitHub without requiring the CEO to reconstruct context.

For Codex <-> ChatGPT token reset workflows, use `CONTINUITY_BRIDGE.md` and the templates in `continuity/`.

## Handoff Template

```md
# Handoff

## Mission

## Current State

## Important Context

## Decisions Made

## Open Decisions

## Files / Artifacts

## Verification

## Risks

## Next Action

## Memory Updates
```

## Required Handoff Command for Codex

When reopening Codex after reset, use this instruction:

```text
Read CONSTITUTION.md, ARCHITECTURE.md, AGENTS.md, governance/, mission-control/, interfaces/, the active issue/PR, .handoff/latest.yml if present, and the latest continuity packet if present.

You are resuming from a cross-agent handoff.

First:
1. summarize what changed in GitHub since your last session
2. identify the current mission
3. identify the next safe executable task
4. continue under Shift Management rules

Do not ask the CEO to reconstruct context.
```

## Required Handoff Command for ChatGPT

When Codex is unavailable, the CEO can say:

```text
현재 GitHub 기준으로 이어서 해.
```

ChatGPT should then inspect GitHub state, continue low-risk work directly where possible, and prepare a Codex return packet if implementation should resume in Codex.

## Handoff Quality Standard

A good handoff lets the next agent continue within 3 minutes.

If the next agent cannot continue without asking the CEO basic context questions, the handoff failed.

## Anti-Pattern

Do not rely on chat history as the only handoff mechanism.

## Golden Rule

Never trap mission-critical context inside one agent's private conversation.

If another agent cannot continue from GitHub, the system is not yet agentic enough.

