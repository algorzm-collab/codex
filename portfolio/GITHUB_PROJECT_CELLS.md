# GitHub Project Cell Operating Model

## Decision

For 10+ projects, the main operating layer should be GitHub-based Project Cells, not one ChatGPT chat and not many unmanaged ChatGPT threads.

ChatGPT remains the CTO and orchestrator.

GitHub becomes the project communication and evidence backbone.

Codex executes micro tasks from GitHub issues.

A web view can summarize the portfolio, but GitHub remains the source of truth.

---

## Structure

Each project gets one long-lived GitHub issue called a Project Cell.

A Project Cell stores:

- objective
- current status
- active mission
- next action
- linked repo or workspace
- Codex micro tasks
- evidence links
- open questions
- CEO decision needs

---

## Why Issues Instead Of One Chat

A GitHub issue provides:

- stable URL
- comments as timeline
- labels
- assignees
- links to commits and PRs
- API access
- cross-agent continuity
- compatibility with Codex and future runners

Chat is useful for thinking.

GitHub issues are better for operational memory.

---

## Project Cell Naming

Use this format:

```text
[Project Cell] <project name>
```

Examples:

- [Project Cell] G2B자동화
- [Project Cell] 장표머신
- [Project Cell] 개인 브랜딩 콘텐츠 구축

---

## Daily CEO Workflow

CEO says in ChatGPT:

```text
포트폴리오 브리핑.
```

CTO reads Project Cells and reports:

- top 3 priorities
- blocked projects
- CEO decisions needed
- Codex micro tasks ready

---

## Codex Workflow

Codex receives only a micro-task issue, not the entire project cell.

Project Cell = strategy and state.

Micro Task Issue = execution unit.

---

## Web View

A portfolio web view should read the registry and project cell metadata.

It is a visualization layer, not the source of truth.

---

## Golden Rule

If the same project status cannot be recovered from GitHub, the system is not reliable enough.
