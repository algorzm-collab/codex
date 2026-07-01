# Shift Management v1.1

## Purpose

Shift Management prevents AI work from stopping when an agent hits usage limits, context limits, tool limits, availability limits, token exhaustion, or operational interruptions.

AI agents are temporary workers.

The operating system is permanent.

Shifts change.

The mission continues.

## Core Principle

Do not treat agent limits as failure.

Treat them as shift boundaries.

The system must preserve enough context for another agent to continue without forcing the CEO to reconstruct the work.

## Shift Start Protocol

At the start of a shift, the agent must:

1. read the AI OS kernel
2. identify the active mission or request
3. inspect the current repo state
4. read the latest handoff or status record
5. identify open decisions and approvals
6. identify risks, blockers, and stale references
7. decide whether to enter CTO Review Mode or Execution Mode

## Shift States

```text
NORMAL
  -> WARNING
  -> HANDOFF
  -> FROZEN
  -> RECOVERY
  -> NORMAL
```

## NORMAL

The agent can continue regular execution.

Allowed:

- implementation
- research
- refactoring
- test execution
- documentation
- PR preparation

## WARNING

Triggered when an agent approaches a known limit.

Recommended threshold:

- around 80% usage, context, token, or session risk

Behavior:

- reduce task granularity
- avoid starting large new work
- commit smaller units
- begin summarizing current state
- identify the next handoff point

## HANDOFF

Triggered when the agent is close to interruption.

Recommended threshold:

- around 90% usage, context, token, or session risk

Behavior:

- stop starting large implementations
- finish only very small safe tasks
- create or update a handoff package or Continuity Packet
- push or preserve current work state
- list remaining work clearly
- identify next recommended agent

The remaining capacity is used for context compression, not speculative new development.

## FROZEN

Triggered when the agent can no longer continue.

Behavior:

- no new work
- next agent reads the handoff package
- Mission Control routes work to available agent

## RECOVERY

Triggered when the original agent becomes available again.

Behavior:

- read current repository state
- read latest issue / PR / handoff package
- read latest continuity packet if present
- compare with previous assumptions
- continue only after reconciling state

## Shift End Protocol

At the end of meaningful work, the agent must produce:

1. CEO Report
2. CTO Report
3. Developer Report
4. updated mission status
5. updated memory or feedback record when useful learning was created
6. next recommended action

If token/context exhaustion is near, the agent must also produce a Continuity Packet using `mission-control/CONTINUITY_BRIDGE.md`.

## Handoff Package

A handoff package is a compressed context artifact for the next agent.

It should be short, structured, and actionable.

It should not become a permanent knowledge document unless reusable learning exists.

Recommended location:

`.handoff/latest.yml`

When the target agent is ChatGPT or Codex after reset, use the templates in `continuity/`.

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
- memory updates proposed or applied

## Staleness Rules

Treat handoff context as stale when:

- it is older than the current active work
- it conflicts with higher-authority documents
- the CEO has corrected direction since it was written
- repo state differs from the handoff

## Work Granularity Rule

Large missions must be decomposed before execution.

```text
Epic
  -> Feature
  -> Task
  -> Micro-task
  -> Commit / PR
```

Small units make shift changes cheap.

## Mode Decision

Use CTO Review Mode when architecture or operating rules are in question.

Use Execution Mode when the mission contract is clear, reversible, and authorized.

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

## Golden Rule

Use the final 10% of agent capacity to protect continuity, not to gamble on unfinished implementation.

