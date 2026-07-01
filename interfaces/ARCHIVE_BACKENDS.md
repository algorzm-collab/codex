# Archive Backends
Version: 0.1

## Purpose

The AI OS needs durable memory that survives chat sessions and agent changes.

## Archive Contract

Every archive backend should support:

- readable long-term memory
- version history or audit trail
- links to artifacts
- handoff records
- decision records
- portability across agents

## Current Backends

| Backend | Role |
|---|---|
| GitHub repository | canonical durable memory |
| Google Sheets | live operational state |
| Local files | working scratch and generated artifacts |

## Rule

Chat history is not an archive backend.

