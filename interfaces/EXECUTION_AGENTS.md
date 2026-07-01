# Execution Agents
Version: 0.1

## Purpose

The AI OS must remain useful across current and future agents.

## Agent Contract

Every execution agent should be able to:

- read the AI OS kernel
- accept a Mission Contract
- execute within the permission model
- produce artifacts
- verify work
- update handoff
- propose memory updates

## Agent Types

| Type | Role |
|---|---|
| CTO Agent | architecture, review, planning, tool choice |
| Coding Agent | implementation and tests |
| ChatGPT Continuation Agent | planning, critique, multimodal reasoning, and return packets when Codex context is exhausted |
| Research Agent | evidence gathering and comparison |
| Design Agent | UX, visuals, information architecture |
| Verifier Agent | independent review and failure classification |
| Archivist Agent | memory, handoff, and knowledge promotion |

## Rule

Do not make Codex the architecture. Codex is one execution agent inside the AI OS.
