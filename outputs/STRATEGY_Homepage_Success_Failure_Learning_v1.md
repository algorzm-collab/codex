# STRATEGY Homepage Success / Failure Learning v1

작성일: 2026-07-02

## 성공 요인

1. 문제 언어에서 시작했다.
   방문자는 회사소개보다 자기 문제를 먼저 본다. "보고서는 있는데 실행이 안 된다" 같은 문장이 진입 행동을 만든다.

2. 진단 후 증거를 연결했다.
   Issue Finder 결과에서 바로 대표실적으로 이동하게 하면서, 진단과 신뢰가 끊기지 않았다.

3. 대표실적을 목록이 아니라 장면으로 만들었다.
   신보, 해진공, 주금공, 올림픽 레거시, 도공, UAM Team Korea를 cinematic proof panel로 보여준 것이 신뢰감을 강화한다.

4. 최신 퍼블리싱을 가볍게 썼다.
   외부 라이브러리 없이 canvas, scroll animation, sticky panel, pointer-responsive hero를 사용해 사이트 품질을 높였다.

5. 이벤트 학습 루프를 만들었다.
   `issue_result_view`, `proof_jump_click`, `contact_form_start` 같은 이벤트가 저장되어 다음 실험의 기준이 생겼다.

## 실패 또는 주의 요인

1. UI가 멋있어도 메시지가 평범하면 컨설팅 홈페이지처럼 보인다.
   모션과 시각효과는 반드시 문제구조, 증거, 실행체계와 연결되어야 한다.

2. 실적이 많을수록 오히려 흐려질 수 있다.
   전체 실적은 하단에 두고, 첫 신뢰는 대표실적 6개로 강하게 만들어야 한다.

3. 진단이 설문처럼 보이면 이탈한다.
   질문은 짧고, 선택은 쉬워야 하며, 연락처 요구 전에 먼저 가치를 보여줘야 한다.

4. 관리자 기능은 쉽게 비대해진다.
   지금 단계에서는 콘텐츠 업데이트, 문의 확인, 이벤트 학습 정도가 적절하다.

5. GitHub 보존은 민감 정보와 공개 저장소 리스크가 있다.
   SQLite, secret, 로컬 경로, 고객 실명 데이터는 업로드하지 않아야 한다.

## 재사용 스킬 위치

```text
skills/strategy-homepage-growth/SKILL.md
```

## 다음 실험

```text
Problem:
관리자는 이벤트 목록은 볼 수 있지만, 문의 전환 경로를 한눈에 보기 어렵다.

Hypothesis:
세션별 여정과 case-to-contact 전환을 요약하면 다음 카피/CTA 실험의 우선순위가 명확해진다.

Change:
Admin analytics에 session journey view와 conversion path summary를 추가한다.

Primary metric:
운영자가 다음 실험 후보를 5분 안에 결정할 수 있는가.
```

