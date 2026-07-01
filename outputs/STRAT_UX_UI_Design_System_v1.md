# STRAT UX/UI Design System v1

## 1. Design Principle

STRAT 홈페이지의 UI는 “멋있어 보이는 장식”보다 “의사결정을 잘하는 회사처럼 보이는 정밀함”을 목표로 한다.

사용자는 홈페이지의 완성도를 보고 회사의 컨설팅 품질을 추정한다. 따라서 STRAT의 UX/UI는 다음 인상을 만들어야 한다.

- 문제를 빠르게 구조화한다.
- 복잡한 내용을 선명하게 정리한다.
- 공공기관/기업 담당자가 신뢰할 만큼 차분하다.
- 스타트업 제품처럼 조작이 쉽고 빠르다.
- 보고서가 아니라 실제로 작동하는 진단 도구처럼 느껴진다.

핵심 디자인 문장:

> Premium consulting intelligence, productized as a diagnostic interface.

## 2. UX Personality

STRAT의 UX는 다음 성격을 가진다.

- Calm: 과장하지 않는다.
- Precise: 문장과 레이아웃이 날카롭다.
- Diagnostic: 계속 질문하고 좁혀간다.
- Evidence-based: 모든 주장을 사례, 산출물, 데이터로 받친다.
- Executive-ready: 의사결정자가 봐도 가볍지 않다.
- Product-like: 버튼, 선택, 결과가 즉시 반응한다.

피해야 할 느낌:

- 전통 컨설팅사의 딱딱한 회사소개서
- 스타트업 랜딩페이지의 과한 텐션
- 공공기관 제안서 같은 무거운 표지
- 추상 슬로건만 있는 첫 화면
- 장식용 그래픽이 많은 디자인

## 3. Visual Direction

### 3.1 Overall Mood

톤:

- 밝은 배경
- 진한 타이포그래피
- 정밀한 선
- 절제된 색상 강조
- 데이터 패널 중심

사용자에게 보여야 하는 것:

- 선택지
- 진단 진행률
- 연결 구조
- 추천 결과
- 산출물
- 사례

사용자에게 덜 보여야 하는 것:

- 추상 이미지
- 의미 없는 도형
- 과한 애니메이션
- 무거운 브랜드 자랑

### 3.2 Color System

Primary Ink:

- Charcoal: `#15171A`
- Graphite: `#2E3238`
- Muted Text: `#606873`

Surface:

- Base: `#F7F8F5`
- Panel: `#FFFFFF`
- Soft Line: `#E4E7E1`

Accent:

- Strategic Teal: `#0F766E`
- Signal Blue: `#2563EB`
- Decision Amber: `#B7791F`
- Risk Red: `#B91C1C`

Usage:

- Teal: primary CTA, selected state, diagnostic progress
- Blue: insight links, evidence markers
- Amber: decision note, priority signal
- Red: risk signals only

금지:

- 사이트 전체를 파란색/남색 계열로만 만들지 않는다.
- 보라색 그라데이션을 메인 톤으로 쓰지 않는다.
- 베이지/크림 톤만으로 고급스럽게 보이려 하지 않는다.

### 3.3 Typography

Korean:

- Pretendard, Noto Sans KR, system sans-serif

English:

- Inter, system sans-serif

Type hierarchy:

- Hero headline: 48-64px desktop, 34-42px mobile
- Section title: 28-36px desktop, 24-30px mobile
- Card title: 17-20px
- Body: 15-17px
- Meta: 12-14px

Rules:

- Letter spacing: 0
- No viewport-based font scaling
- Compact UI panels use smaller headings
- Long Korean words must wrap naturally

## 4. Layout System

### 4.1 Grid

Desktop:

- Max content width: 1180-1240px
- 12-column grid
- Section padding: 88-112px top/bottom
- Hero min-height: 760px, but show next section hint

Tablet:

- 8-column grid
- Section padding: 72px

Mobile:

- Single column
- Section padding: 48-64px
- Sticky bottom CTA

### 4.2 Section Rhythm

권장 순서:

1. Hero + inline Solution Finder
2. Problem Mirror
3. Finder Result Preview
4. Solution Clusters
5. Cases
6. Method
7. Insights
8. Final CTA

각 섹션은 “질문 -> 구조화 -> 증거 -> 행동” 중 하나의 역할만 가진다.

## 5. Component System

### 5.1 Header

Elements:

- STRAT wordmark
- Solution Finder
- Services
- Cases
- Insights
- Method
- About
- Contact
- Primary CTA: `1분 진단`

Behavior:

- Sticky
- Scroll 시 배경을 살짝 불투명하게 유지
- 모바일에서는 메뉴보다 CTA를 우선 노출

### 5.2 Diagnostic Panel

가장 중요한 컴포넌트다.

Structure:

- Step indicator
- Question
- Segmented option buttons
- Progress hint
- Next CTA
- Result preview

UI rules:

- 선택지는 버튼처럼 보이되 과장하지 않는다.
- 선택 상태는 Teal outline + soft fill.
- 질문당 선택지는 4-6개 이하.
- 다음 버튼은 조건 충족 전 비활성화.
- 사용자가 선택하면 즉시 다음 질문으로 부드럽게 진행.

### 5.3 Problem Cards

Purpose:

- 방문자가 자기 문제를 발견하게 한다.

Rules:

