# Control Surfaces
Version: 0.1

## Purpose

Mission Control should not depend on one interface.

CEO intent may arrive through chat, Telegram, dashboard, GitHub Issues, Google Sheets, voice, images, documents, or future multimodal systems.

## Interface Contract

Every control surface should produce a Mission Object.

Minimum fields:

- source
- owner intent
- timestamp
- context links
- urgency
- requested output

## Current Control Surfaces

| Surface | Role |
|---|---|
| Chat | fastest strategic input |
| Google Sheets | remote status and approval board |
| GitHub Issues | structured execution object |
| PC Dashboard | dense monitoring cockpit |
| Telegram | future mobile approval interface |
| ChatGPT | continuation, planning, review, and multimodal reasoning when Codex is unavailable |

## Rule

GitHub Issues can be the internal work object, but the CEO should not be forced to operate GitHub manually.
