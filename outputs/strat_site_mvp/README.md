# strategy Site MVP

## GitHub-style Operating Philosophy

This project should be operated as a growth product, not as a one-time company homepage.

Core loop:

```text
Issue -> Branch -> Pull Request -> Review -> Deploy -> Measure -> Learn -> Next Issue
```

Every meaningful change should start with a problem statement:

- What visitor behavior are we trying to change?
- What trust or conversion problem are we solving?
- Which page, component, API, or admin workflow is affected?
- Which metric will tell us whether the change worked?

Recommended branch names:

```text
exp/hero-issue-finder-v2
exp/case-cinematic-panels
feat/admin-lead-status
feat/content-draft-publish
perf/lightweight-motion-layer
copy/seinsollen-positioning
fix/mobile-cta-overlap
```

Recommended labels:

```text
type:experiment
type:ux
type:ui
type:copy
type:content
type:backend
type:admin
type:analytics
type:security
type:performance
stage:idea
stage:building
stage:review
stage:shipped
stage:learning
metric:activation
metric:trust
metric:conversion
```

The first major GitHub-style experiment should be:

```text
[Experiment] Build cinematic proof panels for six flagship projects
```

Flagship cases:

- 신용보증기금 뉴비전 수립
- 해양진흥공사 중장기 경영전략 수립
- 한국주택금융공사 부점성과평가 고도화
- 평창 올림픽 레거시 활용방안
- 한국도로공사 미래전략/UAM 대응전략
- UAM Team Korea 관련 전략 과제

Success metrics:

- Case section reach
- Case dwell time
- Case-to-contact CTA click
- Contact form start
- Qualified inquiry count

## Reusable Learning Skill

The homepage implementation lessons are captured as a reusable skill:

```text
skills/strategy-homepage-growth/SKILL.md
```

Success/failure learning log:

```text
outputs/STRATEGY_Homepage_Success_Failure_Learning_v1.md
```

## 1. 실행

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' outputs\strat_site_mvp\app.py
```

기본 주소:

- 홈페이지: http://127.0.0.1:8765
- 관리자: http://127.0.0.1:8765/admin
- 관리자 로그인: http://127.0.0.1:8765/login

## 2. 관리자 로그인

기본 관리자 비밀번호:

```text
strat-admin
```

운영 전에는 반드시 환경변수로 바꾸는 것을 권장한다.

```powershell
$env:STRAT_ADMIN_PASSWORD='강한비밀번호'
```

## 3. 구성

```text
app.py                  Python 표준 라이브러리 기반 서버/API/SQLite 백엔드
data/strat_site.sqlite3 데이터베이스
static/index.html       공개 홈페이지
static/admin.html       관리자 콘솔
static/login.html       관리자 로그인
static/app.js           공개 페이지 동작
static/admin.js         관리자 동작
static/styles.css       공통 스타일
```

## 4. 저장되는 데이터

SQLite DB에 아래 기록이 남는다.

- 회원가입: 이름, 소속, 전화번호, 이메일, 동의 여부
- 메일링: 이메일, 이름, 소속, 전화번호, 구독 상태
- 문제 추론 기록: 증상, 터지는 장면, 필요, 추론 문제 유형, 결과 JSON
- 문의: 이름, 소속, 연락처, 이메일, 상담 문제, 추론 문제 유형
- QA 게시판: 이름, 소속, 이메일, 제목, 질문, 답변, 상태
- 실적: 제목, 고객 유형, 문제, 접근, 산출물, 솔루션 클러스터, 공개 여부
- 핵심장표: 제목, 설명, 이미지 URL, 링크 URL, 공개 여부

## 5. 관리자에서 할 수 있는 것

가능한 작업:

- 실적 추가
- 실적 수정
- 실적 비공개 처리
- 전체 실적 추가
- 전체 실적 수정
- 전체 실적 비공개 처리
- 핵심장표 추가
- 핵심장표 수정
- 핵심장표 비공개 처리
- 회원 기록 확인
- 메일링 구독 기록 확인
- 문제 추론 기록 확인
- 문의 기록 확인
- QA 기록 확인

수정 방법:

- 신규 추가: ID 칸을 비우고 저장
- 기존 수정: ID 칸에 수정할 번호를 넣고 저장

## 6. Issue Finder와 실적 자동 추천

Issue Finder 결과에는 추론된 문제 유형에 따라 관련 수행 실적이 자동으로 붙는다.

- 전략-조직-성과 연결부 약화: 전략수립, 성과관리 실적 추천
- R&R 및 조직역할 혼선: 조직재설계, 인사관리 실적 추천
- KPI/성과관리 작동 불량: 성과관리 실적 추천
- 전환과제 실행화 미흡: 전략수립 실적 추천

## 7. 반영된 기존 strategy 자산

기존 `strat.kr` 공개 콘텐츠를 바탕으로 아래 내용을 MVP에 반영했다.

- 브랜드명: strategy
- 포지셔닝: 1st Advisory Group
- 핵심 관점: Sein, Sollen, Fermat Point
- 대표 방법론: Fermat Point Methodology
- 대표 실적: 신용보증기금, 주택금융공사, 해양진흥공사, 해양환경공단, 한국환경공단, 한국도로공사, 한전원자력연료, 원자력환경공단 등 공개 실적 기반
- 구성원: 김정성 대표이사, 연구본부, 전문위원 네트워크
- 공개 연락 링크: 전화 02-6083-0330, LinkedIn https://www.linkedin.com/in/stratgy

## 8. 운영 전 반드시 추가할 것

현재는 로컬 MVP다. 실제 배포 전 아래를 추가해야 한다.

- HTTPS 배포
- 개인정보 처리방침
- 이메일 발송 연동
- 데이터 백업
- 관리자 계정 관리
- 스팸 방지
- 파일/이미지 업로드 관리
