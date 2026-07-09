# ORCA Operating Model — Personal CTO System

## Purpose

ORCA is the worktree operating room for Algorzm's personal CTO system.

The goal is not to run many agents. The goal is to turn CEO intent into safe, reviewed, GitHub-durable execution.

## Budget stack

```text
Claude Code subscription: head / architect / reviewer
Codex subscription: implementation executor
Antigravity subscription: optional visual/IDE experiment lane
Local Hermes: local bridge / handoff / message relay
GitHub free: source of truth, issue queue, PRs, CI evidence
ORCA: worktree IDE and orchestration surface
```

## Authority model

```text
CEO intent and final judgment
  -> Claude Code head layer
  -> GitHub task contract
  -> Codex executor worktree
  -> tests / diff / PR
  -> Claude Code review
  -> GitHub durable memory
```

## Role contract

| Layer | Role | Allowed | Forbidden |
|---|---|---|---|
| CEO | intent, priority, final approval | decide business/risk/taste | operate Codex rooms or branch state |
| Claude Code | CTO head | frame problem, decompose, review, write task contracts | finish only in chat without GitHub record |
| Codex | hands | one narrow implementation, tests, commit/PR | architecture redesign, production decision |
| Antigravity | experiment lane | UI/visual/IDE experiments | untracked production mutation |
| Hermes | local bridge | handoff/status relay | hidden decisions not synced to GitHub |
| GitHub | source of truth | issues, PRs, docs, CI, handoffs | replaced by chat memory |
| ORCA | operating room | isolated worktrees, agent sessions, diff review | source of truth replacement |

## Default ORCA settings

Use this for business-critical repos.

```text
General
- Stable update channel
- ORCA CLI enabled

Terminal
- Windows shell: PowerShell
- Import existing Claude/Codex config when prompted

Agents
- Enable first: Claude Code, Codex
- Keep Antigravity/Hermes disabled until their task role is explicit
- Agent permission mode: Manual
- YOLO / permission bypass: only for disposable sandbox repos

GitHub
- GitHub OAuth enabled
- Repository base ref explicit: origin/main or origin/master
- Branch naming: orca/<project>/<task>/<role>
- Worktree naming: <project>-<task>-<role>

Notifications
- Agent completed: on
- Agent needs input: on
- PR check failure: on

Orchestration
- Use one Claude head worktree and one Codex executor worktree by default
- Multi-agent fan-out only for experiments, never for production promotion
```

## Standard work loop

1. CEO gives intent.
2. Claude Code reads repo docs and GitHub state.
3. Claude Code writes one task contract.
4. Codex executes only that task.
5. Codex reports files changed, tests, risk, next action.
6. Claude Code reviews diff and decides merge/redo/hold.
7. GitHub receives durable summary.

## Codex task contract template

```text
Task: <one sentence>
Repo: <owner/repo>
Branch/worktree: orca/<project>/<task>/codex

Read first:
- AGENTS.md
- CLAUDE.md if present
- relevant HANDOFF/NEXT_TASK docs

Scope:
- Allowed files: <list>
- Forbidden files: <list>

Do:
1. <exact implementation>
2. <verification command>
3. <result report>

Do not:
- broaden scope
- refactor unrelated files
- mutate production/live data
- touch secrets/auth/billing
- make release decisions

Completion report:
- status: done / partial / blocked
- files changed
- verification
- risk
- next action
```

## CTO quality bar

A task is not done because an agent says it is done.

Done means:

```text
GitHub has the code/doc change or explicit issue comment.
Verification is recorded.
Risk is stated.
Next action is clear.
CEO did not become a developer/operator.
```

## First pilot policy

Use G2B as the first ORCA pilot.

```text
Goal: reduce skipped-file parsing failures.
Head: Claude Code
Hands: Codex
Output: PR or issue comment with verification
Forbidden: V10 production mutation, V11 promotion, live Sheet schema change
```
