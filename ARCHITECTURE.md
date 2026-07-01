# AI Operating System Architecture
Version: 1.2

## Purpose

This document defines the architecture, authority hierarchy, dependency graph, and lifecycle of the Algorzm AI Operating System.

The purpose is to ensure that every AI agent follows the same operating model while remaining independent from any single model, vendor, framework, language, or workflow.

This repository is not a prompt collection.

It is an evolving leverage operating system.

---

# Core Hierarchy

```text
Constitution
      │
      ▼
Architecture
      │
      ▼
Agents
      │
      ▼
Governance
      │
      ▼
Mission Control
      │
      ├── Permission Model
      │
      ├── Shift Management
      │
      └── Handoff Packages
      │
      ▼
Rules
      │
      ▼
Playbooks
      │
      ▼
Skills
      │
      ▼
Projects
      │
      ▼
Memory
      │
      ▼
Feedback
```

Lower layers may influence upper layers only through proposals and validated learning.

Upper layers govern lower layers.

---

# Authority Levels

## Level 0 — Constitution

Authority: ★★★★★

Purpose:
Defines permanent philosophy.

Examples:

- why we exist
- what must never change
- core values
- CEO First
- High Leverage
- Technology Agnostic
- Continuous Evolution

Modified by:
Human approval required.

---

## Level 1 — Architecture

Authority: ★★★★★

Purpose:
Defines the operating system itself.

Includes:

- hierarchy
- dependencies
- lifecycle
- governance
- ownership
- Mission Control position
- Shift Management position

Modified by:
Human approval required.

AI may propose.

---

## Level 2 — Agents

Authority: ★★★★☆

Purpose:
Defines how AI agents behave during real work.

Examples:

- reasoning order
- planning
- coding style
- review behavior
- CEO friction reduction
- leverage-source evaluation
- shift-aware handoff behavior

Modified by:
Human + AI.

Major behavior changes require approval.

---

## Level 3 — Governance

Authority: ★★★★☆

Purpose:
Defines how principles, tools, MCP servers, methods, rules, playbooks, and skills are evaluated and promoted.

Governance prevents random documentation growth and tool lock-in.

---

## Level 4 — Mission Control

Authority: ★★★★☆

Purpose:
Defines how CEO intent becomes structured AI work.

Mission Control handles:

- task intake
- approval routing
- permission boundaries
- issue / PR based coordination
- execution status
- remote-control strategy for agents such as Codex
- shift state tracking
- handoff package generation
- next-agent routing

Mission Control owns continuity.

Agents may pause.

Missions must continue.

---

## Level 5 — Rules

Authority: ★★★★☆

Purpose:
Reusable principles extracted from repeated experience.

Rules should be short, universal, and durable.

Modified by:
AI proposes.

Human or CTO validates.

---

## Level 6 — Playbooks

Authority: ★★★☆☆

Purpose:
Operational workflows.

Examples:

- debugging
- architecture review
- feature planning
- deployment
- consulting
- root cause analysis
- MCP evaluation
- visualization
- presentation creation
- shift handoff

---

## Level 7 — Skills

Authority: ★★★☆☆

Purpose:
Reusable capabilities.

A Skill may include:

- prompts
- templates
- examples
- scripts
- checklists
- evaluation criteria

Skills are stable implementations of playbooks.

---

## Level 8 — Projects

Authority: ★★☆☆☆

Purpose:
Project-specific knowledge.

Projects should never redefine the Constitution.

Projects inherit the operating system.

---

## Level 9 — Memory

Authority: ★★☆☆☆

Purpose:
Long-term accumulated knowledge.

Memory should be distilled.

Never store entire conversations when reusable learning can be absorbed into the system.

---

## Level 10 — Feedback

Authority: ★☆☆☆☆

Purpose:
Raw observations.

Feedback is evidence, not automatically truth.

Feedback should be absorbed into the appropriate layer whenever possible.

Do not create feedback documents when the learning can directly improve Constitution, Architecture, Agents, Governance, Mission Control, Rules, Playbooks, or Skills.

---

# Learning Lifecycle

```text
Raw Feedback
    ↓
Observation
    ↓
Learning
    ↓
System Refactor
    ↓
Candidate Rule
    ↓
Validated Rule
    ↓
Playbook Update
    ↓
Skill Update
    ↓
Agent Update
    ↓
Operating System Evolution
```

---

# Continuity Lifecycle

```text
Mission
    ↓
Agent Execution
    ↓
Limit Risk Detected
    ↓
Shift State Update
    ↓
Handoff Package
    ↓
Next Agent Routing
    ↓
Recovery
    ↓
Mission Continues
```

---

# Decision Flow

Every important task follows this sequence:

1. Understand the real problem.
2. Reduce CEO friction.
3. Expand context.
4. Research existing knowledge.
5. Evaluate tools.
6. Evaluate libraries, SDKs, APIs, and frameworks.
7. Evaluate MCP capability.
8. Evaluate multimodal, dashboard, visualization, presentation, automation, orchestration, and harness/evaluation opportunities when relevant.
9. Compare alternatives.
10. Decide.
11. Implement.
12. Verify.
13. Preserve continuity if approaching a shift boundary.
14. Learn.
15. Improve AI OS.

---

# Governance

Human owns:

- Constitution
- Architecture
- strategic approval

Human + CTO Agent own:

- Agents
- Governance
- Mission Control
- Rules

AI execution agents own proposals for:

- Playbooks
- Skills
- Memory
- Feedback
- task-level improvements
- handoff packages

Human always has veto authority.

---

# Update Policy

Constitution: rare.

Architecture: occasional.

Agents: frequent.

Governance: occasional.

Mission Control: frequent while automation is being built.

Shift Management: frequent while continuity procedures are being tested.

Rules: continuous.

Playbooks: continuous.

Skills: continuous.

Memory: continuous when distilled.

Feedback: only when raw evidence cannot yet be absorbed.

Handoff packages: temporary and overwritten when no longer useful.

---

# Conflict Resolution

Priority order:

1. `CONSTITUTION.md`
2. `ARCHITECTURE.md`
3. `AGENTS.md`
4. `governance/`
5. `mission-control/`
6. `rules/`
7. `playbooks/`
8. `skills/`
9. `projects/`
10. `memory/`
11. `feedback/`

Higher authority always wins.

---

# Repository Refactoring Principle

Do not create documents because they sound useful.

First ask:

1. Can the learning be absorbed into an existing document?
2. Can the existing structure be clarified?
3. Can the principle be generalized?
4. Is a new document truly needed?

Create new documents only when they reduce future confusion, improve execution, or preserve reusable intelligence better than modifying an existing layer.

---

# Design Principle

Never optimize isolated outputs.

Always improve the operating system that produces them.

Every project should make the AI OS more intelligent and higher-leverage than yesterday.
