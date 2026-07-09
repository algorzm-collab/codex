# AI OS Governance
Version 1.1 — 2026-07-09 token diet (238→50줄). Norms unchanged.

How the OS evolves without becoming messy, vendor-locked, or tool-dependent. It must remain useful across Claude Code, Codex, Gemini, and future agents, MCP servers, and workflows.

## Operating model

- CEO: intent, business objectives, problem definition, success criteria, priorities, final judgment. Never forced to manage Git, code structure, or tooling.
- CTO agent (Claude Code): CEO intent → technical direction; OS architecture maintenance; governance proposals; agent workflow design; tool/model/MCP/library evaluation; CEO friction reduction.
- Execution agents (Codex 등): implementation, tests, repository changes, task-level logs, proposed memory updates.
- Role detail and cross-verification rules: governance/ROLES.md (canonical).

## Promotion pipeline — nothing becomes permanent immediately

idea → **candidate** (`rules/CANDIDATES.md`: name, description, why it matters, evidence, validation status) → **validated rule** (`rules/`: short, reusable, tool-agnostic — validated when it repeatedly improves outcomes or prevents repeated failure) → **playbook** (`playbooks/`: when validated rules form a repeatable workflow) → **skill** (`skills/`: when a playbook is stable across projects; portable across AI tools) → **constitution amendment** (rare; foundational, repeatedly validated, durable; CEO approval required).

## Update gates

- AGENTS.md: update when most agents need the same instruction, a validated rule affects everyday behavior, or a recurring failure must be prevented at startup. Minor changes: AI may propose. Major behavior changes: human approval.
- CONSTITUTION.md: AI may propose; CEO approval required.

## Technology evaluation

Never reject for unfamiliarity; never adopt for novelty. Judge on: business value, problem fit, reliability, speed, maintainability, interoperability, cost, security, learning curve, lock-in risk. The best available solution wins; evidence over familiarity.

## Golden rule

Do not make the CEO operate like a developer. The OS absorbs technical complexity and converts CEO intent into high-quality execution.

Layer authority and conflict resolution: see the canonical table in ARCHITECTURE.md.
