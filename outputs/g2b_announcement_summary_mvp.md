# G2B Announcement Discovery/Summary MVP

## Task

- Issue: #37 - [Micro Task] G2B자동화: 공고 탐색/요약 MVP 정의
- Linked CEO decision: #31 - 공고 탐색/요약 자동화부터 시작
- Project Cell: #4

## MVP Goal

사용자가 지정한 키워드와 기간으로 공공입찰 공고 후보를 찾고, 각 공고를 빠르게 판단할 수 있는 1페이지 요약 목록을 만든다.

첫 버전의 핵심은 "입찰 참여 자동화"가 아니라 "좋은 후보 공고를 놓치지 않고 빠르게 읽는 것"이다.

## Source Sites

1. 나라장터 국가종합전자조달
   - URL: https://www.g2b.go.kr/
   - Use: 사람 검증용 원천 화면, 공고 상세 확인, 첨부파일 확인

2. 공공데이터포털 조달청/나라장터 입찰공고 OpenAPI
   - URL: https://www.data.go.kr/
   - Use: 자동 수집의 1차 후보. 서비스명은 구현 시점에 "조달청", "나라장터", "입찰공고정보서비스"로 재확인한다.

3. 조달청
   - URL: https://www.pps.go.kr/
   - Use: 제도/공지/안내 확인용 보조 출처. 공고 수집의 1차 소스는 아니다.

## User Input

MVP 입력은 수동 폼 또는 설정 파일 한 개로 충분하다.

```yaml
keywords:
  - AI
  - 자동화
  - 데이터
regions:
  - 전국
  - 서울
date_range:
  from: 2026-07-01
  to: 2026-07-07
min_budget_krw: null
include_agencies: []
exclude_keywords:
  - 상주
  - 현장근무
```

## Output Format

MVP 산출물은 CSV와 Markdown 두 가지로 만든다.

### CSV Columns

- collected_at
- source
- notice_id
- title
- agency
- demand_org
- region
- budget_krw
- posted_at
- deadline_at
- detail_url
- matched_keywords
- summary_3_lines
- fit_score_1_to_5
- risk_flags
- next_action

### Markdown Summary

각 공고는 아래 형식으로 요약한다.

```markdown
## [공고명]

- 기관: [발주/수요기관]
- 마감: [YYYY-MM-DD HH:mm]
- 예산: [금액 또는 미공개]
- 적합도: [1-5]
- 왜 볼만한가: [1문장]
- 핵심 요구: [3줄 이내]
- 리스크: [자격, 실적, 상주, 짧은 마감, 첨부 확인 필요]
- 다음 행동: [상세 검토 / 제외 / 질문 필요]
- 원문: [URL]
```

## Excluded Scope

- 입찰서 작성 자동화
- 인증서 로그인, 투찰, 계약 업무
- 첨부파일 전체 자동 해석
- 가격 산정 또는 수익성 판단
- 모든 공고 사이트 통합 수집
- 낙찰 가능성 예측
- 법률/조달 규정 판단

## MVP Acceptance Criteria

- 사용자가 키워드와 기간을 입력할 수 있다.
- 최소 1개 공식 출처에서 공고 후보를 가져오거나, API 키가 없으면 동일 스키마의 샘플 데이터를 읽을 수 있다.
- 후보마다 제목, 기관, 마감, 원문 URL, 3줄 요약, 리스크 플래그가 채워진다.
- 결과가 `outputs/` 아래 CSV와 Markdown으로 저장된다.
- 원문 링크를 열어 사람이 최종 확인할 수 있다.

## Next Implementation Task

`g2b_notice_discovery.py` 초안을 만든다.

첫 구현 범위:
- 설정 파일 `inputs/g2b_query.yaml` 읽기
- 공공데이터포털 API 키가 있으면 API 호출
- API 키가 없으면 `samples/g2b_notices_sample.json` 사용
- 공고 후보를 표준 스키마로 정규화
- `outputs/g2b_notices.csv`와 `outputs/g2b_notices.md` 생성

검증:
- API 키 없이 샘플 데이터로 실행 가능해야 한다.
- CSV/Markdown 파일이 생성되어야 한다.
- 마감일, 제목, 원문 URL이 비어 있으면 리스크 플래그를 남겨야 한다.
