# ChatGPT Bridge
Version: 0.1

## Purpose

ChatGPT Bridge defines how ChatGPT participates in the AI OS when Codex is unavailable, context-limited, or better suited for implementation after ChatGPT planning.

## ChatGPT Strengths

Use ChatGPT for:

- planning expansion
- critique
- strategy
- writing briefs
- synthesizing CEO feedback
- preparing Mission Contracts
- reviewing architecture
- multimodal reasoning

## Codex Strengths

Use Codex for:

- repository edits
- local inspection
- tool execution
- tests
- concrete implementation
- file-level verification

## Bridge Contract

ChatGPT output should be archived as one of:

- planning note
- architecture review
- mission contract draft
- implementation specification
- CEO feedback synthesis
- return packet for Codex

## ChatGPT Return Packet Template

```md
# ChatGPT Return Packet

## Source

## Mission / Contract

## What I Changed or Proposed

## Why It Matters

## Files Codex Should Update

## Decisions Needed

## Risks

## Recommended Next Codex Action
```

## Rule

ChatGPT continuation is not informal advice. It must create a structured artifact that Codex can pull into development.

