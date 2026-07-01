# D3HR Problem Definition One-Pager

## Task

- Issue: #39 - [Micro Task] D3HR: 문제정의 1페이지 작성
- Linked CEO Decision: #33 - D3HR: 프로젝트 성격 확정
- Project Cell: #8

## CEO Decision Constraint

D3HR은 아직 제품, 컨설팅, SaaS 중 하나로 확정하지 않는다.

먼저 누구의 어떤 문제를 해결할지 재확정한 뒤, 그 문제에 가장 맞는 전달 형태를 선택한다.

## Working Definition

D3HR은 조직과 개인의 의사결정, 역량, 성과, 업무 흐름을 AI 기반으로 진단하고 개선하는 문제 공간이다.

현재 단계에서 D3HR은 제품명이 아니라 문제 탐색 셀이다.

## Primary User Candidates

### 1. Small Business CEO

- Pain: 사람, 역할, 성과, 위임 문제가 머릿속에만 있고 구조화되어 있지 않다.
- Job to be done: 조직 문제를 빠르게 진단하고 다음 조치를 정하고 싶다.
- Buying trigger: 채용 실패, 핵심 인력 이탈, 성과 정체, 대표 병목.

### 2. Team Lead / Operator

- Pain: 팀원의 역량, 책임, 업무 흐름을 설명하기 어렵다.
- Job to be done: 팀 상태를 정리하고 실행 가능한 개선안을 만들고 싶다.
- Buying trigger: 업무 누락, 책임 공백, 반복 갈등, 온보딩 실패.

### 3. Individual Knowledge Worker

- Pain: 자신의 강점, 업무 방식, 성장 방향을 객관적으로 보기 어렵다.
- Job to be done: 나의 업무 운영체계를 진단하고 개선하고 싶다.
- Buying trigger: 커리어 전환, 번아웃, 생산성 저하, 역할 모호성.

## Problem Statement

많은 조직과 개인은 HR 문제를 느끼지만, 그것을 실행 가능한 진단 단위로 바꾸지 못한다.

문제는 "사람이 부족하다"가 아니라 다음 중 무엇인지 분해되지 않는 데 있다.

- 역할이 불명확한가
- 책임과 권한이 어긋났는가
- 역량이 부족한가
- 동기가 맞지 않는가
- 업무 흐름이 깨졌는가
- 대표 또는 리더에게 병목이 있는가
- 피드백 루프가 없는가

D3HR의 핵심 문제는 HR 데이터를 모으는 것이 아니라, 흐릿한 사람/조직 문제를 진단 가능한 구조로 바꾸는 것이다.

## Output Candidates

### A. Diagnostic Report

- Form: 질문 기반 진단 리포트
- Buyer: CEO, 팀 리더
- Value: 현재 조직/역할/성과 문제를 한 장으로 정리
- Risk: 질문 설계 품질이 낮으면 일반론이 된다.

### B. Consulting Playbook

- Form: 워크숍, 인터뷰, 리포트, 실행 과제 패키지
- Buyer: small business CEO
- Value: 초기 매출화가 쉽고 문제 학습 속도가 빠르다.
- Risk: 대표 개인 노동에 의존하기 쉽다.

### C. Lightweight SaaS

- Form: 설문, 대시보드, 리포트 자동 생성
- Buyer: 반복 진단이 필요한 조직
- Value: 확장 가능하다.
- Risk: 문제정의가 덜 된 상태에서 만들면 기능만 많아진다.

## MVP Candidate

가장 안전한 첫 MVP는 "AI-assisted D3HR Diagnostic Report"다.

### MVP Scope

- 15-25개 질문
- 대상: 대표 또는 팀 리더
- 입력: 조직 규모, 역할 구조, 현재 문제, 반복 갈등, 성과 병목
- 출력:
  - 문제 유형 분류
  - 핵심 병목 3개
  - 다음 2주 실행 과제
  - 추가 인터뷰 질문
  - 제품/컨설팅/SaaS 적합도 판단

### Excluded Scope

- 채용 플랫폼
- 성과관리 시스템
- 급여/인사 행정
- 법무/노무 판단
- 직원 감시/평가 자동화

## MVP Acceptance Criteria

- 사용자는 자신의 조직 문제가 어떤 유형인지 이해한다.
- 사용자는 다음 2주 동안 할 일을 3개 이하로 받는다.
- 결과물은 컨설팅 없이도 1차 가치를 준다.
- 반복 실행 시 SaaS화 가능한 데이터 구조가 남는다.

## Key Risks

- HR이라는 단어가 너무 넓어 포지셔닝이 흐려질 수 있다.
- 개인 진단과 조직 진단을 섞으면 메시지가 약해질 수 있다.
- 민감한 사람 평가로 보이면 신뢰 리스크가 생긴다.
- 법률/노무 판단처럼 보이면 책임 범위가 커진다.

## Recommended Next Decision Question

D3HR의 첫 대상은 누구인가?

Choose one:

1. Small Business CEO with organization bottleneck
2. Team Lead with role/process confusion
3. Individual knowledge worker with career/productivity problem

Recommendation: Start with option 1.

Reason: 대표 병목과 조직 문제는 지불 의사가 가장 높고, 컨설팅형 MVP로 문제를 빠르게 학습한 뒤 리포트/SaaS로 전환하기 쉽다.

## Next Micro Task

Create the first D3HR diagnostic questionnaire draft for "Small Business CEO with organization bottleneck".
