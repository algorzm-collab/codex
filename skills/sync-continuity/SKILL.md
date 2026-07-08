---
name: sync-continuity
description: Keep Algorzm project memory synchronized across short chats, agent shifts, local files, and GitHub. Use when asked to recover context, raise sync to 100%, update Project Cells, maintain handoff continuity, or learn success/failure patterns from sync work.
---

# Sync Continuity

## Overview

Use this skill to make the repository, not chat history, the durable memory layer.

## Workflow

1. Read `START_HERE.md`, `REPOSITORY_MAP.md`, and `.handoff/latest.yml`.
2. Inspect `portfolio/registry.json` and `portfolio/project_cells/`.
3. Run `python -m checks.smoke_sync_auditor` or use `alos.sync_auditor.SyncAuditor`.
4. Fix only the missing continuity artifact: registry entry, Project Cell folder, `PROJECT_CELL.md`, index, entrypoint, or handoff.
5. Re-run the sync audit until it reports 100%.
6. Record reusable success/failure learning in this skill or the appropriate governance layer.

## Success Pattern

- Stable ASCII folder slugs keep paths reliable even when display names contain Korean or mojibake.
- One `PROJECT_CELL.md` per project is enough for a new agent to continue without chat context.
- A repo-level `START_HERE.md` and `REPOSITORY_MAP.md` reduce GitHub navigation friction.
- `.handoff/latest.yml` captures the live shift state; Project Cells capture durable project state.

## Failure Pattern

- Long chat summaries are not sync.
- Local-only artifacts are not sync until committed or otherwise recoverable from GitHub.
- Moving source code to make hierarchy prettier can break execution; prefer entrypoint maps before structural moves.
- Reporting routine inspection to the CEO wastes context; in Cave Mode, report only outcomes, blockers, approvals, or risk.

## Validation

The sync score is 100 only when all checks in `alos.sync_auditor.SyncAuditor` pass.
