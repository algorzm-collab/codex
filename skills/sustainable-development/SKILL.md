---
name: sustainable-development
description: Route CEO goals into token-frugal sustainable development across browser ChatGPT, GitHub/local repo state, Codex, Hermes local, and optional Antigravity. Use when the user asks to conserve tokens, continue across short chats, choose the right execution surface, or keep the CEO focused on goals rather than tooling.
---

# Sustainable Development

## Workflow

1. Treat the CEO message as intent, not implementation instructions.
2. Read repo state and handoff before asking questions.
3. Use Cave Mode unless the CEO asks for explanation.
4. Route work:
   - strategy/status/intake -> browser ChatGPT CTO
   - deterministic local execution -> Hermes local
   - bounded code change -> Codex
   - IDE-grade complex workflow -> Antigravity only when overhead pays back
5. Preserve continuity in `.handoff/latest.yml`, Project Cells, issues, commits, or OS docs.
6. Report only changed files, solved outcome, tests, uncertainty, blockers, or approval needs.
7. When naming the next step, use: `다음작업: <work> | 예상토큰: <budget> | 기대효과: <effect> | 이유: <why>`.

Use `alos.sustainable_dev.LeverageBrain` when code should make this routing decision.

## Success Patterns

- CEO states goals; AI OS chooses means.
- GitHub/local files carry memory; chat is a temporary worker surface.
- Small validated commits beat long context-heavy sessions.
- Hermes local is preferred for repeatable low-risk local operations.
- Hermes local uses allowlisted deterministic commands; it is not a general-purpose shell.

## Failure Patterns

- Asking the CEO to manage tools, branches, or execution details.
- Spending tokens on routine progress narration.
- Keeping critical status only in chat.
- Using Antigravity or custom dashboards before native surfaces and repo state are insufficient.
