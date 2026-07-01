# STRATEGY 홈페이지 프로젝트 GitHub 개발철학 연동 리뷰 v1

작성일: 2026-07-01

## 1. 결론

현재 STRATEGY 홈페이지 기획은 콘텐츠 전략, 문제진단 UX, 성장 플라이휠 관점은 좋다. 다만 GitHub식 개발철학으로 보면 아직 "좋은 기획안"에 머물 가능성이 있다. 이 프로젝트는 홈페이지 제작이 아니라 계속 실험하고 개선되는 제품형 웹사이트로 운영되어야 한다.

따라서 기획의 중심을 다음처럼 바꿔야 한다.

```text
페이지를 만든다
-> 문제/가설을 이슈로 쪼갠다
-> 작은 브랜치에서 실험한다
-> PR로 리뷰한다
-> 배포한다
-> 데이터를 본다
-> 다음 이슈로 개선한다
```

즉 STRATEGY 홈페이지는 완성품이 아니라 `Growth Website Repository`가 되어야 한다.

## 2. GitHub 개발철학에서 가져올 핵심

### 2.1 Issue first

모든 작업은 "만들 기능"이 아니라 "해결할 문제"로 시작한다.

좋은 이슈:

- 방문자가 첫 화면에서 무엇을 해야 할지 모른다.
- 대표실적이 많지만 신뢰로 전환되지 않는다.
- Issue Finder 결과가 상담으로 이어지는 힘이 약하다.
- 디자인은 좋아졌지만 컨설팅펌의 권위가 아직 부족하다.
- 모바일에서 첫 CTA가 충분히 강하지 않다.

나쁜 이슈:

- 메인 디자인 수정
- 실적 섹션 개선
- 애니메이션 추가
- 카피 변경

STRATEGY 프로젝트의 이슈는 항상 다음 구조를 가져야 한다.

```text
문제
가설
변경 범위
성공 기준
검증 방법
릴리즈 후 관찰 지표
```

### 2.2 Small branches

브랜치는 큰 페이지 단위가 아니라 실험 단위로 나눈다.

권장 브랜치:

```text
exp/hero-issue-finder-v2
exp/case-cinematic-panels
feat/admin-case-editor
feat/lead-record-dashboard
perf/lightweight-motion-layer
copy/seinsollen-positioning
fix/mobile-cta-overlap
```

피해야 할 브랜치:

```text
homepage-renewal
final-design
new-site
all-update
```

이 프로젝트는 콘텐츠, UX, UI, 백엔드가 얽혀 있으므로 큰 브랜치 하나에 모두 넣으면 리뷰도 어렵고 회귀도 찾기 어렵다.

### 2.3 Pull Request as decision record

PR은 코드 병합 요청이 아니라 의사결정 기록이다.

STRATEGY 홈페이지 PR에는 반드시 다음이 들어가야 한다.

- 어떤 고객 행동을 바꾸려는가
- 기존 화면의 문제는 무엇인가
- 이번 변경의 가설은 무엇인가
- 변경 전/후 스크린샷
- 모바일 확인
- 측정할 이벤트
- 롤백 기준

예시:

```text
PR: 대표실적 섹션을 cinematic panel 구조로 변경

문제:
현재 실적 카드는 정보는 많지만 신보, 해진공, 주금공 같은 대표 실적의 무게감이 충분히 전달되지 않는다.

가설:
대표실적 6개를 스크롤 기반 스토리 패널로 보여주면 case section 체류와 문의 CTA 클릭이 증가한다.

성공 기준:
case section reach 60% 이상
case CTA click 20% 증가
contact form start 10% 증가
```

### 2.4 Deploy early, learn fast

홈페이지는 "다 끝나고 오픈"하면 안 된다. 실험 가능한 작은 단위로 배포하고 관찰해야 한다.

권장 배포 리듬:

- 매주 1회 프로덕션 배포
- 매주 2~3개 작은 실험 브랜치
- 매주 금요일 지표 리뷰
- 매월 1회 IA/카피/퍼널 재정렬

홈페이지의 완성도는 한 번에 만들어지는 것이 아니라, 사용자 반응 데이터와 대표님의 실제 상담 언어가 축적되며 올라간다.

### 2.5 README as operating manual

README는 실행 방법만 적는 문서가 아니다. 이 사이트가 어떤 철학으로 운영되는지 설명해야 한다.

README에 추가되어야 할 항목:

- Product thesis
- Growth loop
- Homepage funnel
- Event taxonomy
- Branch naming
- PR checklist
- Release checklist
- Content update workflow
- Admin operation guide
- Privacy/security notes

