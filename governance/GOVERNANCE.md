# AI OS Governance
Version: 1.0

---

## Purpose

This document defines how the Algorzm AI Operating System evolves without becoming messy, vendor-locked, or tool-dependent.

The AI OS must remain useful across Codex, ChatGPT, Claude, Gemini, Cursor, Windsurf, future coding agents, future MCP servers, and future development workflows.

---

## CEO / CTO Operating Model

### CEO

The human CEO owns:

- intent
- business objective
- problem definition
- success criteria
- priorities
- final judgment

The CEO should not be forced to manage Git, code structure, development tooling, or implementation details.

### CTO Agent

The CTO agent owns:

- translating CEO intent into technical direction
- maintaining AI OS architecture
- proposing governance changes
- designing agent workflows
- evaluating tools, models, MCP servers, skills, and libraries
- reducing CEO friction

### Execution Agents

Execution agents such as Codex, Claude Code, or other coding tools own:

- implementation
- tests
- repository changes
- task-level feedback logs
- proposed memory updates

---

## Principle Promotion Pipeline

Ideas must not become permanent rules immediately.

Every durable principle follows this path:

```text
Idea
  ↓
Candidate Principle
  ↓
Validated Rule
  ↓
Playbook Update
  ↓
Skill / Agent Update
  ↓
Constitution Amendment, only when truly foundational
```

---

## Candidate Principles

Candidate principles are promising ideas that need validation through real work.

They belong in `rules/CANDIDATES.md`.

A candidate principle should include:

- name
- short description
- why it matters
- evidence from real work
- validation status

---

## Validated Rules

A rule becomes validated when it repeatedly improves outcomes across tasks or prevents repeated failure.

Validated rules belong in `rules/`.

A validated rule should be:

- short
- reusable
- tool-agnostic
- clear enough for any AI agent to follow

---

## Playbook Promotion

When multiple validated rules form a repeatable workflow, create or update a playbook.

Playbooks belong in `playbooks/`.

Examples:

- problem-solving
- debugging
- architecture review
- prompt engineering
- library selection
- MCP evaluation
- AI agent review

---

## Skill Promotion

When a playbook becomes stable enough to reuse across projects, create a skill.

Skills belong in `skills/`.

A skill may include:

- instructions
- templates
- examples
- checklists
- scripts
- evaluation criteria

Skills must remain portable across AI tools whenever possible.

---

## Updating AGENTS.md

`AGENTS.md` may be updated when:

- the same instruction is needed by most agents
- a validated rule affects everyday behavior
- a recurring failure must be prevented at startup
- a new operating pattern becomes standard

Minor updates may be proposed by AI.

Major behavior changes require human approval.

---

## Amending CONSTITUTION.md

`CONSTITUTION.md` changes rarely.

A principle may be promoted to the Constitution only when it is:

- foundational
- stable across tools and projects
- aligned with Algorzm's identity
- repeatedly validated
- unlikely to become obsolete quickly

AI may propose amendments.

Human approval is required.

---

## Technology Evaluation Policy

The AI OS must be flexible, polyglot, and evidence-driven.

Never reject a new tool because it is unfamiliar.

Never adopt a new tool only because it is new.

Evaluate new AI models, coding agents, MCP servers, libraries, frameworks, methodologies, and workflows using:

1. business value
2. problem fit
3. reliability
4. speed
5. maintainability
6. interoperability
7. cost
8. security
9. learning curve
10. lock-in risk

The best available solution wins.

---

## Candidate Principle: Technology-Agnostic Continuous Evolution

The AI OS must not depend on a single model, vendor, tool, programming language, framework, or workflow.

It must continuously evaluate new AI models, MCP servers, libraries, tools, methodologies, and workflows.

Adopt better solutions when they provide measurable advantage.

Evidence wins over familiarity.

Status: Candidate

Next step: validate across real Codex, ChatGPT, and future agent workflows.

---

## Conflict Resolution

When documents conflict, follow this priority:

1. `CONSTITUTION.md`
2. `ARCHITECTURE.md`
3. `AGENTS.md`
4. `governance/GOVERNANCE.md`
5. `rules/`
6. `playbooks/`
7. `skills/`
8. `memory/`
9. `feedback/`

Human judgment has final veto authority.

---

## Golden Rule

Do not make the CEO operate like a developer.

The AI OS exists to absorb technical complexity and convert CEO intent into high-quality execution.
