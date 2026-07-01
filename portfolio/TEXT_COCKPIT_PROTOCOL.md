# Text Cockpit Protocol

## Decision

The first cockpit should be text-first, not web-first.

The CEO can ask ChatGPT for a portfolio brief and receive a compact table.

GitHub remains the source of truth.

ChatGPT renders the current state as a readable cockpit.

---

## Command

```text
포트폴리오 브리핑
```

---

## Output Shape

```text
ALGORZM Portfolio Cockpit

프로젝트 | 상태 | 진행률 | 다음 액션 | CEO 필요
---|---:|---:|---|---
라이브러리 | active | 99% | Codex Issue 검증 | 없음
장표머신 | idea | 0% | 장표 자동화 도구 조사 | 없음
G2B자동화 | idea | 0% | 범위/repo 결정 | 필요
```

---

## Rules

1. Do not make ChatGPT chats the project rooms.
2. Use GitHub Project Cell issues as the project rooms.
3. Use ChatGPT as the CTO renderer and interpreter.
4. Keep the first answer text-only unless a web surface is clearly needed.
5. Use separate micro-task issues for Codex.
6. Show only the fields the CEO needs first.
7. Add detail only when asked.

---

## Why Text First

Text cockpit is faster than a web app.

It works inside the ChatGPT mobile app.

It does not require the CEO to open another system.

It can still be backed by GitHub.

It can later become a web view without changing the operating model.

---

## Escalation

Move from text cockpit to web cockpit only when:

- project count grows beyond what a compact table can show
- there are multiple human collaborators
- status needs to refresh without asking ChatGPT
- visual charts or filters become necessary
