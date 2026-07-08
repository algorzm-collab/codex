# Repository Map

This map is the human-readable hierarchy for the GitHub repository.

## 0. Entry Points

| Path | Purpose |
| --- | --- |
| `START_HERE.md` | First file for humans and new AI worker shifts. |
| `README.md` | Repository overview and role explanation. |
| `.handoff/latest.yml` | Current shift state and next continuation point. |
| `portfolio/project_cells/README.md` | Index of the 10 project cells. |

## 1. Operating Constitution

These files define authority and behavior.

| Path | Purpose |
| --- | --- |
| `CONSTITUTION.md` | Highest-level mission and principles. |
| `ARCHITECTURE.md` | System hierarchy, authority, and lifecycle. |
| `AGENTS.md` | Runtime instructions for AI workers. |
| `governance/` | How rules, tools, and workflows are evaluated and promoted. |

## 2. Mission Control

These files keep work continuous across short chats, model limits, and agent shifts.

| Path | Purpose |
| --- | --- |
| `mission-control/` | Permission model, shift management, handoff, dispatch, and automation design. |
| `mission-control/SUSTAINABLE_DEVELOPMENT.md` | Token-frugal routing across ChatGPT, Codex, Hermes local, and optional Antigravity. |
| `.handoff/` | Live handoff state for the next worker. |
| `.github/ISSUE_TEMPLATE/` | GitHub issue templates for structured work intake. |
| `.github/workflows/` | Automation scaffolding. |

## 3. Portfolio And Projects

These files turn many ChatGPT Projects into recoverable GitHub/local work units.

| Path | Purpose |
| --- | --- |
| `portfolio/` | Portfolio registry, CEO view, project operating model. |
| `portfolio/project_cells/` | One stable folder per project. |
| `portfolio/project_cells/*/PROJECT_CELL.md` | Objective, status, next action, and continuity notes for each project. |

## 4. Execution Engine

These files are the local implementation of the AI Operating System.

| Path | Purpose |
| --- | --- |
| `alos/` | Python modules for portfolio, mission, context, briefing, dashboard, and orchestration logic. |
| `alos_cli.py` | CLI entrypoint for ALOS. |
| `portfolio_cli.py` | CLI entrypoint for portfolio operations. |
| `checks/` | Smoke checks and validation scripts. |

## 5. Interfaces And Outputs

These files help humans inspect state and artifacts.

| Path | Purpose |
| --- | --- |
| `site/` | Static dashboard/web view prototype. |
| `outputs/` | Generated reports, summaries, and one-off artifacts. |
| `platforms/` | ChatGPT/GitHub/platform-specific operating notes. |
| `orchestra/` | Orchestration and harness model notes. |

## 6. Learning Loop

These files preserve improvements to the operating system.

| Path | Purpose |
| --- | --- |
| `feedback/` | Raw feedback when it has not yet been absorbed elsewhere. |
| `governance/` | Validated rules and operating decisions. |
| `mission-control/` | Reusable execution and continuity workflows. |

## Recommended GitHub Reading Order

```text
START_HERE.md
  -> REPOSITORY_MAP.md
  -> portfolio/project_cells/README.md
  -> relevant PROJECT_CELL.md
  -> .handoff/latest.yml
```

For AI workers:

```text
CONSTITUTION.md
  -> ARCHITECTURE.md
  -> AGENTS.md
  -> .handoff/latest.yml
  -> portfolio/project_cells/README.md
  -> relevant PROJECT_CELL.md
```
