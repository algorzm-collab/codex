# 홈페이지 전선 실사 감사 (Homepage Front Audit)

작성: 2026-07-10 · 스케줄 태스크(homepage-front-audit) 자동 실사
대상 저장소: `algorzm-collab/codex` (본 오케스트라 저장소)
비교 기준: `origin/main` (6e8e67d)

## 요약 (Executive Summary)

- **살아있는 자산은 브랜치 1개뿐이다.** `codex/strategy-site-evidence-os-v10-20260708` 브랜치가 전체 홈페이지 작업(성장 MVP 상태 보존 → Sprint 01~06 전환 개선 → Evidence OS v10)을 처음부터 끝까지 담은 **단일 완결 이력**이다. 커밋 12개, `outputs/strat_site_mvp/` 아래 정적 사이트 풀빌드(HTML 29KB · CSS 71KB · app.js 158KB · Python 백엔드 55KB) + Evidence OS v10 데이터셋 + 설계 문서 30여 종.
- **`codex/strategy-site-growth-mvp-state-20260701` 브랜치는 사실상 죽은 브랜치다.** `main`의 완전한 조상(ancestor) 커밋이며 고유 커밋이 0개, 홈페이지 관련 파일이 전혀 없다(`site/` 대시보드만 있고 이는 이미 main에 병합되어 있음). 메모리에 기록된 "sprint 06 랜딩·전환 플로우" 콘텐츠는 이 브랜치가 아니라 **evidence-os-v10 브랜치 안에** 있다. → 기존 브리핑(homepage-front-briefing 메모리)의 가정이 틀렸다. 정정 필요.
- **main과 evidence-os-v10은 공통 조상이 없는 별개 히스토리(orphan)다.** 일반 `git merge`/PR diff가 불가능하고, 파일 단위 이식(cherry-pick 불가, patch 또는 파일 복사 방식) 전략이 필요하다.
- **도메인 충돌 가능성.** `outputs/strat_site_mvp/RELEASE_STATUS.md`의 배포 타깃이 `https://strat.kr/`로 명시되어 있다. 메모리(homepage-front-briefing)는 "Strat.kr(개인 브랜딩)은 동결 항목 — 혼동 금지"라고 기록했다. 이 문서 자체가 구버전 가정에 기반했을 수 있으니, **strat.kr 도메인 소유/용도를 CEO 확인 없이 그대로 배포하면 안 된다.**
- **데이터 드리프트.** 브랜치에 번들된 `strategy-v10/*.json,csv` 데이터(2026-07-08 스냅샷)가 현재 main의 `portfolio/strategy_v10/*`(2026-07-09, 더 최신)와 다르다. 배포 전 최신 데이터로 재추출 필요.
- **참조 무결성 문제.** 배포 문서(`DEPLOY_CLOUDFLARE.md`)가 `internal/strategy-v10-source/` 폴더를 언급하지만 브랜치에 실제로 커밋되어 있지 않다(로컬에만 존재했거나 누락). 배포 절차상 공백.

---

## 1. 두 브랜치 실사

### 1-A. `codex/strategy-site-evidence-os-v10-20260708` — 살아있는 자산

- `origin/main`과 공통 조상 없음 (`git merge-base` 실패, orphan 히스토리). 총 12개 커밋.
- 커밋 이력 (시간순):
  1. `5d5eff4` preserve strategy homepage growth MVP state
  2. `684876f` add admin analytics summary
  3. `c264e66` capture homepage learning skill
  4. `22fea85` define next strategy homepage plan
  5. `3635e97` feat: add conversion journey view for admin events
  6. `d7f051f` docs: add 53 spark strategy homepage handoff
  7. `04e3b56` feat: Sprint 06 public conversion upgrade for homepage
  8. `555e650` chore: add sprint 06 handoff notes for continuation
  9. `723cfda` chore: link inquiry context across result and case CTAs
  10. `edd4811` feat: tighten sprint 06 landing conversion flow and korean copy
  11. `0395bf5` feat: route case-grid cards to inquiry context in sprint 06
  12. `79d2b37` strategy-site: implement Evidence OS v10 (HEAD)

**파일 구조 (루트 대비 신규):**

```
outputs/
  STRAT_*.md, STRAT_*.json, STRAT_*.csv         — 설계·기획 문서 30종 (아키텍처, UX/UI, 스프린트별 계획, 콘텐츠 요청서 등)
  strategy_v10_homepage_prototype.html
  strat_site_mvp/                                — 실제 배포 빌드
    app.py                                        (55KB, Python 백엔드)
    static/
      index.html (29KB), app.js (158KB), styles.css (71KB)
      admin.html, admin.js                        — 내부 관리자 대시보드
      assets/*.jpg                                 — 대표/전문가 인물 사진 5장
      strategy-v10/*.json,csv,jsonl                — Evidence OS v10 공개용(마스킹) 데이터셋
      _headers, _redirects, 404.html, robots.txt, sitemap.xml, site.webmanifest
    check_deployed_site.py / check_static_release.py / package_static_release.py
    README.md, RELEASE_STATUS.md, DEPLOY_CLOUDFLARE.md, AWARD_QA_CHECKLIST.md
skills/strategy-homepage-growth/SKILL.md          — "그로스 프로덕트로서의 홈페이지" 운영 스킬 문서
```

