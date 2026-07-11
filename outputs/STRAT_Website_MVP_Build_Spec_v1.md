# STRAT Website MVP Build Spec v1

## 1. MVP Goal

STRAT 홈페이지 MVP의 목표는 예쁜 회사소개 페이지를 만드는 것이 아니라, 방문자가 자신의 문제를 짚고 STRAT에 문의하도록 만드는 것이다.

핵심 전환:

```text
첫 화면 공감
-> 문제 선택
-> 문제 추론 결과
-> 유사 실적/가설 솔루션
-> 회사소개/구성원 신뢰
-> 문의
```

## 2. Pages

### Home

역할:

- 후킹
- Issue Finder 진입
- 관련 실적 노출
- 회사/구성원 신뢰로 연결

필수 섹션:

- Hero
- Issue Finder
- Problem Mirror
- Related Cases
- Services
- Company
- People
- Insights
- Contact

### Cases

역할:

- 유사 문제 해결 경험을 보여준다.

구조:

- 필터: 전략 / 조직 / 성과관리 / 인사 / ESG-AI
- 카드: 고객 유형, 문제, 접근, 산출물, CTA
- 상세: 배경, 문제, 접근, 산출물, 관련 서비스

### Services

역할:

- 서비스 나열이 아니라 문제 해결 클러스터를 보여준다.

서비스 클러스터:

- 전략체계 정렬
- KPI 및 성과관리체계
- 조직구조 및 R&R
- 업무프로세스 및 협업
- 인사·직무·역량
- ESG 및 사회적가치
- AI/DT 전환

### Company

역할:

- STRAT의 관점과 일하는 방식을 설명한다.

### People

역할:

- 수행자의 신뢰를 만든다.

### Contact

역할:

- 짧은 문의 폼으로 전환한다.

## 3. Components

### Header

Links:

- 문제 짚어보기
- 실적
- 서비스
- 회사소개
- 구성원
- Insights
- 문의하기

CTA:

- 우리 문제 짚어보기

### Hero

Headline:

> 보고서는 있는데 실행이 안 되나요? 몇 가지 선택으로 조직의 진짜 병목을 짚어드립니다.

Subcopy:

> STRAT은 짧은 선택을 바탕으로 현재 문제가 전략, 조직, KPI, 성과평가, 인사, ESG/AI 중 어디에 가까운지 추론하고, 유사 실적과 가설적 접근을 제시합니다.

### Issue Finder

Source:

`STRAT_Issue_Finder_Decision_Tree_v2.json`

Core behavior:

- 3-step flow
- No file upload
- No long questionnaire
- Result appears before contact request
- Result includes problem name, interpretation, related experience, hypothesis solution, CTA

### Result Panel

Required content:

- Problem name
- Headline
- Interpretation
- Related experience
- Hypothesis solution
- CTA

Important:

Result should not sound like a final diagnosis.

Use:

- “가까워 보입니다”
- “신호일 수 있습니다”
- “상담에서 구체화할 수 있습니다”

Avoid:

- “귀 조직의 문제는 X입니다”
- “정확한 진단 결과”
- “확정 솔루션”

### Case Card

Fields:

- customer_type
- problem
- approach
- deliverables
- related_solution
- cta

### Contact Form

Fields:

- 이름
- 기관/회사명
- 연락처 또는 이메일
- 상담하고 싶은 문제

Hidden fields:

- selected_symptom
- selected_scene
- selected_need
- inferred_problem_type
- related_cta

Do not include:

- 파일 업로드
- 예산 상세
- 조직도
- 내부 보고서
- 긴 설문

## 4. UX Rules

### Rule 1. First action within 5 seconds

첫 화면에서 사용자는 바로 선택할 수 있어야 한다.

### Rule 2. Symptom language before consulting language

먼저:

- 보고서는 있는데 실행이 안 된다.

나중에:

- 전략-조직-성과 연결부 약화

### Rule 3. Show value before asking for contact

연락처는 결과 일부를 보여준 뒤 요청한다.

### Rule 4. Related cases should follow problem inference

방문자가 “내 문제”를 본 직후 유사 실적을 보여준다.

### Rule 5. Company and People are trust layers

회사소개와 구성원 소개는 후킹 앞에 나오지 않는다.  
문제 추론과 실적 이후 신뢰를 강화하는 역할로 둔다.

## 5. Event Tracking

### Events

- hero_cta_click
- issue_finder_start
- issue_step_1_select
- issue_step_2_select
- issue_step_3_select
- issue_result_view
- issue_result_cta_click
- case_card_click
- service_cluster_click
- contact_form_start
- contact_form_submit

### Properties

- selected_symptom
- selected_scene
- selected_need
- inferred_problem_type
- device
- source_section

## 6. Success Metrics

### Activation

- Issue Finder start rate
- Step completion rate
- Result view rate

### Trust

- Case section click rate
- Company section reach
- People section reach

### Conversion

- Result CTA click rate
- Contact form start rate
- Contact form submit rate

### Learning

- Most selected symptom
- Highest converting inferred problem type
- Drop-off step
- Case category with most clicks

## 7. Content Dependencies

Minimum content needed for MVP:

- 3 representative anonymized cases
- Company positioning copy
- 3 expert/person profile placeholders or real profiles
- Contact email
- Logo

Nice to have:

- 6 representative cases
- Public/private customer segmentation
- Report/deliverable preview images
- Insight articles

## 8. Build Priority

### Phase 1

- Home single-page MVP
- Issue Finder interactive flow
- Result panel
- 3 related cases
- Contact form

### Phase 2

- Dedicated Cases page
- Dedicated Services pages
- People page
- Insight detail pages

### Phase 3

- Analytics dashboard
- A/B testing for hero and CTA
- CRM/email integration
- Result-based email follow-up

