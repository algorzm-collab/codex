# AI Operating System Architecture
Version: 1.3

## Purpose

This document defines the architecture, authority hierarchy, dependency graph, and lifecycle of the Algorzm AI Operating System.

The purpose is to ensure that every AI agent follows the same operating model while remaining independent from any single model, vendor, framework, language, or workflow.

This repository is not a prompt collection. It is an evolving leverage operating system.

## Core Hierarchy

```text
Constitution
  -> Architecture
  -> Governance
  -> Agents
  -> Mission Control
  -> Interfaces
  -> Rules
  -> Playbooks
  -> Skills
  -> Projects
  -> Memory
  -> Feedback
```

Lower layers may influence upper layers only through proposals and validated learning.

Upper layers govern lower layers.

## Authority Levels

### Level 0: Constitution

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

### Level 1: Architecture

Purpose:
Defines the operating system itself.

Includes:

- hierarchy
- dependencies
- lifecycle
- governance boundaries
- ownership
- Mission Control position
- Shift Management position
- Continuity Bridge position
- Interface layer position

Modified by:
Human approval required. AI may propose.

### Level 2: Governance

Purpose:
Defines how principles, tools, MCP servers, methods, rules, playbooks, skills, approval routing, and permissions are evaluated and promoted.

Governance prevents random documentation growth, unsafe automation, and tool lock-in.

Includes:

- permission model
- approval routing
- principle promotion
- conflict resolution
- technology evaluation policy

### Level 3: Agents

Purpose:
Defines how AI agents behave during real work.

Examples:

- reasoning order
- planning behavior
- review behavior
- coding behavior
- reporting behavior
- CEO friction reduction
- leverage-source evaluation
- shift-aware handoff behavior

Modified by:
Human + AI. Major behavior changes require approval.

### Level 4: Mission Control

Purpose:
Defines how CEO intent becomes structured AI work.

Mission Control handles:

- task intake
- CTO Review Mode
- Mission Contracts
- approval routing
- permission boundaries
- issue / PR based coordination
- execution status
- remote-control strategy
- Shift Management
- Cross-Agent Handoff
- Continuity Bridge
- ChatGPT Bridge
- Reporting
- handoff package generation
- next-agent routing

Mission Control owns continuity.

Agents may pause.

Missions must continue.

### Level 5: Interfaces

Purpose:
Keeps the AI OS technology-agnostic.

Interfaces define contracts for:

- control surfaces
- execution agents
- approval channels
- archive backends

Interfaces prevent GitHub, Codex, Telegram, Google Sheets, ChatGPT, or any future tool from becoming the architecture itself.

### Level 6: Rules

Purpose:
Reusable principles extracted from repeated experience.

Rules should be short, universal, and durable across projects.

Modified by:
AI proposes. Human or CTO validates when the rule affects broad behavior.

### Level 7: Playbooks

Purpose:
Operational workflows.

Examples:

- architecture review
- debugging
- feature planning
- deployment
- consulting
- root cause analysis
- MCP evaluation
- visualization
- presentation creation
- shift handoff

### Level 8: Skills

Purpose:
Reusable capabilities.

A skill may include:

- instructions
- templates
- examples
- scripts
- checklists
- evaluation criteria

Skills are stable implementations of playbooks.

### Level 9: Projects

Purpose:
Project-specific knowledge.

Projects inherit the AI OS. Projects should never redefine the Constitution.

### Level 10: Memory

Purpose:
Long-term accumulated knowledge.

Examples:

- preferences
- mistakes
- successful patterns
- architecture lessons

Memory should be distilled.

Never store entire conversations when reusable learning can be absorbed into the system.

### Level 11: Feedback

Purpose:
Raw observations and CEO corrections.

Feedback is evidence, not automatically truth.

Feedback should be absorbed into the appropriate layer whenever possible.

Do not create feedback documents when the learning can directly improve Constitution, Architecture, Agents, Governance, Mission Control, Rules, Playbooks, or Skills.

## Dependency Graph

```text
Constitution
  -> Architecture
  -> Governance
  -> Agents
  -> Mission Control
  -> Interfaces
  -> Rules
  -> Playbooks
  -> Skills
  -> Projects
  -> Memory
  -> Feedback
```

No document may contradict a higher layer.

## Learning Lifecycle

```text
Raw Feedback
  -> Observation
  -> Learning
  -> System Refactor
  -> Candidate Rule
  -> Validated Rule
  -> Playbook Update
  -> Skill Update
  -> Agent Update
  -> Operating System Evolution
```

## Mission Lifecycle

```text
CEO Intent
  -> Mission Intake
  -> Mission Contract
  -> Approval Routing
  -> Execution
  -> Verification
  -> Continuity Bridge when context or agent changes
  -> Handoff
  -> Memory Update
  -> AI OS Improvement
```

## Shift Lifecycle

```text
Shift Start
  -> Kernel Sync
  -> CTO Review Mode when needed
  -> Mission Contract
  -> Execution or Review
  -> Verification
  -> Continuity Packet when needed
  -> CEO / CTO / Developer Reports
  -> Cross-Agent Handoff
```

## Continuity Lifecycle

```text
Mission
  -> Agent Execution
  -> Limit Risk Detected
  -> Shift State Update
  -> Handoff Package or Continuity Packet
  -> Next Agent Routing
  -> Recovery
  -> Mission Continues
```

## Decision Flow

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
11. Implement or review.
12. Verify.
13. Preserve continuity if approaching a shift boundary.
14. Learn.
15. Improve AI OS.

## Governance

Human owns:

- Constitution
- final judgment
- major architecture changes
- strategic approval

Human and CTO agent own:

- Architecture
- Governance
- Agents
- Mission Control
- Rules

AI execution agents own proposals for:

- Playbooks
- Skills
- Memory proposals
- Feedback capture
- task-level improvements
- handoff packages

Human always has veto authority.

## Update Policy

| Layer | Update Frequency |
|---|---|
| Constitution | Rare |
| Architecture | Occasional |
| Governance | Occasional |
| Agents | Frequent |
| Mission Control | Frequent while automation is being built |
| Interfaces | As new channels/tools emerge |
| Rules | Continuous |
| Playbooks | Continuous |
| Skills | Continuous |
| Memory | Daily or per meaningful shift |
| Feedback | Every meaningful correction |
| Handoff packages | Temporary and overwritten when no longer useful |

## Conflict Resolution

Priority order:

1. `CONSTITUTION.md`
2. `ARCHITECTURE.md`
3. `governance/`
4. `AGENTS.md`
5. `mission-control/`
6. `interfaces/`
7. `rules/`
8. `playbooks/`
9. `skills/`
10. `projects/`
11. `memory/`
12. `feedback/`

Higher authority always wins.

Human judgment has final veto authority.

## Repository Refactoring Principle

Do not create documents because they sound useful.

First ask:

1. Can the learning be absorbed into an existing document?
2. Can the existing structure be clarified?
3. Can the principle be generalized?
4. Is a new document truly needed?

Create new documents only when they reduce future confusion, improve execution, or preserve reusable intelligence better than modifying an existing layer.

## Design Principle

Never optimize isolated outputs.

Always improve the operating system that produces them.

Every project should make the AI OS more intelligent and higher-leverage than yesterday.