- 카드 반경 8px 이하
- 카드 안 텍스트는 짧고 날카롭게
- 아이콘은 필수 아님. 쓰면 기능적 의미가 있어야 함.
- 카드 전체 클릭 시 관련 진단 경로로 이동

### 5.4 Solution Cluster Cards

Structure:

- Cluster name
- Problem line
- Approach
- Deliverables
- CTA

Example:

```text
KPI & Performance System
KPI가 전략과 실제 업무성과에 연결되지 않을 때
전략 KPI, 부서 KPI, 개인 KPI와 평가 운영체계를 재설계합니다.
산출물: KPI 맵, 평가 운영안, 성과 모니터링 구조
```

### 5.5 Case Cards

Structure:

- Customer type
- Problem
- STRAT approach
- Deliverable
- Related solution

좋은 사례 카드:

```text
Public Institution
중장기전략과 경영평가 지표가 분리된 상태
정책환경, 기관 역할, 성과체계를 재정렬
산출물: 전략체계도, KPI 맵, 실행과제 로드맵
```

### 5.6 Result Screen

Result screen은 상담 전환의 핵심이다.

Structure:

1. One-line diagnosis
2. Risk signals
3. Recommended solution clusters
4. Expected deliverables
5. Related cases
6. CTA

Result headline example:

> 현재 조직은 전략은 있으나 KPI, R&R, 성과평가로 이어지는 실행 연결부가 약한 상태로 보입니다.

CTA:

- `진단 결과 기반 상담받기`
- `내부 보고용 요약 받기`

## 6. Interaction Design

### 6.1 First Interaction

첫 상호작용은 5초 안에 가능해야 한다.

첫 질문:

> 어떤 조직의 과제인가요?

사용자에게 생각을 많이 시키지 않는다. 조직 유형 선택은 쉽고, 다음 단계로 자연스럽게 이어진다.

### 6.2 Progressive Disclosure

전체 문항을 한 번에 보여주지 않는다.

Rules:

- Step 1: 조직 유형
- Step 2: 현재 고민
- Step 3: 핵심 문항 3-5개
- Step 4: 결과
- Step 5: 상담 또는 요약 요청

### 6.3 Microcopy

좋은 마이크로카피:

- `약 1분 소요`
- `선택한 답변에 따라 추천 솔루션이 달라집니다.`
- `결과 확인 전 연락처를 요구하지 않습니다.`
- `과업 범위가 명확하지 않아도 괜찮습니다.`

금지:

- `최고의 컨설팅 서비스를 제공합니다.`
- `고객만족을 최우선으로 합니다.`
- `차별화된 솔루션을 제공합니다.`

### 6.4 Motion

Motion은 “프리미엄”이 아니라 “상태 변화 이해”를 위해 쓴다.

Use:

- 선택 상태 전환
- 단계 이동
- 결과 카드 등장
- sticky CTA

Avoid:

- 과한 스크롤 애니메이션
- 장식용 패럴랙스
- 텍스트가 늦게 나타나는 연출

## 7. Trust Design

STRAT의 신뢰는 다음 레이어로 쌓는다.

### Layer 1. Problem Understanding

문제를 정확히 말한다.

Example:

> 전략은 있는데 KPI, R&R, 조직구조, 성과평가가 서로 연결되어 있습니까?

### Layer 2. Diagnostic Experience

방문자가 직접 문제를 좁힌다.

### Layer 3. Deliverables

무엇을 받게 되는지 보여준다.

### Layer 4. Cases

유사 문제를 해결한 사례를 보여준다.

### Layer 5. Method

어떻게 일하는지 보여준다.

## 8. Mobile UX

Mobile은 별도 설계가 필요하다.

Rules:

- Hero headline은 3줄 이하로 유지
- Diagnostic option은 1열 또는 2열
- Bottom sticky CTA 사용
- 긴 문항은 질문과 설명을 분리
- 결과 화면은 카드 스택 형태
- 폼은 단계형으로 분리

Mobile first CTA:

`전략진단 시작`

## 9. Accessibility

필수:

- 모든 버튼은 명확한 focus state
- 색상만으로 상태를 전달하지 않음
- 최소 본문 대비 WCAG AA 수준
- 선택지는 키보드 접근 가능
- 폼 에러는 문장으로 안내
- 결과 카드 제목은 스크린리더가 이해할 수 있게 구조화

## 10. Quality Bar

STRAT 홈페이지 UI가 통과해야 할 기준:

1. 첫 화면만 봐도 무엇을 하는 회사인지 알 수 있다.
2. 방문자가 5초 안에 첫 선택을 할 수 있다.
3. CTA가 모호하지 않다.
4. 카드와 텍스트가 모바일에서 잘리지 않는다.
5. 전문성과 속도가 동시에 느껴진다.
6. 서비스 나열보다 문제 해결 경로가 먼저 보인다.
7. 문의 전환이 영업 압박처럼 느껴지지 않는다.
8. 결과 화면을 보고 상담받을 이유가 생긴다.

## 11. Recommended Visual Metaphor

STRAT의 시각 은유는 “나침반”이나 “산 정상”이 아니다.

권장 은유:

- Diagnostic console
- Decision map
- Strategy operating system
- Evidence-to-action pipeline
- Issue-to-solution routing

즉, 홈페이지는 감성 이미지보다 “정확히 작동하는 전략 진단 콘솔”처럼 보여야 한다.

