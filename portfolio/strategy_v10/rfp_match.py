# -*- coding: utf-8 -*-
"""[상태: 검증 하네스로 강등 — 2026-07-09 CTO]
정식 엔진은 Documents/Codex/2026-06-30/so/strategy_v10_evidence_engine.py (Codex 레거시, 384줄)이다.
이 파일은 중복 제작이었으나 기장 골드셋 검증을 통과한 유일한 구현이므로 검증 하네스로만 유지.
회수된 지식: 직접 tier = 기관계열(institution_class) 일치 필수. 평가군 일치만으로는 인접(adjacent). (골드셋 TR-001 경계 사례)
→ 후속 작업: 레거시 엔진을 이 골드셋으로 검증하고, 경계 규칙 불일치 시 레거시 쪽에 이식.

RFP 유사실적 매칭 엔진 v1 (순수 파이썬, LLM 0, strategy_v10 스키마 준수)
사용법: python rfp_match.py --institution "기장도시관리공단" --title "조직진단 및 경영효율화" --keywords 조직진단 성과평가 적정인력
정책: tier(직접>인접>간접)가 evidence score보다 우선. score는 같은 tier 내 정렬 보정만. (evidence_layers.json rank_rule)
"""
import json, argparse, math, re, sys, os, collections

BASE = os.path.dirname(os.path.abspath(__file__))
sys.stdout.reconfigure(encoding="utf-8")

def bigrams(text):
    t = re.sub(r"\s+", " ", text.lower())
    return collections.Counter(t[i:i+2] for i in range(len(t)-1) if t[i:i+2].strip())

def cosine(c1, c2):
    common = set(c1) & set(c2)
    num = sum(c1[k]*c2[k] for k in common)
    den = math.sqrt(sum(v*v for v in c1.values())) * math.sqrt(sum(v*v for v in c2.values()))
    return num/den if den else 0.0

# 기관 유형 추론 규칙 (이름 패턴 → 레코드 실제 어휘. 어휘 출처: records.jsonl institution_classes)
INST_RULES = [
    (r"도시관리공단|시설관리공단|시설공단", ["local_facility_management_corporation"], "local_public_enterprise_or_facility_management_group"),
    (r"도시공사|개발공사|주택", ["urban_development_housing_corporation"], "local_public_enterprise_or_facility_management_group"),
    (r"진흥원|테크노파크", ["industry_promotion_agency", "promotion_agency"], None),
    (r"공단$|공사$", ["public_service_corporation_or_quasi_government", "soc_transport_public_operator"], None),
    (r"금융|보증|기금|신용", ["policy_finance_guarantee_institution"], None),
    (r"연구원|연구소", ["rd_specialized_research_institution"], None),
    (r"재단", ["foundation", "foundation_or_local_affiliated_institution"], None),
    (r"원자력|에너지|전력", ["energy_nuclear_safety_institution"], None),
]

def infer_institution(name):
    # 첫 매칭 규칙만 적용 (구체적 규칙이 앞에 — 중복 매칭 시 과확장 방지)
    for pat, cls, grp in INST_RULES:
        if re.search(pat, name):
            return cls, grp
    return [], None

def tier_of(rec, q_classes, q_group, kw_hits):
    """직접: 기관계열 일치 + 테마 접점 / 인접: 평가군·기능 일치 or 강한 테마 / 간접: 방법론 접점만"""
    inst_match = bool(set(rec.get("institution_classes") or []) & set(q_classes))
    group_match = q_group and rec.get("evaluation_group") == q_group
    if inst_match and kw_hits >= 1: return "direct"  # 직접 = 동일 기관계열 + 테마 접점 (골드셋 검증 기준)
    if inst_match or group_match or kw_hits >= 2: return "adjacent"
    if kw_hits >= 1: return "indirect"
    return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--institution", required=True)
    ap.add_argument("--title", default="")
    ap.add_argument("--keywords", nargs="*", default=[])
    ap.add_argument("--top", type=int, default=5)
    args = ap.parse_args()

    records = [json.loads(l) for l in open(os.path.join(BASE, "strategy_v10_records.jsonl"), encoding="utf-8") if l.strip()]
    forbidden = json.load(open(os.path.join(BASE, "strategy_v10_forbidden_claims.json"), encoding="utf-8"))

    q_classes, q_group = infer_institution(args.institution)
    query_text = f"{args.institution} {args.title} {' '.join(args.keywords)}"
    qv = bigrams(query_text)
    kws = [k.lower() for k in args.keywords] + ([args.title.lower()] if args.title else [])

    tiers = {"direct": [], "adjacent": [], "indirect": []}
    for rec in records:
        blob = (rec.get("rfp_search_text") or "") + " " + " ".join(rec.get("theme_buckets_kr") or [])
        kw_hits = sum(1 for k in args.keywords if k.lower() in blob.lower())
        t = tier_of(rec, q_classes, q_group, kw_hits)
        if not t: continue
        sim = cosine(qv, bigrams(blob))
        # tier 내 정렬: 텍스트 유사도 0.7 + 증거점수 0.3 (rank_rule 준수)
        rank = sim * 0.7 + (rec.get("evidence_score") or 0) / 100 * 0.3
        why = []
        if set(rec.get("institution_classes") or []) & set(q_classes): why.append("동일 기관계열")
        if q_group and rec.get("evaluation_group") == q_group: why.append("동일 경영평가군")
        hit_kw = [k for k in args.keywords if k.lower() in blob.lower()]
        if hit_kw: why.append("과업테마 접점(" + "·".join(hit_kw[:3]) + ")")
        tiers[t].append({
            "record_id": rec["record_id"], "client": rec.get("client_public"),
            "title": rec.get("project_title_public"),
            "proof_label": rec.get("proof_public_label_v10"),
            "evidence_layer": rec.get("evidence_layer"),
            "why_similar": " + ".join(why) or "방법론 유사",
            "safe_claim": (rec.get("safe_claim_templates") or {}).get("proposal", ""),
            "_rank": round(rank, 4),
        })
    for t in tiers: tiers[t] = sorted(tiers[t], key=lambda x: -x["_rank"])[:args.top]

    out = {
        "target_profile": {
            "target_institution": args.institution,
            "inferred_classes": q_classes, "inferred_evaluation_group": q_group,
            "retrieval_policy": "직접 > 인접 > 간접. evidence score는 같은 tier 내 보정만.",
        },
        "direct_cases": tiers["direct"], "adjacent_cases": tiers["adjacent"], "indirect_cases": tiers["indirect"],
        "forbidden_claims": [f["claim"] for f in forbidden["forbidden_claims"]],
    }
    print(json.dumps(out, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    main()
