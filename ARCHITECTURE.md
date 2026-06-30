# AI Operating System Architecture
Version: 1.0

---

# Purpose

This document defines the architecture, authority hierarchy, dependency graph, and lifecycle of the Algorzm AI Operating System.

The purpose is to ensure that every AI agent (Codex, ChatGPT, Claude, future agents) follows the same operating model.

This repository is not a prompt collection.

It is an evolving operating system.

---

# Core Hierarchy

```
Constitution
      │
      ▼
Architecture
      │
      ▼
Agents
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

Lower layers may influence upper layers only through proposals.

Upper layers govern lower layers.

---

# Authority Levels

## Level 0 — Constitution

Authority:
★★★★★

Purpose:
Defines permanent philosophy.

Examples:

- Why we exist
- What must never change
- Core values

Modified by:
Human only

---

## Level 1 — Architecture

Authority:
★★★★★

Purpose:
Defines the operating system itself.

Includes:

- hierarchy
- dependencies
- lifecycle
- governance
- ownership

Modified by:
Human

AI may propose.

---

## Level 2 — Agents

Authority:
★★★★☆

Purpose:

Defines how AI agents behave.

Examples:

- reasoning order
- planning
- coding style
- review behavior

Modified by:

Human

AI proposals allowed.

---

## Level 3 — Rules

Authority:
★★★★☆

Purpose:

Reusable principles extracted from repeated experience.

Rules should be short.

Rules should be universal.

Rules should survive projects.

Modified by:

AI proposes

Human validates

---

## Level 4 — Playbooks

Authority:
★★★☆☆

Purpose:

Operational workflows.

Examples

Debugging

Architecture Review

Feature Planning

Deployment

Consulting

Root Cause Analysis

Modified by:

AI

Human

---

## Level 5 — Skills

Authority:
★★★☆☆

Purpose:

Reusable capabilities.

A Skill may include

- prompts
- templates
- examples
- scripts
- checklists

Skills are implementations of Playbooks.

---

## Level 6 — Projects

Authority:
★★☆☆☆

Purpose:

Project-specific knowledge.

Projects should never redefine the Constitution.

Projects inherit the operating system.

---

## Level 7 — Memory

Authority:
★★☆☆☆

Purpose:

Long-term accumulated knowledge.

Examples

Preferences

Mistakes

Successful patterns

Architecture lessons

Memory should be distilled.

Never store entire conversations.

---

## Level 8 — Feedback

Authority:
★☆☆☆☆

Purpose:

Raw observations.

Feedback is evidence.

Feedback is never automatically truth.

Feedback becomes learning.

Learning becomes rules.

---

# Dependency Graph

Constitution

↓

Architecture

↓

Agents

↓

Rules

↓

Playbooks

↓

Skills

↓

Projects

↓

Memory

↓

Feedback

No document may contradict a higher level.

---

# Learning Lifecycle

Raw Feedback

↓

Observation

↓

Learning

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

---

# Decision Flow

Every important task follows this sequence.

1. Understand the real problem

↓

2. Expand context

↓

3. Research existing knowledge

↓

4. Evaluate tools

↓

5. Evaluate libraries

↓

6. Compare alternatives

↓

7. Decide

↓

8. Implement

↓

9. Verify

↓

10. Learn

↓

11. Improve AI OS

---

# Governance

Human owns:

- Constitution
- Architecture

Human + AI own:

- Agents
- Rules

AI owns:

- Playbooks
- Skills
- Memory
- Feedback

Human always has veto authority.

---

# Update Policy

Constitution

Rare

Architecture

Occasional

Agents

Frequent

Rules

Continuous

Playbooks

Continuous

Skills

Continuous

Memory

Daily

Feedback

Every meaningful interaction

---

# Conflict Resolution

Priority order

1. Constitution

2. Architecture

3. Agents

4. Rules

5. Playbooks

6. Skills

7. Projects

8. Memory

9. Feedback

Higher authority always wins.

---

# Design Principle

Never optimize isolated outputs.

Always improve the operating system that produces them.

Every project should make the AI OS more intelligent than yesterday.
