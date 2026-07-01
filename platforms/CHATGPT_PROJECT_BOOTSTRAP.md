# ChatGPT Project Bootstrap

## Purpose

This document answers the practical question:

What should the CEO type in an empty ChatGPT Project screen?

The answer is not to manage everything in one chat.

Use one central portfolio project and one project cell per business stream.

---

## Central Portfolio Project

Recommended ChatGPT Project name:

`AI 본사 / Portfolio Cockpit`

First message in an empty central project:

```text
포트폴리오 부팅.

GitHub `algorzm-collab/codex`의 다음 파일을 기준으로 전체 현황을 읽어줘:
- CONSTITUTION.md
- ARCHITECTURE.md
- AGENTS.md
- portfolio/registry.json
- orchestra/ORCHESTRATION_HARNESS_MODEL.md
- platforms/CHATGPT_NATIVE_SURFACES.md

출력은 다음 형식으로 해:
1. 전체 프로젝트 표
2. 이번 주 우선순위 Top 3
3. CEO 결정 필요한 것만
4. Codex에 줄 Micro Task 후보
5. Harness 기준 미달 프로젝트
6. 다음 24시간 실행계획

내가 GitHub나 Codex 세부사항을 직접 관리하지 않게 해.
```

---

## Individual Project Cell

Recommended ChatGPT Project name examples:

- `G2B자동화`
- `장표머신`
- `개인 브랜딩 콘텐츠 구축`
- `D3HR`
- `Strat.kr`
- `신규사업 만들기`

First message in an empty project cell:

```text
프로젝트 셀 부팅.

이 프로젝트 이름은 `[프로젝트명]`이다.
중앙 OS는 GitHub `algorzm-collab/codex`에 있다.

먼저 다음을 해:
1. portfolio/registry.json에서 이 프로젝트 항목을 찾는다.
2. 이 프로젝트의 목적, 현재 상태, 다음 액션을 정리한다.
3. Project Cell 형식으로 정리한다.
4. 다음 Mission 1개를 만든다.
5. Codex용 Micro Task 3개를 만든다.
6. 각 Micro Task에 Harness 기준을 붙인다.
7. CEO가 결정해야 하는 것과 아닌 것을 분리한다.

이 프로젝트 안에서는 다른 프로젝트 이야기를 섞지 마라.
```

---

## Daily CEO Command

Use this in the central portfolio project:

```text
오늘 포트폴리오 브리핑.
10개 프로젝트를 표로 정리하고,
이번 주 우선순위 3개,
CEO 결정 필요한 것,
Codex에 줄 Micro Task 큐를 뽑아.
```

---

## Project Command

Use this inside each project:

```text
이 프로젝트 현재 상태를 Project Cell 형식으로 정리해.
다음 미션 1개와 Codex Micro Task 3개를 만들어.
각 작업에 Harness 기준을 붙여.
```

---

## Rule

If the CEO is staring at a blank ChatGPT Project screen, the next action is always one of:

1. Portfolio boot command for the central project.
2. Project cell boot command for an individual project.
3. Daily CEO briefing command.

Never ask the CEO to manually reconstruct the operating model.
