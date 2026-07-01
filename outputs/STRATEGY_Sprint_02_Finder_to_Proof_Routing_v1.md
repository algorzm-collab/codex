# STRATEGY Sprint 02: Finder to Proof Routing 기획안 v1

작성일: 2026-07-01

## 1. 목적

Issue Finder 결과는 방문자에게 "내 문제를 어느 정도 이해했다"는 감각을 준다. 그러나 결과가 텍스트 설명으로만 끝나면 상담 전환까지 힘이 부족하다.

따라서 Sprint 02의 목적은 진단 결과를 대표실적 증거 장면으로 바로 연결하는 것이다.

```text
문제 선택
-> 가설적 진단
-> 관련 대표실적 proof panel
-> 유사 과제 상담 CTA
```

## 2. 실험 정의

Issue:

```text
[Experiment] Route Issue Finder result to flagship proof panel
```

Problem:

Issue Finder 결과가 관련 실적을 보여주지만, 방문자가 대표실적 섹션까지 직접 이동해야 한다. 진단과 증거가 한 화면 흐름으로 강하게 연결되지 않는다.

Hypothesis:

진단 결과에서 가장 관련도 높은 대표실적 proof panel로 이동하는 CTA를 제공하면, case section reach와 contact form start가 증가한다.

Primary metric:

```text
activation -> trust -> conversion
```

측정 지표:

- issue result view
- proof CTA click
- flagship panel reach
- case-to-contact CTA click
- contact form start

## 3. 진단 유형별 연결

```text
strategy_org_performance_gap -> 신용보증기금 / 해양진흥공사 / 도공 미래전략
rr_role_confusion -> 올림픽 레거시 / 조직재설계형 실적
performance_system_failure -> 한국주택금융공사 부점성과평가
transformation_execution_gap -> K-UAM / 도공 미래전략
```

1차 구현에서는 대표 proof panel 하나로 바로 연결한다.

```text
strategy_org_performance_gap -> proof-1
rr_role_confusion -> proof-4
performance_system_failure -> proof-3
transformation_execution_gap -> proof-6
```

## 4. UI 규칙

Issue Finder 결과에는 다음 요소를 추가한다.

- 관련 대표실적 이름
- "대표실적 증거 보기" CTA
- "상담하기" CTA는 유지

CTA 문구:

```text
관련 대표실적 증거 보기
```

## 5. 성공 기준

- Issue Finder 결과에서 proof panel로 이동 가능
- 기존 결과/문의 CTA는 유지
- 모바일에서도 버튼이 겹치지 않음
- proof panel에 고유 anchor가 있음

