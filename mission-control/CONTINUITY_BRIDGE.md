# Continuity Bridge
Version: 0.1

## Purpose

Continuity Bridge keeps development moving when one agent, chat, device, token window, or context session becomes unavailable.

The goal is not only backup. The goal is coordinated continuation:

```text
Codex works
  -> token/context limit approaches
  -> handoff packet is written
  -> ChatGPT continues planning/review/development
  -> ChatGPT output is archived
  -> Codex returns after reset
  -> Codex pulls the latest bridge packet
  -> development continues without the CEO reconstructing context
```

## Core Rule

No important work should live only inside one chat.

If a task may span sessions, agents, or token windows, it must produce a Continuity Packet.

## Supported Continuity Paths

| Path | Use Case |
|---|---|
| Codex -> ChatGPT | Codex token/context limit, mobile continuation, planning expansion |
| ChatGPT -> Codex | ChatGPT produced plan/review/spec; Codex implements |
| Codex -> Codex | shift reset, desktop restart, new Codex thread |
| Agent -> GitHub Archive | durable handoff and audit |
| Agent -> Google Sheet | live remote status and approval |

## Continuity Packet

A Continuity Packet must include:

- packet_id
- source_agent
- target_agent
- mission_id
- contract_id
- current objective
- current state
- latest decisions
- files changed or proposed
- artifacts produced
- verification status
- open decisions
- approval requirements
- risks
- exact next action
- expected return path

## Token Exhaustion Protocol

When token/context exhaustion is near:

1. Stop starting new work.
2. Summarize the active mission and contract.
3. Write or update the Continuity Packet.
4. Update Google Sheet live state.
5. Archive the packet in GitHub.
6. Produce CEO / CTO / Developer reports.
7. Tell the next agent exactly where to resume.

## ChatGPT Continuation Protocol

When ChatGPT continues after Codex token exhaustion:

1. Read the Continuity Packet.
2. Read the AI OS kernel.
3. Work in CTO Review Mode unless the contract is already ready.
4. Produce planning, review, specification, or implementation notes.
5. Write a ChatGPT Return Packet.
6. Do not assume Codex has seen the new content until it is archived.

## Codex Return Protocol

When Codex returns after token reset:

1. Read the latest Continuity Packet.
2. Read any ChatGPT Return Packet.
3. Compare ChatGPT output against the AI OS kernel.
4. Pull useful planning/spec changes into Mission Contract or project docs.
5. Continue implementation only after synchronization.

## Remote Operation Rule

Remote operation is valid only when the live status and durable archive agree enough for another agent to continue.

Google Sheets is live state.

GitHub Archive is durable state.

Chat is working memory, not the source of truth.

