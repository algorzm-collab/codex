# Codex Dispatch Layer

## Correction

The CEO must not inspect Codex rooms.

A design that requires the CEO to open many Codex sessions is not acceptable.

## Target Model

```text
CEO command in ChatGPT
  -> ChatGPT creates/updates GitHub issue
  -> Dispatch Layer sends executable work to Codex
  -> Codex writes result back to GitHub
  -> ChatGPT reads GitHub and renders Portfolio Cockpit
```

## Current Gap

ChatGPT can create and read GitHub issues.

ChatGPT cannot directly invoke a Codex execution session from this connector alone.

Therefore the missing component is a dispatch layer.

## Dispatch Options

Evaluate in this order:

1. Codex GitHub integration or GitHub Action
2. Codex non-interactive mode
3. Codex SDK
4. Local or hosted runner that watches GitHub issues

## CEO Rule

The CEO gives intent only.

The CEO should never manage Codex rooms, branches, or session state.

## Completion Criteria

The system is acceptable only when:

- a micro task can be created in GitHub
- the task can be picked up by a runner or integration
- the result is written back to GitHub
- Portfolio Cockpit updates from GitHub evidence
- CEO does not inspect Codex rooms
