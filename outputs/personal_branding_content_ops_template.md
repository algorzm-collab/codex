# Personal Branding Content Operations Template

## Task

- Issue: #38 - [Micro Task] 개인 브랜딩: 콘텐츠 운영 템플릿 만들기
- Linked CEO Decision: #32 - 개인 브랜딩: 운영 채널 결정
- Objective: 긴 글 기반 콘텐츠를 만들고 숏폼, 요약, 카드뉴스로 재가공하는 운영 템플릿을 정의한다.

## Operating Principle

하나의 긴 글을 원본 자산으로 삼고, 같은 메시지를 채널별 소비 방식에 맞게 재가공한다.

The long-form post is the source of truth. Short-form outputs are derivatives, not separate ideas.

## Tone

대표 페르소나는 "현장형 CTO/전략가"로 운영한다.

- 선명하게 말한다.
- 과장보다 구조를 우선한다.
- 실행 경험에서 나온 판단처럼 쓴다.
- 독자가 바로 따라 할 수 있는 운영 언어를 쓴다.
- 불확실한 것은 단정하지 않고 조건과 리스크를 같이 밝힌다.

Avoid:

- 추상적인 동기부여 문장
- 과한 성공담
- 출처 없는 확신
- 기술 과시형 문장
- 독자를 가르치려 드는 어조

## Core Pipeline

1. Capture
   - CEO 생각, 프로젝트 회고, 고객 문제, 실험 결과를 짧게 수집한다.
2. Long-form Draft
   - 하나의 관점, 하나의 문제, 하나의 결론으로 긴 글을 만든다.
3. Editorial Pass
   - 메시지, 근거, 사례, 다음 행동을 정리한다.
4. Derivative Production
   - 숏폼, 요약, 카드뉴스, 쓰레드, 뉴스레터로 변환한다.
5. Feedback Loop
   - 반응, 질문, 저장률, 공유 이유를 다음 긴 글 소재로 되돌린다.

## Five Reusable Formats

### 1. Long-form Essay

- Use case: 대표 관점, 프로젝트 철학, 시장 해석, 운영 원칙
- Target length: 1,200-2,000 Korean characters
- Structure:
  - 문제 제기
  - 왜 중요한가
  - 기존 방식의 한계
  - 내 판단
  - 실행 원칙
  - 다음 행동

### 2. Executive Summary Post

- Use case: LinkedIn, Facebook, 커뮤니티 공유용 짧은 요약
- Target length: 400-700 Korean characters
- Structure:
  - 한 문장 결론
  - 핵심 포인트 3개
  - 실무 적용 한 줄

### 3. Short-form Script

- Use case: Reels, Shorts, TikTok, 60-90초 영상
- Target length: 130-220 spoken Korean words
- Structure:
  - Hook
  - Misconception
  - Practical insight
  - Example
  - One action

### 4. Carousel / Card News

- Use case: Instagram, LinkedIn document post, blog thumbnail content
- Target length: 6-8 cards
- Structure:
  - Card 1: 강한 제목
  - Card 2: 문제
  - Card 3: 왜 지금 중요한가
  - Card 4: 핵심 프레임
  - Card 5: 적용 예시
  - Card 6: 체크리스트
  - Card 7: 결론
  - Card 8: 다음 질문

### 5. Operating Memo

- Use case: GitHub Issue, Google Docs, Codex/ChatGPT 인수인계
- Target length: 700-1,200 Korean characters
- Structure:
  - Context
  - Decision
  - Evidence
  - Risk
  - Next action

## Three Reusable Prompts

### Prompt 1: Long-form Draft

```text
다음 메모를 개인 브랜딩용 긴 글로 바꿔줘.

목표 독자:
- 창업자
- 1인 사업가
- AI를 활용해 업무 체계를 만들고 싶은 사람

톤:
- 현장형 CTO/전략가
- 과장 없이 선명하게
- 실행 가능한 구조 중심

출력 구조:
1. 문제 제기
2. 왜 중요한가
3. 흔한 오해
4. 내 관점
5. 실행 원칙
6. 다음 행동

메모:
[여기에 원본 메모]
```

### Prompt 2: Derivative Pack

```text
아래 긴 글을 재가공해줘.

출력:
1. 500자 요약 포스트
2. 60초 숏폼 스크립트
3. 카드뉴스 7장 구성
4. 제목 후보 10개
5. 댓글 유도 질문 5개

규칙:
- 원문의 핵심 판단을 유지해.
- 새로운 주장을 추가하지 마.
- 각 채널에서 바로 사용할 수 있게 써.

긴 글:
[여기에 긴 글]
```

### Prompt 3: Feedback Loop

```text
아래 콘텐츠 반응을 분석해서 다음 글감으로 바꿔줘.

입력:
- 원본 콘텐츠:
- 좋은 반응:
- 반박/질문:
- 저장/공유된 이유 추정:

출력:
1. 독자가 실제로 관심 가진 문제
2. 다음 긴 글 주제 5개
3. 가장 먼저 쓸 글 1개 추천
4. 추천 이유
5. 후속 숏폼 Hook 5개
```

## Channel Plan

| Channel | Role | Primary Format | Cadence | Success Signal |
| --- | --- | --- | --- | --- |
| Blog / Newsletter | 원본 자산 저장소 | Long-form Essay | 주 1회 | 재방문, 구독, 인용 |
| LinkedIn / Facebook | 전문성 확산 | Executive Summary Post | 주 2-3회 | 댓글, 공유, DM |
| Instagram / Threads | 가벼운 접점 | Carousel, short insight | 주 2회 | 저장, 팔로우 |
| YouTube Shorts / Reels | 발견 채널 | Short-form Script | 주 2-3회 | 완주율, 팔로우 전환 |
| GitHub / Docs | 운영 기억 | Operating Memo | 프로젝트마다 | 다음 작업 연결 |

## Weekly Operating Rhythm

- Monday: 긴 글 주제 선정과 원본 메모 정리
- Tuesday: 긴 글 초안 작성
- Wednesday: 긴 글 발행 및 요약 포스트 생성
- Thursday: 숏폼 스크립트와 카드뉴스 제작
- Friday: 반응 분석 및 다음 글감 backlog 업데이트

## Acceptance Criteria

- Tone is defined.
- Five reusable content formats are defined.
- Three reusable prompts are included.
- Channel plan is included.
- The pipeline starts from long-form content and produces reusable derivatives.

## Next Implementation Task

Create a lightweight content backlog table with columns:

- source idea
- long-form title
- target channel
- derivative status
- publish date
- feedback signal
- next action
