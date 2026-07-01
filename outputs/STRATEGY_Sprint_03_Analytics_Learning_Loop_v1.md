# STRATEGY Sprint 03: Analytics Learning Loop 기획안 v1

작성일: 2026-07-01

## 1. 목적

STRATEGY 홈페이지는 한 번 만든 후 방치되는 회사소개 사이트가 아니라, 방문자의 선택과 문의 흐름을 학습하는 성장형 웹사이트여야 한다.

Sprint 03의 목적은 주요 행동을 백엔드에 저장해 다음 질문에 답할 수 있게 만드는 것이다.

```text
어떤 문제유형이 가장 많이 선택되는가?
어떤 진단 결과가 대표실적 CTA 클릭으로 이어지는가?
어떤 대표실적이 문의로 이어지는가?
어느 CTA가 실제 상담 의사를 만든는가?
```

## 2. 실험 정의

Issue:

```text
[Analytics] Store homepage behavior events for learning loop
```

Problem:

현재는 진단 기록과 문의 기록은 남지만, 그 사이에서 사용자가 어떤 CTA와 proof panel을 거쳤는지 알 수 없다.

Hypothesis:

이벤트를 저장하면 방문자의 문제유형, 증거 소비, 문의 전환 사이의 연결을 파악하고 다음 UI/카피 실험의 우선순위를 더 정확히 정할 수 있다.

## 3. 1차 이벤트

```text
issue_finder_start
issue_result_view
proof_jump_click
case_contact_cta_click
contact_form_start
contact_form_submit
```

## 4. 저장 속성

공통:

- event_name
- session_id
- user_id
- path
- source_section
- inferred_type
- target_id
- target_title
- metadata_json
- created_at

## 5. 관리자 조회

관리자 콘솔에 `이벤트` 탭을 추가한다.

1차로는 최근 200개 이벤트를 시간순으로 보여준다. 이후 단계에서 이벤트별 집계, 전환율, 문제유형별 리포트로 확장한다.

## 6. 성공 기준

- 공개 페이지에서 이벤트 POST 가능
- Issue Finder 결과 조회 이벤트가 저장됨
- proof CTA 클릭 이벤트가 저장됨
- 문의 폼 시작/제출 이벤트가 저장됨
- 관리자에서 최근 이벤트 확인 가능