## 3. 현재 기획안에 대한 리뷰

### 잘된 점

첫째, 홈페이지를 회사소개 페이지가 아니라 문제진단형 퍼널로 본 점이 강하다. `Issue Finder -> 관련실적 -> 신뢰 -> 문의` 흐름은 전통 컨설팅펌 홈페이지와 명확히 다르다.

둘째, 회사소개/구성원/실적/문의라는 기본 속성을 버리지 않고 후킹 구조 안에 재배치했다. 본질을 흐리지 않고 진입 순서를 바꾼 판단은 맞다.

셋째, Growth Homepage OS 문서에 AARRR, 실험 백로그, CTA 테스트, 세그먼트별 전환 개념이 이미 들어가 있다. GitHub식 운영체계와 결합하기 좋은 기반이다.

넷째, 백엔드에 회원, 소속, 전화번호, 메일링, QA, 설문/진단 기록, 실적/장표 업데이트 기능을 둔 것은 단순 랜딩페이지가 아니라 운영 가능한 웹 자산으로 가는 방향이다.

### 부족한 점

첫째, 기획안이 아직 "무엇을 만들 것인가" 중심이고 "어떤 가설을 어떤 PR로 검증할 것인가"가 약하다.

둘째, 이벤트 트래킹 항목은 있으나 GitHub Issue/PR 단위와 연결되어 있지 않다. 예를 들어 `hero_cta_click`을 올리기 위한 실험 이슈가 별도로 있어야 한다.

셋째, 디자인 고도화 방향은 강해졌지만 QA 기준이 부족하다. 압도적인 UI를 목표로 한다면 브라우저별, 모바일별, 모션 축소 옵션, 성능 기준이 PR 체크리스트에 포함되어야 한다.

넷째, 운영자 업데이트 기능은 있으나 콘텐츠 변경의 승인/리뷰 구조가 약하다. 실적이나 핵심장표는 회사 신뢰와 직결되므로 바로 공개보다 draft -> review -> publish 흐름이 필요하다.

다섯째, 아직 Git 저장소로 관리되는 프로젝트 구조가 아니다. 현재 작업 디렉터리는 git repository가 아니므로 이 상태에서는 GitHub식 개발철학을 실제 운영에 연결할 수 없다.

## 4. STRATEGY식 GitHub 운영 모델

### 4.1 Repository 구조

권장 구조:

```text
strategy-site/
  app/
    app.py
    static/
    data/
  docs/
    planning/
    research/
    growth/
    decisions/
  content/
    cases/
    people/
    slides/
    insights/
  experiments/
    README.md
  .github/
    ISSUE_TEMPLATE/
    PULL_REQUEST_TEMPLATE.md
    workflows/
  README.md
```

현재 `outputs/strat_site_mvp`는 `app/` 또는 루트 앱으로 승격하고, 기획 문서는 `docs/`로 정리하는 것이 좋다.

### 4.2 Issue labels

권장 라벨:

```text
type:strategy
type:ux
type:ui
type:copy
type:content
type:backend
type:analytics
type:admin
type:security
type:performance

stage:idea
stage:ready
stage:building
stage:review
stage:shipped
stage:learning

priority:p0
priority:p1
priority:p2

metric:activation
metric:engagement
metric:conversion
metric:trust
```

### 4.3 Project board

GitHub Projects는 다음 뷰가 필요하다.

```text
Roadmap View
- Now
- Next
- Later

Experiment View
- Hypothesis
- Build
- Shipped
- Measuring
- Learned

Content View
- Needed
- Draft
- Review
- Published
- Needs Update

Bug/QA View
- Reported
- Confirmed
- Fixing
- Verified
```

커스텀 필드:

```text
Area: Hero / Finder / Cases / Services / People / Contact / Admin / Backend
Metric: Activation / Trust / Conversion / Retention / Ops
Impact: High / Medium / Low
Effort: High / Medium / Low
Experiment ID
Target Ship Date
Owner
Status
```

### 4.4 PR checklist

모든 PR은 다음을 통과해야 한다.

```text
[ ] 이 PR이 해결하는 Issue가 연결되어 있다.
[ ] 변경 전/후 화면 설명이 있다.
[ ] 모바일 390px, 태블릿, 데스크톱에서 확인했다.
[ ] 문의 전환 경로가 깨지지 않는다.
[ ] Issue Finder가 정상 동작한다.
[ ] 관리자 기능이 영향을 받으면 저장/수정/비공개 처리를 확인했다.
[ ] 신규 이벤트가 있으면 이벤트 이름과 속성을 문서화했다.
[ ] 성능 저하를 만들 만한 무거운 라이브러리를 추가하지 않았다.
[ ] 모션은 prefers-reduced-motion을 고려했다.
[ ] 개인정보 입력/저장 흐름에 불필요한 필드를 추가하지 않았다.
```