**구현 완료 상태 (RELEASE_STATUS.md 자체 보고, 빌드 라벨 `20260708-v10-evidence-os`):**
- Award급 모션 레이어 (GSAP 3.13.0 + ScrollTrigger + Lenis 1.3.8, CDN 미로딩 시 네이티브 폴백)
- 히어로 진단 경험 (애니메이션 캔버스, 커맨드 덱, Issue Finder 패널)
- 전환 시스템: Issue Finder 진단 플로우 → 결과 미터 → Case Radar 증거맵 → 문의 컨텍스트 자동입력
- Legacy 베타 콘텐츠 흡수: Method Lab, 대표 리더십 보드, 전문가 프로젝트 셀
- STRATEGY 2.0 케이스스터디: 상황/실제문제/판단/방법/산출물/방문자 후킹 구조, 검증되지 않은 성과수치 배제
- **Evidence OS v10**: 공개-안전 데이터(`static/strategy-v10/`) 로딩, RFP 유사사례 검색(`window.STRATEGY_EVIDENCE_OS.retrieveSimilarCases()`), 직접/인접/간접 관련도 정렬, 회사공식/핵심인력PM/前리더십/내부참고 증거 레이어 분리, 원본 고객사명·연도·금액·전직장명 마스킹

**로컬 QA 통과 기록 (RELEASE_STATUS.md):** 데스크톱·모바일(390px) 뷰포트에서 Evidence OS 섹션 렌더링 확인, 콘솔 에러 없음, 가로 스크롤 없음. **단, Cloudflare 배포 후 재QA는 아직 미수행** (RELEASE_STATUS.md 자체 명시).

**main의 설계 문서와 정합성 확인:** main의 `portfolio/strategy_v10/strategy_v10_homepage_sections.md`(Section 1~10: Hero / Interactive Evidence Search / Trust Strip / 히트맵 / 동심원 그래프 / Value Chain / Anchor Case Map / Person Card / Evidence Pyramid / Korea Coverage Map)가 evidence-os-v10 브랜치의 구현 항목과 1:1로 대응됨 — **설계와 구현이 어긋나지 않았다.**

### 1-B. `codex/strategy-site-growth-mvp-state-20260701` — 죽은 브랜치 (정정 필요)

- `git merge-base --is-ancestor` 확인 결과 **main의 완전한 조상**. 즉 이 브랜치의 모든 커밋(100개)이 이미 main 히스토리 안에 존재하며, main보다 7커밋 뒤처진 과거 체크포인트일 뿐 고유 콘텐츠가 0개.
- 홈페이지/전략사이트 관련 파일 검색 결과 `strat_site_mvp`, `strategy_v10` 계열 파일이 **전혀 없음**.
- 유일하게 관련 있어 보이는 `site/` 폴더(app.js, cockpit.txt, data.json, index.html, style.css)는 실제로는 **내부 미션컨트롤/콕핏 대시보드**로 추정되며, 이미 main에 그대로 존재한다(company 홈페이지가 아님).
- **결론: 이 브랜치는 병합 대상이 아니다.** 실사 전 메모리(homepage-front-briefing)가 이 브랜치에 "sprint06 랜딩/전환 플로우/한국어 카피"가 있다고 기록했으나, 해당 커밋들은 실제로는 evidence-os-v10 브랜치 자체 이력 안에 있었다(§1-A 커밋 7~11). 메모리 정정 대상.
- 권고: 삭제 후보로 표시(§4). 삭제 전 CEO 확인 1회 권장(브랜치 삭제는 되돌리기 번거로운 작업이므로).

---

## 2. main 쪽 기존 자산 (참고)

main에는 이미 다음이 존재한다 (evidence-os-v10과 겹치거나 선행하는 부분):

- `portfolio/strategy_v10/` — Evidence OS v10 데이터셋 원본 + 설계 문서(`strategy_v10_homepage_sections.md`, `strategy_v10_planning_draft.md`, `strategy_v10_proposal_copy_blocks.md` 등), 2026-07-09 최종 갱신 (브랜치 스냅샷보다 최신).
- `site/`, `alos/site_exporter.py`, `checks/smoke_site.py` — 내부 대시보드/콕핏 시스템 (회사 홈페이지와 무관, growth-mvp 브랜치와 동일 계보).

이 두 자산은 이번 실사 대상(고객향 홈페이지)과 별개이므로 병합 전략에서 건드리지 않는다.

---

## 3. 잔여 과업 분해 (우선순위 · 예상 크기)

