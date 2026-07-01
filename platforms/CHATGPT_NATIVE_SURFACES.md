# ChatGPT Native Surface Strategy

## Purpose

Before building external dashboards, bots, or custom control panels, use the native ChatGPT surfaces as much as possible.

The native surfaces are not just UI.

They are operating layers.

---

## Native Surfaces

### Projects

Use Projects as CEO-facing workspaces.

A ChatGPT Project should represent a real business/project stream, not a temporary task.

Examples:

- G2B자동화
- 장표머신
- 개인 브랜딩 콘텐츠 구축
- D3HR
- Strat.kr
- 신규사업 만들기
- 실시간 주식 커뮤니티

Each Project should contain:

- project goal
- pinned context
- relevant files
- project-specific instructions
- latest status
- links to GitHub repo/issues

---

### Library

Use Library as the reusable knowledge and artifact shelf.

Library should hold:

- reusable prompts
- templates
- reports
- playbooks
- slide/deck patterns
- visual examples
- source materials
- reference files

Library is not the project manager.

Library is the reusable asset shelf.

---

### Apps

Use Apps as capability extensions.

Apps should be evaluated as leverage sources before building custom integrations.

Potential uses:

- documents
- spreadsheets
- slides
- calendars
- task systems
- data tools
- visualization tools
- business workflow tools

Rule:

Use native app capability first when it reduces CEO friction and does not create lock-in risk.

---

### Codex

Use Codex as a focused execution worker.

Codex should not own strategy, portfolio management, or broad architecture by default.

Codex should receive:

- one repo
- one issue
- one micro task
- one expected output
- one stop condition

---

## Operating Model

```text
ChatGPT Project
  ↓
Portfolio Registry
  ↓
GitHub Repo / Issue
  ↓
Codex Micro Task
  ↓
Result / PR / Status
  ↓
ChatGPT Project Summary
```

---

## Project Mapping Rule

ChatGPT Projects and GitHub repositories should be mapped explicitly.

A project may have:

- one ChatGPT Project
- one GitHub repository
- many short-lived branches
- many GitHub issues
- many Codex micro tasks

Do not use a long-lived branch as the project itself.

---

## CEO Experience Rule

The CEO should live primarily in ChatGPT Projects.

GitHub is the execution record.

Codex is the worker.

Library is the reusable asset shelf.

Apps are capability extensions.

External dashboards are added only when native surfaces cannot carry the workflow.
