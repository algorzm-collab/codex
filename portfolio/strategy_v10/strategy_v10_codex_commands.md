# STRATEGY Evidence OS v10 — Git/Codex Commands

## 0. 현재 상태
GitHub repo URL이 없으므로 여기서 직접 fork/PR은 수행하지 않는다. 아래 명령어를 기존 홈페이지 또는 제안서 생성 repo에서 실행한다.

## 1. 브랜치 생성
```bash
git checkout -b feat/strategy-evidence-os-v10
mkdir -p data/strategy-evidence/v10 docs/strategy-evidence/v10
```

## 2. 번들 압축 해제 및 복사
```bash
unzip strategy_codex_v10_evidence_os_bundle.zip -d /tmp/strategy-v10
cp /tmp/strategy-v10/*.json data/strategy-evidence/v10/
cp /tmp/strategy-v10/*.jsonl data/strategy-evidence/v10/
cp /tmp/strategy-v10/*.csv data/strategy-evidence/v10/
cp /tmp/strategy-v10/*.md docs/strategy-evidence/v10/
```

## 3. Codex에게 내릴 첫 명령
```text
Read docs/strategy-evidence/v10/strategy_v10_codex_prompt.md and docs/strategy-evidence/v10/strategy_v10_planning_draft.md.
Implement STRATEGY Evidence OS v10.
Use the V10 JSON/JSONL/CSV files as source data.
Build homepage visual sections and an RFP retrieval utility.
Do not expose previous company names, years, amounts, or unsupported impact claims.
```

## 4. 구현 우선순위
```text
1. Data loader
2. retrieveSimilarCases(targetProfile, rfpKeywords)
3. Safe copy generator
4. 기장도시관리공단 sample rendering
5. Homepage visual sections
6. Forbidden claim tests
```

## 5. 커밋
```bash
git add data/strategy-evidence/v10 docs/strategy-evidence/v10
git commit -m "Add STRATEGY Evidence OS v10 planning and data"
```

## 6. 내가 직접 GitHub 작업을 하려면 필요한 정보
- 대상 repo URL
- 기본 브랜치명
- 홈페이지 기술스택: Next.js / Vite / Astro / plain HTML 등
- 데이터 저장 위치 선호: /data, /content, /src/data
```
