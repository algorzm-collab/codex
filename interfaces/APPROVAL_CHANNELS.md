# Approval Channels
Version: 0.1

## Purpose

Approval should be routed to the lowest-friction reliable channel available.

## Channel Contract

Every approval channel must support:

- decision summary
- recommendation
- risk level
- approve/reject/defer
- audit trail
- timestamp

## Candidate Channels

| Channel | Strength | Weakness |
|---|---|---|
| Google Sheets | simple, mobile-readable, auditable | slower for push notifications |
| Telegram | fast mobile approval | requires bot/webhook setup |
| GitHub Issues | close to execution | CEO friction if used directly |
| Chat | natural | poor durable audit unless archived |
| Dashboard | high visibility | needs hosting/access |

## Rule

Approval routing is a governance layer, not a UI detail.