| # | 과업 | 우선순위 | 크기 | 비고 |
|---|---|---|---|---|
| 1 | evidence-os-v10 브랜치를 orphan 상태에서 main 계열로 이식 (파일 복사 방식, `outputs/strat_site_mvp/` → 예: `homepage/` 또는 별도 배포 저장소) | P0 | M | merge-base 없어 일반 병합 불가. 새 브랜치에 파일 트리 통째로 checkout 후 커밋하는 방식 권장 |
| 2 | `strategy-v10/*` 데이터 재동기화 (브랜치 07-08 스냅샷 → main 07-09 최신본으로 교체) | P0 | S | 데이터 드리프트 210+53 라인 확인됨. `check_static_release.py` 재실행으로 정합성 검증 |
| 3 | strat.kr 도메인 용도 CEO 확인 (개인 브랜딩 동결 자산과 충돌 여부) | P0 | S (의사결정) | 배포 전 반드시 선행. 잘못 배포 시 되돌리기 어려움 |
| 4 | `internal/strategy-v10-source/` 누락분 복구 또는 배포 문서에서 참조 제거 | P1 | S | DEPLOY_CLOUDFLARE.md가 참조하나 브랜치에 미커밋 |
| 5 | Cloudflare 실배포 + `check_deployed_site.py` 재실행 + AWARD_QA_CHECKLIST.md 데스크톱 3종/모바일 3종 브레이크포인트 재확인 | P1 | M | 로컬 QA만 통과, 배포 도메인 QA 미수행 상태 |
| 6 | `/api/*` 엔드포인트 처리 방식 결정 (정적 전용이면 미작동 — Python 백엔드 별도 호스팅 vs Worker/API 라우트 대체) | P1 | M | RELEASE_STATUS.md "Next Best Work" 항목 |
| 7 | 콘텐츠 고도화 (`CONTENT_STRATEGY.md`, `CONTENT_REQUESTS.md` 기반) | P2 | L | 실적 콘텐츠는 제안서 코퍼스(34건)와 겹침 — 재사용 가능(메모리 project-portfolio 참조) |
| 8 | `codex/strategy-site-growth-mvp-state-20260701` 브랜치 삭제 (죽은 브랜치 정리) | P2 | S | CEO 1회 확인 후 실행 권장 |
| 9 | homepage-front-briefing 메모리 정정 (growth-mvp 브랜치 관련 서술 수정) | P2 | S | 본 감사 결과 반영 |

---

## 4. 브랜치 병합 전략 권고 (main-first 원칙)

1. **main을 유일한 진본 라인으로 유지한다.** evidence-os-v10은 orphan 히스토리이므로 `git merge`로 직접 합치면 불필요하게 무관한 12개 커밋과 그 변경사항 전체가 main 히스토리에 섞여 들어간다. 대신:
   - main에서 새 브랜치(예: `feat/homepage-strategy-site-import`)를 딴다.
   - evidence-os-v10의 `outputs/strat_site_mvp/`, `skills/strategy-homepage-growth/`, 관련 `outputs/STRAT_*` 설계 문서만 **파일 단위로 checkout/복사**하여 배치 (예: `git checkout origin/codex/strategy-site-evidence-os-v10-20260708 -- outputs/strat_site_mvp skills/strategy-homepage-growth`).
   - 이식 시 `strategy-v10/*` 데이터는 브랜치 스냅샷이 아니라 **main의 `portfolio/strategy_v10/` 최신본을 복사**해 덮어쓴다 (과업 #2와 연동).
   - 정상적인 PR 리뷰 절차를 거쳐 main에 병합한다.
2. **growth-mvp 브랜치는 병합하지 않는다.** 고유 콘텐츠가 없으므로 이식 대상에서 제외하고, 확인 후 삭제한다(과업 #8).
3. **배포는 별도 트랙.** 이식 커밋이 main에 들어간 뒤 `outputs/strat_site_mvp/static/`을 Cloudflare Pages(또는 결정된 타깃)에 업로드하는 배포 파이프라인은 코드 병합과 분리해서 진행한다 — 도메인 확인(과업 #3)이 배포의 게이트.
4. 이후 모든 홈페이지 작업은 evidence-os-v10 브랜치가 아니라 **main 기준 새 피처 브랜치**에서 진행한다 (README.md에 이미 명시된 Issue→Branch→PR→Review→Deploy→Measure→Learn 루프를 따름).

---

## 5. 메모리 정정 필요 사항

- `homepage-front-briefing` 메모리의 "두 브랜치가 각각 15% 자산을 담고 있다"는 전제는 부정확함. **실질 자산은 evidence-os-v10 브랜치 하나뿐**이며, growth-mvp 브랜치는 main에 완전히 흡수된 죽은 포인터다.
- "Strat.kr은 동결된 개인 브랜딩 자산, 혼동 금지"라는 기존 지침과 evidence-os-v10 브랜치의 실제 배포 타깃(`https://strat.kr/`)이 정면으로 충돌한다 — 이 메모리 자체가 최신 상태인지 CEO 확인 필요.
