# Mission Control Permission Model v1

## Purpose

This document defines how AI execution agents can operate with enough autonomy to be useful while keeping the CEO, repository, credentials, and production systems safe.

The goal is to remove repeated manual permission prompts by creating a bounded execution environment.

---

## Core Principle

Do not give agents unlimited authority.

Give agents a safe sandbox, clear allowed actions, and strict escalation rules.

---

## Default Allowed Actions

Execution agents may perform these actions without CEO approval when operating inside an approved repository and approved branch:

- read repository files
- create branches
- edit non-sensitive files
- create commits
- open pull requests
- run tests
- run linters
- generate documentation
- create issue comments
- update task status
- propose AI OS improvements

---

## Restricted Actions

Execution agents must not perform these actions without explicit approval:

- push directly to `main`
- deploy to production
- delete repositories
- delete production data
- access secrets beyond the minimum required
- change billing, payment, or account settings
- modify security policies
- modify organization permissions
- run destructive shell commands
- install untrusted dependencies without review
- call external APIs with sensitive data

---

## Approval Gates

CEO approval is required for:

- strategic product direction
- irreversible business decisions
- production deployment
- customer-facing release
- cost-incurring infrastructure changes
- sensitive data access

CTO approval is required for:

- architecture changes
- permission model changes
- new automation runners
- new MCP server access
- new third-party integrations
- major dependency changes

---

## Safe Execution Pattern

```text
Issue
  ↓
Agent branch
  ↓
Implementation
  ↓
Tests / checks
  ↓
Pull Request
  ↓
CTO review
  ↓
CEO approval only when needed
  ↓
Merge
```

Agents should produce PRs, not uncontrolled direct changes.

---

## Secrets Policy

Secrets must be stored only in approved secret managers or GitHub Actions secrets.

Agents may reference secret names but should not print secret values.

Never commit secrets.

---

## MCP Permission Policy

Every MCP server must be classified before use:

### Low Risk

Read-only tools such as documentation search, file search, or public web lookup.

### Medium Risk

Tools that can write to repositories, documents, dashboards, or project management systems.

### High Risk

Tools that can access production systems, customer data, billing, credentials, or external communication channels.

High-risk MCP use requires explicit approval.

---

## Golden Rule

Autonomy must increase leverage, not risk.

If an agent cannot explain why an action is safe, it must ask for approval.
