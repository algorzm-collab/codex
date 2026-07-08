# Sustainable Development Protocol

## Purpose

Make development sustainable under short context windows and usage limits.

The CEO provides goals. The AI OS chooses tools, routes work, preserves state, and reports only material outcomes.

This protocol is the human-readable companion to the Leverage Brain in `alos/sustainable_dev.py`.

## Operating Surfaces

| Surface | Role |
| --- | --- |
| Browser ChatGPT | CEO-facing cockpit, goal intake, strategy, status rendering. |
| GitHub / local repo | Durable memory, source of truth, issues, handoff, artifacts. |
| Codex | Bounded implementation worker. |
| Hermes local | Deterministic local execution worker for repeatable low-risk tasks. |
| Antigravity | Optional IDE-grade surface when the overhead is justified. |

## Routing Rule

| Work | Route |
| --- | --- |
| CEO goal / ambiguous strategy | Browser ChatGPT CTO |
| Local repeatable task | Hermes local |
| Bounded repo implementation | Codex |
| Complex IDE workflow | Antigravity, only if useful |
| High-risk decision | Browser ChatGPT CTO, then approval |

The routing goal is token-minimal maximum performance, not loyalty to any one tool.

Hermes local must use allowlisted deterministic commands by default. It is not a general shell.

## Token Rule

Default to Cave Mode:

- no routine progress narration
- read repo state before asking questions
- use Project Cells and handoff instead of chat memory
- report blockers, approvals, risk, and final outcomes only

When reporting the next step, use one line:

```text
다음작업: <work> | 예상토큰: <budget> | 기대효과: <effect> | 이유: <why>
```

## Continuity Rule

Every execution shift must leave recoverable state in one of:

- `.handoff/latest.yml`
- `portfolio/project_cells/*/PROJECT_CELL.md`
- GitHub issue / PR / commit
- relevant `mission-control/`, `skills/`, or `governance/` document
