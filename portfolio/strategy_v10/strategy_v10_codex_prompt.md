# Codex Master Prompt — STRATEGY Evidence OS v10

You are implementing STRATEGY Evidence OS v10.
This is not a generic portfolio page. It is an evidence-to-decision engine for a public-sector consulting firm.

## Read first
1. strategy_v10_planning_draft.md
2. strategy_v10_master_db.json
3. strategy_v10_records.jsonl
4. strategy_v10_people.json
5. strategy_v10_evidence_layers.json
6. strategy_v10_similarity_engine.json
7. strategy_v10_rfp_retrieval_schema.json
8. strategy_v10_visualization_schema.json
9. strategy_v10_forbidden_claims.json
10. strategy_v10_sample_gijang_output.json

## Mission
Build a system where homepage, proposal copy, visualizations, and RFP retrieval all come from the same evidence data.

## Non-negotiable rules
- Never expose previous company names.
- Never claim personal PM records as current company records.
- Hide years and amounts by default.
- Never aggregate contract amounts or client budget scale.
- Use 75조/10조/etc only as verified Anchor Scale Badges, never as a summed total.
- Direct > Adjacent > Indirect relevance is mandatory.
- Current company proof and evidence score can reorder only within the same relevance tier.
- Budget/headcount/performance changes require causality level before public use.
- Every selected case must explain why it is similar to the target.
- Every output must include forbidden/unsafe claims to avoid.

## Build tasks
1. Create data loader for strategy_v10_records.jsonl and associated JSON files.
2. Implement `retrieveSimilarCases(targetProfile, rfpKeywords)`.
3. Retrieval must return:
   - direct_cases
   - adjacent_cases
   - indirect_cases
   - why_similar
   - evidence_layer
   - safe_public_copy
   - proposal_copy
   - forbidden_claims
   - recommended_visuals
4. Build homepage sections:
   - Hero
   - Interactive Evidence Search
   - Trust Strip
   - Ministry x Theme Heatmap
   - Similarity Constellation Graph
   - Value Chain
   - Anchor Case Map
   - Person Evidence Card
   - Evidence Pyramid
   - Korea Map as secondary visual
5. Build sample output for target institution: 기장도시관리공단.
6. Add tests for forbidden claims:
   - previous company name exposure
   - claiming all records as company records
   - exposing years/amounts by default
   - budget/headcount causality claims

## UX principle
The user should feel: “This team has solved problems like ours, can prove it honestly, and the actual person is visible.”
