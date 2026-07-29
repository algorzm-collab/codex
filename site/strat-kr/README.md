# STRATEGY (`strat.kr`)

STRATEGY 공식 홈페이지의 독립 소스입니다. `algorzm-collab/codex` 저장소의
`site/strat-kr` 경로를 Cloudflare Pages와 연결해, `main` 변경 시 자동 배포합니다.

## 운영 구조

- 소스 및 변경 이력: GitHub (`algorzm-collab/codex`)
- 무료 호스팅 및 자동 배포: Cloudflare Pages
- 도메인 및 DNS: Cloudflare
- 상담폼: Cloudflare Pages Function (`/api/contact`) + Resend
- 상담 수신함: Cloudflare의 암호화된 환경변수로만 관리
- 회사 대표 메일: `ceo@strat.kr`

정적 결과물은 `public/`, 서버 코드는 `functions/`에 분리합니다. 비밀키는 GitHub에
커밋하지 않습니다.

## Adopted Legacy

- 채택 자산: 2026-07-29 현재 `https://strat.kr`에서 운영 중인 Genspark 제작
  STRATEGY 홈페이지의 정보 구조, 문구, 색상, 이미지와 섹션 구성
- 채택 이유: 기존 브랜드와 실적 표현을 보존하면서 특정 제작 플랫폼 의존성,
  고장 난 문의 폼, 모바일 오버플로와 과도한 이미지 용량만 제거하기 위함
- 변경 범위: 독립 정적 소스 복원, WebP 최적화, 반응형 보정, 접근성 보정,
  개인정보 동의, 실제 서버 발송, Cloudflare 배포 구조
- 제외 사항: 원본에서 회수할 수 없었던 인물 사진 4장은 허위 얼굴을 만들지 않고
  중립적 프로필 자리표시자로 대체

## 디자인 기준

- 기준 화면: 기존 운영 사이트 `https://strat.kr`
- 디자인 토큰: `public/css/design-tokens.css`
- 컴포넌트 스타일: `public/css/style.css`
- 비교 검증: `qa/README.md`

## Cloudflare Pages 설정

| 항목 | 값 |
|---|---|
| Production branch | `main` |
| Framework preset | `None` |
| Root directory | `site/strat-kr` |
| Build command | `exit 0` |
| Build output directory | `public` |

프로젝트 변수:

- 암호화 Secret: `RESEND_API_KEY`
- 암호화 Secret: `CONTACT_TO_EMAIL` = 실제 수신 Gmail
- 일반 변수: `CONTACT_FROM_EMAIL` = `STRATEGY 웹사이트 <website@strat.kr>`

Production과 Preview 환경에 각각 등록한 뒤 다시 배포합니다.

## 로컬 확인

```bash
npm test
```

정적 화면은 `public/`을 로컬 HTTP 서버로 열어 확인합니다. 문의 API는 Pages
Functions 런타임에서 동작하며, 단위 테스트는 동일한 Web `Request`/`Response`
인터페이스를 사용합니다.

## 무중단 전환 원칙

1. Pages의 `*.pages.dev` 미리보기에서 화면과 실제 문의 전송을 먼저 확인합니다.
2. 검증 전에는 `strat.kr`의 현재 웹 DNS를 변경하지 않습니다.
3. 승인 후 Pages의 **Custom domains** 메뉴에서만 `strat.kr`을 연결합니다.
4. Cloudflare가 관리하는 기존 MX/TXT 메일 레코드는 별도로 유지·검증합니다.
