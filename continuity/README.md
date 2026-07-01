# Continuity Packets

This directory stores handoff packets between Codex, ChatGPT, future agents, and shift resets.

Use it when:

- token/context is running out
- work moves from Codex to ChatGPT
- ChatGPT returns planning/spec content to Codex
- a new agent or thread resumes work
- remote mobile operation needs durable context

## Naming

```text
YYYY-MM-DD_mission-id_source-to-target.md
```

Examples:

- `2026-07-01_m_v02_001_codex-to-chatgpt.md`
- `2026-07-01_m_v02_001_chatgpt-to-codex.md`

