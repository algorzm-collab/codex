# Project Portfolio Registry

## Purpose

This file defines how Algorzm manages many AI-driven projects without making the CEO track each chat, branch, or tool manually.

ChatGPT acts as the central CTO layer.

GitHub repositories act as execution workspaces.

Codex acts as a micro-task implementation worker inside each workspace.

---

## Core Rule

Branches are not projects.

Branches are temporary execution lanes for a specific task, fix, experiment, or pull request.

Projects should be represented by one of:

1. a dedicated GitHub repository
2. a clearly scoped folder inside a monorepo
3. an external workspace linked from the portfolio registry

---

## Recommended Structure

```text
algorzm-ai-os          # central operating system / portfolio control
project-brand-content # project repo
project-stratkr       # project repo
project-d3hr          # project repo
project-stock-community
project-new-business
```

The AI OS repository should not contain all product code.

It should contain:

- operating principles
- mission compiler
- agent routing
- dashboard
- portfolio registry
- cross-project status

---

## Portfolio Fields

Each project should track:

- name
- GitHub repository
- current status
- business objective
- owner agent
- latest mission
- next action
- risk
- CEO attention needed
- links to active issues / PRs

---

## CEO View

The CEO should see:

```text
Project
Status
Progress
Next Action
Owner
Needs CEO Decision?
```

The CEO should not need to inspect branches, commits, CI logs, or local tool state.

---

## First Projects To Register

From the current workspace list:

- 병렬 작업 대시보드 추가
- G2B자동화
- 장표머신
- 라이브러리
- 개인 브랜딩 콘텐츠 구축
- D3HR
- Strat.kr
- 김작가
- 신규사업 만들기
- 검토 실시간 주식 커뮤니티

These should be converted into portfolio records and mapped to GitHub repositories or workspaces.
