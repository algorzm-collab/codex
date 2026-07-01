# Mission Contract
Version: 0.1

## Purpose

A Mission Contract converts CEO intent into executable, verifiable work.

It prevents agents from acting on vague prompts, hidden assumptions, or tool-driven impulses.

## Mission Object

| Field | Meaning |
|---|---|
| mission_id | Stable identifier |
| source | chat, issue, Telegram, dashboard, voice, multimodal input |
| owner_intent | Raw CEO direction |
| problem | The real problem to solve |
| business_context | Why it matters |
| success_criteria | Observable done condition |
| priority | strategic, urgent, normal, low |
| risk_level | 1-5 |
| status | intake, contract_draft, ready, running, verify, done, blocked |

## Contract Object

| Field | Meaning |
|---|---|
| contract_id | Stable identifier |
| mission_id | Linked mission |
| in_scope | What is included |
| out_of_scope | What must not be done |
| inputs | Required files, data, links, credentials, screenshots |
| outputs | Expected artifact or state change |
| acceptance_tests | How the result will be verified |
| approval_required | yes/no and reason |
| memory_update_required | yes/no and destination |
| target_agent | CTO, Codex, research agent, design agent, verifier, other |

## Two-Pass Compiler

### Pass 1: Understanding

The agent extracts:

- objective
- hidden constraints
- missing context
- likely success criteria
- approval risk
- reusable memory implications

### Pass 2: Execution Contract

The agent produces:

- scope
- non-scope
- deliverable
- verification method
- owner decision points
- expected archive update

## Rule

No significant work should enter Execution Mode without a Mission Contract unless the CEO explicitly asks for a quick answer.

