# Shift Management v1

## Purpose

Shift Management prevents AI work from stopping when an agent hits usage limits, context limits, tool limits, availability limits, or operational interruptions.

AI agents are temporary workers.

The operating system is permanent.

Shifts change.

The mission continues.

---

## Core Principle

Do not treat agent limits as failure.

Treat them as shift boundaries.

The system must preserve enough context for another agent to continue without forcing the CEO to reconstruct the work.

---

## Shift States

```text
NORMAL
  ↓
WARNING
  ↓
HANDOFF
  ↓
FROZEN
  ↓
RECOVERY
  ↓
NORMAL
```

---

## NORMAL

The agent can continue regular execution.

Allowed:

- implementation
- research
- refactoring
- test execution
- documentation
- PR preparation

---

## WARNING

Triggered when an agent approaches a known limit.

Recommended threshold:

- around 80% usage, context, or session risk

Behavior:

- reduce task granularity
- avoid starting large new work
- commit smaller units
- begin summarizing current state
- identify the next handoff point

---

## HANDOFF

Triggered when the agent is close to interruption.

Recommended threshold:

- around 90% usage, context, or session risk

Behavior:

- stop starting large implementations
- finish only very small safe tasks
- create or update a handoff package
- push or preserve current work state
- list remaining work clearly
- identify next recommended agent

The remaining capacity is used for context compression, not speculative new development.

---

## FROZEN

Triggered when the agent can no longer continue.

Behavior:

- no new work
- next agent reads the handoff package
- Mission Control routes work to available agent

---

## RECOVERY

Triggered when the original agent becomes available again.

Behavior:

- read current repository state
- read latest issue / PR / handoff package
- compare with previous assumptions
- continue only after reconciling state

---

## Handoff Package

A handoff package is a compressed context artifact for the next agent.

It should be short, structured, and actionable.

It should not become a permanent knowledge document unless reusable learning exists.

Recommended location:

`.handoff/latest.yml`

The package may be overwritten.

Project-level permanent learning belongs in `memory/`, `rules/`, `playbooks/`, or `skills/` only after distillation.

---

## Handoff Package Must Include

- mission
- current objective
- progress estimate
- completed work
- modified files
- current branch / PR / issue
- decisions made
- rejected options
- risks
- blockers
- next recommended action
- recommended next agent
- approval needs

---

## Work Granularity Rule

Large missions must be decomposed before execution.

```text
Epic
  ↓
Feature
  ↓
Task
  ↓
Micro-task
  ↓
Commit / PR
```

Small units make shift changes cheap.

---

## CEO Visibility

The CEO should see only concise status:

```text
Codex: HANDOFF
Progress: 72%
Next agent: ChatGPT CTO / Claude / Codex after reset
Blocker: none
CEO action: none
```

The CEO should not need to read handoff internals unless a decision is required.

---

## Golden Rule

Use the final 10% of agent capacity to protect continuity, not to gamble on unfinished implementation.
