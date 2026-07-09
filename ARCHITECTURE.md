# AI OS Architecture
Version 1.3 — 2026-07-09 token diet (441→70줄, CEO-directed). Semantics unchanged unless marked.

Defines hierarchy, authority, and lifecycle of the Algorzm AI OS. Upper layers govern lower layers; lower layers influence upper layers only through proposals and validated learning. This repository is not a prompt collection — it is an evolving leverage operating system.

## Layer stack & authority (canonical table — all other docs cite this instead of restating it)

| # | Layer | Purpose | Modified by |
|---|---|---|---|
| 0 | CONSTITUTION.md | permanent philosophy | CEO approval |
| 1 | ARCHITECTURE.md | the OS itself: hierarchy, lifecycle, ownership | CEO approval; AI proposes |
| 2 | AGENTS.md | how agents behave during real work | human+AI; major changes need approval |
| 3 | governance/ | how principles, tools, skills are evaluated and promoted | human+CTO |
| 4 | mission-control/ | CEO intent → structured work: intake, approvals, permissions, shift tracking, handoffs, agent routing, telemetry monitoring | human+CTO; frequent while automation is built |
| 5 | rules/ | short durable principles from repeated experience | AI proposes; CTO/human validates |
| 6 | playbooks/ | operational workflows | continuous |
| 7 | skills/ | stable reusable capabilities (prompts, scripts, templates, checks) | continuous |
| 8 | projects | project-specific knowledge; inherits the OS, never redefines it | per project |
| 9 | memory/ | distilled long-term knowledge — never raw transcripts | continuous when distilled |
| 10 | feedback/ | raw observations; evidence to be absorbed upward, not truth | only when not yet absorbable |

**Conflict resolution: lower layer number wins. Human veto is absolute.**

## Lifecycles

- Learning: raw feedback → observation → learning → candidate rule → validated rule → playbook → skill → agent update → OS evolution.
- Continuity: mission → execution → limit risk detected → shift state → handoff package → next-agent routing → recovery → mission continues. (States and thresholds: AGENTS.md Shift section.)

## Decision flow for important tasks

1 understand the real problem → 2 reduce CEO friction → 3 expand context → 4 research existing knowledge, tools, libraries, MCP, and leverage surfaces (multimodal, dashboards, visualization, automation, orchestration, evaluation) → 5 compare alternatives → 6 decide → 7 implement → 8 verify with evidence → 9 preserve continuity near shift boundaries → 10 learn → 11 improve the OS.

## Ownership

- Human: Constitution, Architecture, strategic approval.
- Human + CTO agent: Agents, Governance, Mission Control, Rules.
- Execution agents: proposals for playbooks, skills, memory, feedback, handoffs, task-level improvements.
- Human always holds veto.

## Document policy

Absorb learning into existing documents first; clarify or generalize existing structure before adding files. Create a new document only when it demonstrably reduces future confusion or preserves reusable intelligence better than modifying an existing layer. Never optimize isolated outputs — improve the operating system that produces them.
