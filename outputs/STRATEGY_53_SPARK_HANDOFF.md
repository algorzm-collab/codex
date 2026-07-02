# STRATEGY Homepage - 5.3 Spark Handoff

## Mission

Build the `strategy` consulting homepage as a growth-driven problem diagnosis product, not a traditional consulting firm brochure.

The site must make visitors feel:

1. "This firm understands my organizational problem."
2. "They have solved similar problems before."
3. "I should ask them to diagnose my issue."

## Fixed Direction

- Company name: `strategy`
- Source content: existing `strat.kr`, provided performance list, LinkedIn/profile context
- Core positioning: problem-solving strategy consulting
- Core philosophy: Sein & Sollen, Fermat Point, practical problem diagnosis
- Growth philosophy: visitor journey should move from problem recognition to proof to inquiry
- Best single reference: Linear (`https://linear.app/`)

## Non-Negotiable Constraints

- Do not add new libraries.
- Do not touch DB/schema/auth/payment unless the user explicitly asks.
- Do not do unrelated refactoring.
- Preserve existing admin functionality.
- Keep the site lightweight, dynamic, and conversion-focused.
- Report in Korean using:
  - 변경한 파일
  - 실제로 해결한 것
  - 테스트 결과
  - 아직 불확실한 것

## Current Product Surface

Public site:

- Hero
- Issue Finder / problem diagnosis
- Problem Mirror
- Flagship proof panels
- Cases
- Services
- Company
- People
- Track record
- Slides
- Signup
- QA
- Contact

Admin:

- Cases
- Slides
- Project records
- Users
- Mailing
- Issue records
- Inquiries
- QA
- Events
- Conversion Journey View by `session_id`

## Priority Development Order

1. Strengthen the public homepage first impression.
2. Upgrade Issue Finder result into a diagnosis report style.
3. Make the six flagship proof panels feel premium and decisive.
4. Connect every major CTA to inquiry/contact.
5. Preserve event tracking and admin journey analysis.

## Public Homepage Improvements

Hero must communicate:

- `strategy` helps leaders clarify the real problem before selling a solution.
- The homepage is an entry point for diagnosis, not a PDF brochure.
- Main CTA should feel like "diagnosis request", not generic "contact us".

Recommended CTA labels:

- `내 문제 진단하기`
- `유사 실적 기반으로 문의하기`
- `전략/조직/성과관리 이슈 상담하기`

Avoid:

- Generic consulting claims
- Abstract slogans without proof
- Heavy corporate brochure tone
- Outdated card-heavy layouts

## Issue Finder Requirements

The Issue Finder should feel like a "problem inference interview".

Result must include:

1. Inferred problem type
2. Why this may be happening
3. Relevant flagship proof
4. Hypothetical solution direction
5. Inquiry CTA connected to the diagnosis context

Do not position this as a downloadable report collector. The goal is to make the visitor ask the company for a deeper diagnosis.

## Six Flagship Proof Panels

Use these as priority flagship cases:

- 신용보증기금 뉴비전
- 해양진흥공사 중장기 경영전략
- 주택금융공사 성과평가
- 올림픽 레거시 / 강원도개발공사
- 도공 미래전략 / UAM / 드론 / 도로산업
- UAM Team Korea 관련 전략 과제

Each proof panel should show:

- Client / domain
- Problem situation
- Strategic difficulty
- Approach
- Output value
- Related visitor problem
- CTA to diagnosis/inquiry

Be careful with confidentiality. Prefer credible public-level framing over exaggerated confidential details.

## Growth Analytics

Important events:

- `hero_cta_click`
- `issue_start`
- `issue_complete`
- `proof_view`
- `case_cta_click`
- `contact_start`
- `inquiry_submit`

Admin should help answer:

- Which problem types appear most often?
- Which proof panels drive inquiry intent?
- Where do visitors drop off?
- What journey paths lead to conversion?

## UI / UX Direction

Reference: Linear.

Why:

- Modern B2B clarity
- Product-like interaction
- Sharp information hierarchy
- Calm but high-quality motion
- Trust without old consulting brochure style

Design principles:

- First screen must feel premium and alive.
- Copy must be short, sharp, and problem-led.
- Motion should support focus, not decoration.
- Mobile CTA must remain obvious.
- Use proof and diagnosis flow as the main interface.

## Recommended Decisions

- Brand first: make `strategy` the main brand.
- Personal credibility second: position 김정성 as the visible problem-solving strategy consultant in People/Founder sections.
- CTA tone: prefer `진단` over generic `상담`.
- Case disclosure: use client name + problem type + public-level approach; avoid confidential quantitative claims unless provided.

## Immediate Next Sprint

Sprint 06: Public Conversion Upgrade

Scope:

- Improve hero copy and CTA hierarchy.
- Rewrite Issue Finder result screen.
- Strengthen six flagship proof panel copy.
- Add inquiry CTAs from proof/result sections.
- Ensure event tracking remains attached to core CTAs.

Success condition:

- A visitor can understand the value within 5 seconds.
- A visitor can identify their problem within 60 seconds.
- A visitor sees at least one relevant proof before contact.
- Inquiry feels like the natural next step.

## Files Most Likely To Edit

- `outputs/strat_site_mvp/static/index.html`
- `outputs/strat_site_mvp/static/styles.css`
- `outputs/strat_site_mvp/static/app.js`

Avoid backend edits unless necessary.

## Validation

Run when relevant:

```powershell
node --check outputs/strat_site_mvp/static/app.js
node --check outputs/strat_site_mvp/static/admin.js
```

Run Python compile only if backend changes:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m py_compile outputs\strat_site_mvp\app.py
```

## Spark Prompt

```text
너는 strategy consulting homepage MVP의 구현 담당자다.

목표:
홈페이지를 전통 컨설팅 회사 소개 페이지가 아니라,
방문자가 자기 문제를 발견하고 관련 실적을 확인한 뒤 문의하게 만드는
그로스해킹 기반 문제진단형 컨설팅 사이트로 고도화한다.

절대 원칙:
- 새 라이브러리 추가 금지
- DB/schema/auth/payment 건드리지 말 것
- 관련 없는 리팩토링 금지
- 기존 Admin 기능 깨지지 않게 유지
- Public UX/UI와 문의전환 흐름을 우선 개발

우선 개발:
1. Hero 메시지를 문제진단형으로 강화
2. Issue Finder 결과를 문제추론 + 관련실적 + 가설솔루션 + 문의CTA 구조로 개선
3. 대표 실적 6개를 Proof Panel로 더 강하게 노출
4. 모든 핵심 CTA를 contact/inquiry 흐름으로 연결
5. 이벤트 추적 함수가 있으면 핵심 CTA에 연결

대표 실적:
- 신용보증기금 뉴비전
- 해양진흥공사 중장기 경영전략
- 주택금융공사 성과평가
- 올림픽 레거시/강원도개발공사
- 도공 미래전략/UAM/드론/도로산업
- UAM Team Korea 관련 전략 과제

레퍼런스:
Linear 수준의 선명하고 제품적인 B2B UX.
단, 카피와 구조는 strategy의 문제해결 컨설팅에 맞춘다.

마지막 보고 형식:
- 변경한 파일
- 실제로 해결한 것
- 테스트 결과
- 아직 불확실한 것
```