## 5. 개발 로드맵 재정렬

### Sprint 0. Repository foundation

목표: GitHub식 운영이 가능한 바닥 만들기

작업:

- Git 저장소 초기화
- `.github/ISSUE_TEMPLATE` 작성
- `.github/PULL_REQUEST_TEMPLATE.md` 작성
- README 재작성
- docs/content/app 구조 정리
- 기본 QA 체크 스크립트 작성

완료 기준:

- 모든 변경이 Issue -> Branch -> PR -> Merge 흐름으로 추적 가능

### Sprint 1. High-impact first screen

목표: 첫 화면에서 "이 회사는 다르다"를 즉시 느끼게 만들기

작업:

- Hero interaction 고도화
- Issue Finder 질문 재정렬
- CTA 2~3개 A/B 구조 준비
- 모바일 첫 화면 압축

측정:

- first interaction rate
- issue finder start rate
- scroll depth 25%

### Sprint 2. Cinematic proof system

목표: 대표실적을 목록이 아니라 압도적 신뢰 장면으로 보여주기

대상:

- 신용보증기금 뉴비전
- 해양진흥공사 중장기 경영전략
- 주택금융공사 부점성과평가
- 올림픽 레거시
- 도공 미래전략
- UAM Team Korea

작업:

- 대표 6개 케이스를 스크롤 스토리 패널로 재구성
- 문제/접근/산출물/왜 STRATEGY인가 구조로 통일
- 관련 Issue Finder 결과와 자동 연결

측정:

- case section reach
- case dwell time
- case-to-contact CTA click

### Sprint 3. Lead and admin operating layer

목표: 문의와 운영을 놓치지 않는 백엔드 완성

작업:

- 관리자 대시보드 개선
- 진단 기록 필터
- 문의 상태값 추가
- QA 답변 상태 관리
- 실적 draft/publish 흐름
- 핵심장표 썸네일/링크 관리

측정:

- lead response time
- qualified inquiry count
- admin update frequency

### Sprint 4. Analytics and experiment loop

목표: 홈페이지를 학습하는 시스템으로 만들기

작업:

- 이벤트 수집 구조 구체화
- UTM/source 저장
- CTA variant 기록
- 주간 리포트 CSV/export
- 실험별 결과 기록 문서화

측정:

- experiment velocity
- winning CTA
- highest converting problem type
- drop-off step

## 6. 바로 만들어야 할 GitHub Issue 12개

```text
1. [Foundation] GitHub repository structure and templates
2. [UX] Rewrite Issue Finder questions as high-intent consulting triggers
3. [UI] Build cinematic case panels for six flagship projects
4. [Copy] Reframe hero around Sein & Sollen plus execution bottleneck
5. [Analytics] Define event taxonomy and payload schema
6. [Backend] Add inquiry status and admin lead workflow
7. [Admin] Add draft/review/publish status for cases and slides
8. [Performance] Audit animation layer and reduce unnecessary repaint
9. [Mobile] Optimize first viewport and sticky CTA behavior
10. [Trust] Build people/profile proof section with LinkedIn-backed credibility
11. [Security] Prepare privacy policy, admin password handling, data backup
12. [Experiment] Hero CTA variant A/B test design
```

## 7. 최종 판단

STRATEGY 홈페이지 프로젝트는 일반 웹에이전시식으로 진행하면 안 된다. 그러면 아무리 카피가 좋아도 결국 "고급스럽지만 정적인 회사소개 사이트"가 된다.

이 프로젝트의 정체성은 다음이어야 한다.

```text
Consulting Firm Website
+ Growth Product
+ Diagnostic Engine
+ Evidence Library
+ GitHub-style Continuous Delivery
```

GitHub 개발철학을 붙이면 이 홈페이지는 한 번 만드는 산출물이 아니라, 대표님의 상담 언어, 실적, 고객 반응, 문의 데이터가 계속 쌓이며 진화하는 전략 세일즈 엔진이 된다.

다음 액션은 명확하다.

1. 현재 MVP를 GitHub repository 구조로 승격한다.
2. Issue/PR 템플릿을 만든다.
3. 대표실적 6개 cinematic proof system을 첫 번째 큰 실험으로 잡는다.
4. 모든 UI/카피/백엔드 변경을 측정 가능한 실험 단위로 운영한다.

