const TRACKED_EVENTS = new Set([
  "hero_cta_click",
  "issue_start",
  "issue_finder_start",
  "issue_step_select",
  "issue_step_next",
  "issue_complete",
  "issue_result_view",
  "proof_view",
  "proof_jump_click",
  "case_cta_click",
  "case_contact_cta_click",
  "contact_start",
  "contact_form_start",
  "inquiry_submit",
  "qa_submit",
  "contact_form_submit",
]);

const EVENT_ALIAS = {
  hero_cta_click: "hero_cta_click",
  issue_start: "issue_start",
  issue_step_select: "issue_step_select",
  issue_step_next: "issue_step_next",
  issue_complete: "issue_complete",
  proof_view: "proof_view",
  case_cta_click: "case_cta_click",
  contact_start: "contact_start",
  inquiry_submit: "inquiry_submit",
  qa_submit: "qa_submit",
  issue_finder_start: "issue_start",
  issue_result_view: "issue_complete",
  proof_jump_click: "proof_jump_click",
  case_contact_cta_click: "case_cta_click",
  contact_form_start: "contact_start",
  contact_form_submit: "inquiry_submit",
};

const INQUIRY_ROUTE_LABEL_BY_ROUTE = {
  issue_result: "진단 결과 기반 문의",
  journey: "전환 단계 안내 진입",
  journey_finder: "문제 진단부터 진입",
  journey_case_radar: "실적 유사도 지도 기반 탐색",
  journey_credential: "대표 실적 증명 축적 검토",
  journey_method: "방법론 기반 실행 설계 검토",
  journey_people: "전문가/역할 구성 확인",
  journey_contact: "직접 진단 미팅 요청",
  flagship_case: "핵심 실적 기반 문의",
  cases_overview: "실적 전체 비교 후 문의",
  contact_nav: "상단 네비게이션 문의",
  case_grid: "사례 카드 기반 문의",
  case_radar: "전략 난도 지도 기반 문의",
  case_universe: "실적 우주 네트워크 기반 문의",
  case_study_filter: "문제유형 필터 기반 문의",
  conversion_rail: "진단→증거→문의 전환 링크",
  conversion_engine: "전환 엔진 기반 문의",
  conversion_plan_bridge: "진단 맵 → 실적 중심 전환",
  hero: "첫 화면에서 진단 시작 후 문의",
  decision_brief: "3대 문제유형 기반 문의",
  representative_proofline: "대표 실적 기반 진단 문의",
  case_study_lab: "문제유형-유사사례 기반 문의",
  problem_mirror: "문제 스냅샷 진단 문의",
  diagnosis_dock: "실시간 진단 도크 문의",
  direct: "일반 문의",
  issue_finder: "이슈 파인더 기반 진단 문의",
  conversion_plan: "진단 결과 후 실행 전환",
  case_overview_link: "진단 유형 실적 비교",
  route_bridge: "진단 결과 기반 실적 이동",
};

const INQUIRY_MESSAGE_TEMPLATE_BY_ROUTE = {
  journey: "전환 단계 안내 템플릿",
  issue_result: "진단 결과 기반 문의 템플릿",
  journey_finder: "문제 진단 시작 템플릿",
  journey_case_radar: "실적 우주형 지도 탐색 템플릿",
  journey_credential: "실적 증명 스택 검토 템플릿",
  journey_method: "방법론 실전 적용 검토 템플릿",
  journey_people: "전문가 역량 매칭 템플릿",
  journey_contact: "대표 진단 미팅 요청 템플릿",
  flagship_case: "핵심 실적 기반 문의 템플릿",
  cases_overview: "실적 전체 보면서 문의 템플릿",
  case_grid: "사례 카드 기반 문의 템플릿",
  case_radar: "전략 난도 지도 기반 문의 템플릿",
  case_universe: "실적 우주 네트워크 기반 문의 템플릿",
  case_study_filter: "문제유형 필터 기반 문의 템플릿",
  conversion_rail: "진단-증거-문의 전환 흐름 기반 문의 템플릿",
  conversion_engine: "전환 엔진 기반 문의 템플릿",
  conversion_plan_bridge: "결과 맵 기반 실행 전환 템플릿",
  contact_nav: "상단 네비게이션 문의 템플릿",
  hero: "첫 화면 진단 요청 템플릿",
  decision_brief: "3대 문제유형 기반 문의 템플릿",
  representative_proofline: "대표 실적 기반 진단 템플릿",
  diagnosis_dock: "실시간 진단 요약 기반 문의 템플릿",
  problem_mirror: "문제 스냅샷 기반 문의 템플릿",
  case_study_lab: "문제유형-유사사례 기반 문의 템플릿",
  direct: "일반 문의 템플릿",
  issue_finder: "이슈 파인더 기반 진단 템플릿",
  conversion_plan: "진단 결과 기반 실행 전환 템플릿",
  case_overview_link: "실적 비교 기반 다음 단계 진입 템플릿",
  route_bridge: "진단 맵 기반 다음 단계 템플릿",
};

const state = {
  userId: localStorage.getItem("strat_user_id") || null,
  sessionId: localStorage.getItem("strat_session_id") || crypto.randomUUID(),
  step: 0,
  answers: {},
  inferredType: "",
  inferredConfidence: 0,
  inferenceScores: {},
  selectedProblem: "",
  inquiryContext: { source: "direct", route: "", sourceTitle: "", sourceId: "", inferredType: "", caseContext: "" },
};
localStorage.setItem("strat_session_id", state.sessionId);
const $ = (selector) => document.querySelector(selector);
const requiredRoot = document.getElementById("home");
if (!requiredRoot) {
  throw new Error("STRATEGY site root is missing");
}

const caseInferenceScores = {
  strategy_org_performance_gap: "전략·성과 정렬 미흡",
  rr_role_confusion: "조직 R&R 혼선",
  performance_system_failure: "성과체계 실패",
  transformation_execution_gap: "전환 실행 공백",
  job_capability_gap: "인력·직무 정렬 미흡",
};
const caseInferenceTieBreak = {
  strategy_org_performance_gap: 4,
  rr_role_confusion: 3,
  performance_system_failure: 3,
  transformation_execution_gap: 2,
  job_capability_gap: 5,
};

function inferLabel(inferredType) {
  return caseInferenceScores[inferredType] || "미확인 진단 유형";
}

const steps = [
  { key: "symptom", label: "STEP 1 / 3", question: "현재 가장 큰 운영 병목이 어디인가요?", options: [["report_no_execution", "보고서는 있는데 실행 체계가 없음"], ["unclear_owner", "책임주체·권한이 불명확"], ["too_many_kpi", "KPI가 과다해 우선순위가 흔들림"], ["evaluation_not_accepted", "성과 결과가 조직에 공유되지 않음"], ["reorg_no_standard", "조직 변화가 기준 없이 진행됨"], ["transformation_not_actionable", "AI/ESG 전략은 있었지만 실행되지 않음"]] },
  { key: "scene", label: "STEP 2 / 3", question: "문제가 자주 발생하는 장면은 어디인가요?", options: [["decision_meeting", "의사결정 회의에서 전략이 반복 수정됨"], ["cross_team", "부서 간 협업에서 병목"], ["kpi_evaluation", "KPI와 평가의 목적이 맞지 않음"], ["org_role", "조직 역할/담당 범위가 겹침"], ["hr_capability", "인력/역량 배치가 전략과 정렬되지 않음"], ["external_policy", "정책·외부환경 반영이 부족함"]] },
  { key: "need", label: "STEP 3 / 3", question: "우리가 바꿔야 할 산출물은 무엇인가요?", options: [["internal_logic", "전략-실행 논리 정렬 필요"], ["scope_before_project", "사업 범위와 성공기준 재정의"], ["strategy_to_execution", "전략을 실행 계획으로 즉시 전개"], ["org_kpi_alignment", "조직 KPI와 목표 동기화"], ["not_sure", "진단 결과를 더 구체화하고 싶음"]] },
];

const routeBySymptom = {
  report_no_execution: "strategy_org_performance_gap",
  unclear_owner: "rr_role_confusion",
  too_many_kpi: "performance_system_failure",
  evaluation_not_accepted: "performance_system_failure",
  reorg_no_standard: "rr_role_confusion",
  transformation_not_actionable: "transformation_execution_gap",
};
const sceneWeights = {
  decision_meeting: { strategy_org_performance_gap: 2, rr_role_confusion: 1 },
  cross_team: { rr_role_confusion: 2, strategy_org_performance_gap: 1 },
  kpi_evaluation: { performance_system_failure: 2, strategy_org_performance_gap: 1 },
  org_role: { rr_role_confusion: 2 },
  hr_capability: { rr_role_confusion: 1, job_capability_gap: 3 },
  external_policy: { strategy_org_performance_gap: 2, transformation_execution_gap: 1 },
};
const needWeights = {
  internal_logic: { strategy_org_performance_gap: 2 },
  scope_before_project: { strategy_org_performance_gap: 1, performance_system_failure: 1, transformation_execution_gap: 1 },
  strategy_to_execution: { strategy_org_performance_gap: 2, performance_system_failure: 1 },
  org_kpi_alignment: { performance_system_failure: 2, rr_role_confusion: 1 },
  not_sure: { strategy_org_performance_gap: 1, rr_role_confusion: 1, performance_system_failure: 1, transformation_execution_gap: 1, job_capability_gap: 1 },
};

const inferenceNarrative = {
  strategy_org_performance_gap: { title: "전략은 있으나 실행으로 번역되지 않는 상태", why: "대부분의 실패는 전략 부재가 아니라 전략-조직-성과 사이의 번역 실패에서 시작됩니다.", hypothesis: ["상위 전략이 부서 과제와 KPI로 내려오며 의미가 희석됐을 가능성이 큽니다.", "의사결정권자, 실행책임자, 성과관리자가 같은 지도를 보고 있지 않을 수 있습니다."], proofHint: "금융·해양·보증기관에서 전략과 성과체계를 동시에 다룬 실적이 우선 매칭됩니다.", outcomeHint: "첫 미팅에서는 전략 문구보다 실행 책임체계, KPI 계보, 우선순위 충돌을 먼저 검증합니다.", cta: "대표 진단 요청" },
  rr_role_confusion: { title: "조직이 움직이지 않는 진짜 이유는 R&R일 가능성", why: "조직 문제는 박스 이동보다 권한, 책임, 판단 기준의 불일치에서 발생합니다.", hypothesis: ["역할은 존재하지만 최종 판단권과 실행 책임이 분리되어 있을 수 있습니다.", "부서 간 협업 실패가 아니라 조직 설계 원칙의 부재가 병목일 수 있습니다."], proofHint: "지역개발·레거시·조직재설계처럼 이해관계가 복잡한 과제가 우선 매칭됩니다.", outcomeHint: "첫 미팅에서는 조직도보다 의사결정 흐름, 중복 업무, 책임 공백을 먼저 확인합니다.", cta: "조직 병목 진단 요청" },
  performance_system_failure: { title: "성과관리 체계가 현장을 움직이지 못하는 상태", why: "지표가 많아질수록 조직은 더 명확해지는 것이 아니라 책임을 회피하기 쉬워집니다.", hypothesis: ["KPI가 전략적 판단보다 평가 방어용 목록으로 변했을 가능성이 있습니다.", "성과평가 결과가 다음 실행 조정으로 이어지는 학습 루프가 약할 수 있습니다."], proofHint: "주택금융·정책금융·공공 성과평가 운영처럼 지표와 평가를 연결한 사례가 우선 매칭됩니다.", outcomeHint: "첫 미팅에서는 지표 수보다 지표의 판단력, 평가 수용성, 운영 루프를 먼저 봅니다.", cta: "성과체계 진단 요청" },
  transformation_execution_gap: { title: "AI·ESG·UAM 전략이 실행 단계에서 멈춘 상태", why: "미래전략은 발표보다 운영 전환이 어렵습니다. 파일럿 이후 누가 무엇을 판단할지가 핵심입니다.", hypothesis: ["기술 과제가 조직 책임, 예산, 평가 기준과 연결되지 않았을 수 있습니다.", "파일럿의 성공 기준과 확산 판단 기준이 분리되어 실행 속도가 느려졌을 수 있습니다."], proofHint: "도로 인프라·미래 모빌리티·AI 전략 과제처럼 미래사업 실행전환 실적이 우선 매칭됩니다.", outcomeHint: "첫 미팅에서는 기술 트렌드보다 실행 주체, 전환 로드맵, 확산 판단 기준을 검증합니다.", cta: "미래전략 실행 진단 요청" },
  job_capability_gap: {
    title: "전략은 있는데 사람/역할이 따라가지 못하는 상태",
    why: "전략·조직·성과는 같아도, 사람의 역할·능력·평가 기대치가 맞지 않으면 실행이 멈춥니다.",
    hypothesis: ["성과 기준은 있지만 직무 역량·책임 선이 실제 배치와 맞지 않을 가능성이 큽니다.", "인력·직무 가중치가 전략 우선순위와 맞지 않아 실행 속도가 분산되었을 수 있습니다."],
    proofHint: "직무 재정렬, 조직 설계, 성과 책임 조정이 함께 필요한 과제가 우선 매칭됩니다.",
    outcomeHint: "첫 미팅에서는 의사결정권, 권한, 인력 운용의 경로를 동시에 고정해 실무 실행 정합성을 먼저 봅니다.",
    cta: "인력·역량 정렬 진단 요청",
  },
};

const flagshipProofByType = {
  strategy_org_performance_gap: { id: "proof-1", title: "주택금융공사(주금공) 성과관리체계 고도화", label: "전략·성과 정렬" },
  rr_role_confusion: { id: "proof-4", title: "지역개발공사(도공) 올림픽 레거시 활용전략", label: "R&R 정합성 개선" },
  performance_system_failure: { id: "proof-3", title: "해양진흥공사 중장기 경영전략 수립", label: "성과 운영 설계" },
  transformation_execution_gap: { id: "proof-6", title: "UAM 팀코리아 미래전략·확산 실행", label: "AI/ESG 실행 전환" },
  job_capability_gap: { id: "proof-4", title: "지역개발공사(도공) 올림픽 레거시 활용전략", label: "인력·직무 정렬" },
};
const flagshipProofNarrative = {
  strategy_org_performance_gap: {
    outcome: "우선순위 정렬, KPI 정렬, 의사결정권한 구조를 한 번에 묶어 전략이 실행으로 내려가게 만드는 흐름입니다.",
    hardQuestion: "전략 문구를 바꿔야 하나요? 아니면 의사결정 기준과 실행 책임부터 고정해야 하나요?",
  },
  rr_role_confusion: {
    outcome: "권한·책임·협의 체인을 재정의해 조직의 병목을 줄인 사례 유형으로, 큰 과제에서 재현성이 높습니다.",
    hardQuestion: "누가 의사결정권을 갖고, 누가 마지막 실행책임을 지는지가 분명한가요?",
  },
  performance_system_failure: {
    outcome: "성과지표를 점수표가 아닌 기관의 운영 판단 루프로 전환해, 현장 운영이 즉시 조정 가능한 구조로 개선한 케이스입니다.",
    hardQuestion: "KPI가 많아지는 순간 성과결정은 더 빨라질까요, 더 느려질까요?",
  },
  transformation_execution_gap: {
    outcome: "파일럿·확산·확장 판단 기준을 동시에 고정해 미래사업 과제가 실행 정지 없이 운영 모드로 넘어가게 만든 유형입니다.",
    hardQuestion: "실행 주체와 확산 기준이 분명해지지 않으면 기술 과제가 왜 정체되는지 보셨나요?",
  },
  job_capability_gap: {
    outcome: "전략은 유지하되 인력·직무·성과 축을 한 번에 묶어 실행 저항을 낮추는 데 중점을 둔 과제입니다.",
    hardQuestion: "현재 전략의 난이도에 맞게 인력·직무·보상이 정렬되어 있습니까?",
  },
};

const flagshipPanelFallback = {
  hardQuestion: "현재 병목을 가장 먼저 가릴 실행 의사결정 포인트를 먼저 분리해 정렬해야 합니다.",
  outcome: "문제 진단을 실행 질문으로 전환해 우선순위, 책임, 성과축을 다시 연결한 과제입니다.",
};
const conversionEngineBlueprint = {
  strategy_org_performance_gap: {
    stage: ["진단 유형", "핵심 증거", "첫 질문"],
    anchor: "전략 문장을 실행 가능한 과제 단위로 번역하는가?",
    cta: "실행 번역 진단 요청",
  },
  rr_role_confusion: {
    stage: ["진단 유형", "책임축 추적", "첫 질문"],
    anchor: "R&R과 의사결정 흐름을 같은 지도에서 보는가?",
    cta: "R&R 병목 진단 요청",
  },
  performance_system_failure: {
    stage: ["진단 유형", "성과수용 축적", "첫 질문"],
    anchor: "성과 지표가 현장 판단과 운영 루프로 이어지는가?",
    cta: "성과체계 진단 요청",
  },
  transformation_execution_gap: {
    stage: ["진단 유형", "전환 실행 조건", "첫 질문"],
    anchor: "기술 파일럿 이후 확산 기준이 분명한가?",
    cta: "미래전략 실행 진단 요청",
  },
  job_capability_gap: {
    stage: ["진단 유형", "역할-역량 진단", "첫 질문"],
    anchor: "역할, 권한, 인력 배치가 전략 우선순위와 일치하는가?",
    cta: "인력·직무 정렬 진단 요청",
  },
};
const conversionEngineLabels = {
  stageType: "유형 선택",
  stageEvidence: "추천 실적",
  stageQuestion: "대표가 우선 확인할 질문",
  fallbackEvidence: "관련 실적 후보군",
  fallbackQuestion: "현장 기준을 먼저 정렬할 질문을 제시합니다.",
};

function toText(value) { return String(value || "").trim(); }
function getOptionLabel(stepKey, value) {
  const step = steps.find((item) => item.key === stepKey);
  if (!step || !Array.isArray(step.options)) return toText(value);
  const found = step.options.find(([optionValue]) => optionValue === value);
  return toText(found?.[1] || value);
}

const caseDifficultyLabelByType = {
  strategy_org_performance_gap: "높음",
  rr_role_confusion: "매우 높음",
  performance_system_failure: "중간",
  transformation_execution_gap: "중~상",
  job_capability_gap: "높음",
};

function resolveProofDifficulty(typeKey, item = {}) {
  const inferredType = toText(typeKey || "").trim();
  const title = toText(item.problem).length + toText(item.approach).length;
  if (title >= 220 || inferredType === "transformation_execution_gap") return "높음";
  if (title >= 140 || inferredType === "rr_role_confusion") return "매우 높음";
  return caseDifficultyLabelByType[inferredType] || "중간";
}

function buildDiagnosisEvidence() {
  const entries = steps
    .map(({ key, label }) => {
      const selected = toText(state.answers[key]);
      if (!selected) return "";
      const text = getOptionLabel(key, selected);
      return `<li><span>${label}</span><b>${text}</b></li>`;
    })
    .filter(Boolean);
  if (!entries.length) return "";
  return `
    <div class="diagnosis-block diagnosis-evidence">
      <p><b>문진 인터뷰 요약</b></p>
      <ul class="result-checklist">${entries.join("")}</ul>
    </div>
  `;
}
function disclosureLevel(item) { return toText(item?.disclosure_level || item?.disclosure || "masked"); }
function clientCategory(item) { return stripPublicUnsafeText(resolveCaseField(item, "client_category", "customer_type", "client_type", "sector", "theme") || "비공개 기관"); }
function caseTitle(item) { return stripPublicUnsafeText(item?.masked_title || item?.public_title || item?.alias_title || item?.title || item?.project_title || clientCategory(item) || "관련 실적"); }
function publicProjectTitle(item, index = 0) {
  const title = caseTitle(item);
  if (title && title !== "관련 실적") return title;
  const category = clientCategory(item);
  const theme = resolveCaseField(item, "theme", "solution_cluster", "problem_name");
  return `${category} ${theme || "전략 과제"} ${index ? `#${index}` : ""}`.trim();
}
function disclosureTag(item) {
  const level = disclosureLevel(item);
  if (level === "public") return "실명 공개";
  if (level === "internal") return "비공개";
  return "익명 공개";
}
function postJSON(url, payload) { return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then((res) => res.json()).catch(() => ({ ok: false, error: "network" })); }

function setFormBusy(form, isBusy = true) {
  const submitButton = form?.querySelector('button[type="submit"]');
  if (!submitButton) return;
  submitButton.disabled = isBusy;
  submitButton.textContent = isBusy ? "전송 중..." : submitButton.dataset.originalLabel || submitButton.textContent;
}

function track(eventName, payload = {}) { const targetEvent = EVENT_ALIAS[eventName] || eventName; const event = TRACKED_EVENTS.has(targetEvent) ? targetEvent : EVENT_ALIAS[eventName] || eventName; if (!TRACKED_EVENTS.has(event)) return Promise.resolve({ ok: true }); return postJSON("/api/event", { event_name: event, event_alias: eventName, session_id: state.sessionId, user_id: state.userId, path: location.pathname + location.hash, inferred_type: state.inferredType, ...payload, metadata: { ...(payload.metadata || {}), event_alias: eventName } }).catch(() => null); }
function formPayload(form) { return Object.fromEntries(new FormData(form).entries()); }

const STRATEGY_V10_BASE = "/strategy-v10/";
const V10_TIER_ORDER = { direct: 0, adjacent: 1, indirect: 2 };
const V10_EVIDENCE_LABELS = {
  L1_COMPANY_OFFICIAL: "STRATEGY 공식 수행 / 회사·핵심인력 증빙 가능",
  L2_KEY_PERSON_PM_OFFICIAL: "대표 컨설턴트 PM 수행경험 / 개인 실적증명 가능",
  L3_FORMER_CEO_PERIOD: "대표 리더십 관련 수행경험",
  L4_CONTEXTUAL_PRIVATE_OR_LIMITED: "내부 참고 또는 제한적 자문 경험",
};
const V10_PUBLIC_FORBIDDEN_CLAIMS = [
  "비공개 경력·계약정보 노출",
  "성과 변화 인과 단정",
  "증빙 범위 초과 표현",
  "회사 공식 실적과 대표 PM 경험 혼용",
];
const V10_PRIOR_FIRM_PATTERNS = [
  new RegExp(String.fromCharCode(82, 78, 67), "gi"),
  new RegExp(String.fromCharCode(105, 79, 75, 73), "gi"),
  new RegExp(`${String.fromCharCode(50500, 51060, 50724, 53412)}|[${String.fromCharCode(12828)}${String.fromCharCode(12849)}]${String.fromCharCode(50500, 51060, 50724, 53412)}|${String.fromCharCode(51452, 49885, 54924, 49324)}\\s*${String.fromCharCode(50500, 51060, 50724, 53412)}`, "g"),
];
const V10_VALUE_CHAIN = [
  "환경·정책 진단",
  "비전·전략체계",
  "사업 포트폴리오",
  "조직진단·재설계",
  "직무·인력운영",
  "성과관리·평가체계",
  "HR·보수체계",
  "실행관리",
];
const V10_THEME_LABELS = {
  strategy: "전략수립",
  organization_design: "조직진단·조직재설계",
  performance_management: "성과관리",
  internal_performance_evaluation: "성과관리",
  hr_system: "HR·보수체계",
  job_based_hr: "직무중심 HR",
  compensation: "보수체계",
  compensation_system: "보수체계",
};
const V10_INSTITUTION_CLASS_LABELS = {
  urban_development_housing_corporation: "도시·개발공사",
  policy_finance_guarantee_institution: "정책금융·보증기관",
  soc_transport_public_operator: "SOC·교통기관",
  rd_specialized_research_institution: "R&D 전문기관",
  energy_nuclear_safety_institution: "에너지·안전기관",
  industry_promotion_agency: "산업진흥기관",
  local_facility_management_corporation: "시설관리공단",
  public_service_corporation_or_quasi_government: "공공서비스기관",
  public_or_quasi_public_org: "공공·준정부기관",
  local_government_context: "지방행정기관",
  foundation_or_local_affiliated_institution: "재단·지방출연기관",
  private_corporate_or_platform: "민간·플랫폼기업",
  private_or_platform_company: "민간·플랫폼기업",
  public_corporation: "공기업",
  public_agency_corporation: "공공기관",
  foundation: "재단기관",
  promotion_agency: "진흥기관",
};
const V10_EVALUATION_GROUP_LABELS = {
  local_public_enterprise_or_facility_management_group: "지방공기업·시설관리기관",
  central_public_corporation_group: "중앙공기업",
  central_quasi_government_or_public_agency_group: "준정부·공공기관",
  rd_specialized_or_other_public_institution_group: "R&D·전문공공기관",
  non_public_private_reference: "민간·플랫폼 참고기관",
  evaluation_group_unclassified: "공공기관",
};
const strategyV10State = {
  loaded: false,
  records: [],
  people: [],
  layers: [],
  forbiddenClaims: [],
  visualSchema: null,
  sampleOutput: null,
  dashboard: null,
  lastRetrieval: null,
};

function publishStrategyV10API() {
  const api = {
    version: "v10-evidence-os",
    retrieveSimilarCases,
    state: strategyV10State,
    safety: { stripPublicUnsafeText, forbiddenClaims: V10_PUBLIC_FORBIDDEN_CLAIMS },
  };
  window.STRATEGY_EVIDENCE_OS = api;
  globalThis.STRATEGY_EVIDENCE_OS = api;
  document.documentElement.dataset.strategyEvidenceOs = strategyV10State.loaded ? "ready" : "booting";
  return api;
}

function stripPublicUnsafeText(value) {
  return V10_PRIOR_FIRM_PATTERNS.reduce((text, pattern) => text.replace(pattern, ""), toText(value))
    .replace(/(?:19|20)\d{2}\s*(?:[-~–]\s*(?:19|20)?\d{2})?\s*년?/g, "")
    .replace(/['`][0-9]{2}\b/g, "")
    .replace(/\b(?:19|20)\d{2}\b/g, "")
    .replace(/\d+(?:\.\d+)?\s*(?:조원|억원|만원|원|조|억|KRW|USD)/gi, "")
    .replace(/[가-힣]*(?:금액|증가|향상\s*보장)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,./])/g, "$1")
    .trim();
}

function v10Array(value) {
  if (Array.isArray(value)) return value.map((item) => stripPublicUnsafeText(item)).filter(Boolean);
  if (!toText(value)) return [];
  return toText(value)
    .replace(/^\[|\]$/g, "")
    .split(/[|,]/)
    .map((item) => stripPublicUnsafeText(item.replace(/^['"]|['"]$/g, "")))
    .filter(Boolean);
}

function v10ThemeLabel(value) {
  const key = toText(value);
  return V10_THEME_LABELS[key] || stripPublicUnsafeText(key) || "공공기관 문제해결";
}

function v10InstitutionLabel(record = {}) {
  const institutionClass = v10Array(record.institution_classes)[0];
  const group = toText(record.evaluation_group);
  return stripPublicUnsafeText(record.institution_class_label || record.public_institution_label)
    || V10_INSTITUTION_CLASS_LABELS[institutionClass]
    || V10_EVALUATION_GROUP_LABELS[group]
    || stripPublicUnsafeText(record.ministry_family || record.canonical_ministry)
    || "공공기관";
}

function v10PublicCaseCode(record = {}, fallbackIndex = 0) {
  const raw = toText(record.public_case_code || record.case_code_public);
  if (raw) return stripPublicUnsafeText(raw);
  const index = Math.max(1, fallbackIndex || Number(toText(record.record_id).replace(/\D/g, "")) || 1);
  return `${String.fromCharCode(64 + (((index - 1) % 26) + 1))}사`;
}

function v10MaskedClientLabel(record = {}, fallbackIndex = 0) {
  const explicit = stripPublicUnsafeText(record.client_public_label || record.masked_client || record.client_category);
  if (explicit) return explicit;
  if (record.public_client_allowed === true) return stripPublicUnsafeText(record.client_public);
  return `${v10InstitutionLabel(record)} ${v10PublicCaseCode(record, fallbackIndex)}`;
}

function v10ThemeToInferred(record = {}) {
  const text = [
    record.primary_theme,
    ...v10Array(record.themes_raw),
    ...v10Array(record.theme_buckets_kr),
    ...v10Array(record.problem_archetypes),
  ].join(" ").toLowerCase();
  if (text.includes("performance") || text.includes("성과")) return "performance_system_failure";
  if (text.includes("organization") || text.includes("조직")) return "rr_role_confusion";
  if (text.includes("hr") || text.includes("job") || text.includes("직무") || text.includes("보수")) return "job_capability_gap";
  if (text.includes("policy_response") || text.includes("new_business") || text.includes("uam") || text.includes("ai")) return "transformation_execution_gap";
  return "strategy_org_performance_gap";
}

function v10EvidenceLabel(record = {}) {
  return stripPublicUnsafeText(record.proof_public_label_v10)
    || V10_EVIDENCE_LABELS[record.evidence_layer]
    || "증빙 범위 확인 필요";
}

function v10AllowedForPublic(record = {}) {
  const policy = toText(record.visibility_policy);
  const contexts = v10Array(record.allowed_contexts);
  if (record.evidence_layer === "L4_CONTEXTUAL_PRIVATE_OR_LIMITED") return false;
  if (policy.includes("internal_only")) return false;
  if (contexts.includes("internal_context_only")) return false;
  return true;
}

function v10CaseHeadline(record = {}, fallbackIndex = 0) {
  const title = stripPublicUnsafeText(record.case_title_public || record.masked_title || record.project_title_public || record.project_title || record.title);
  if (title) return title;
  const theme = v10Array(record.theme_buckets_kr)[0] || v10ThemeLabel(record.primary_theme);
  return `${v10InstitutionLabel(record)} ${theme} 수행경험${fallbackIndex ? ` ${v10PublicCaseCode(record, fallbackIndex)}` : ""}`;
}

function v10ClientLabel(record = {}, fallbackIndex = 0) {
  return v10MaskedClientLabel(record, fallbackIndex)
    || v10InstitutionLabel(record)
    || "공공기관";
}

function v10RecordSearchText(record = {}) {
  return [
    record.client_public,
    record.project_title_public,
    record.canonical_ministry,
    record.ministry_family,
    record.evaluation_group,
    record.primary_theme,
    record.rfp_search_text,
    ...v10Array(record.theme_buckets_kr),
    ...v10Array(record.themes_raw),
    ...v10Array(record.problem_archetypes),
    ...v10Array(record.institution_classes),
    ...v10Array(record.function_models),
    ...v10Array(record.homepage_badges),
    ...v10Array(record.hero_tags),
  ].map(toText).join(" ").toLowerCase();
}

function v10Tokens(value) {
  const stop = new Set(["및", "과", "와", "the", "for", "and", "of", "to", "in", "공공기관", "용역", "연구"]);
  return toText(value)
    .split(/[\s,;/|·()\[\]{}"'`]+/)
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length >= 2 && !stop.has(item));
}

function v10CountHits(tokens, text) {
  const unique = [...new Set(tokens)];
  return unique.reduce((score, token) => score + (text.includes(token) ? 1 : 0), 0);
}

function v10HasArrayHit(recordValue, targetValue) {
  const target = toText(targetValue).toLowerCase();
  if (!target) return false;
  return v10Array(recordValue).some((item) => item.toLowerCase() === target || item.toLowerCase().includes(target) || target.includes(item.toLowerCase()));
}

function v10SafeCaseOutput(record, tier, dimensions, targetProfile = {}, fallbackIndex = 0) {
  const title = v10CaseHeadline(record);
  const client = v10ClientLabel(record, fallbackIndex);
  const theme = v10Array(record.theme_buckets_kr)[0] || v10ThemeLabel(record.primary_theme);
  const evidenceLayer = toText(record.evidence_layer) || "UNCLASSIFIED";
  const proofLabel = v10EvidenceLabel(record);
  const isCompanyRecord = record.company_record_allowed === true || record.company_record_allowed === "true";
  const contextLabel = isCompanyRecord ? "STRATEGY 공식 수행경험" : "대표 컨설턴트 수행경험";
  const similarParts = [];
  if (dimensions.institution >= 2) similarParts.push("기관 유형");
  if (dimensions.topic >= 2) similarParts.push("과제 주제");
  if (dimensions.function >= 1) similarParts.push("운영 기능");
  if (dimensions.parent >= 1) similarParts.push("정책영역");
  const why = similarParts.length
    ? `${similarParts.join("·")}이 대상 기관의 RFP 맥락과 겹칩니다.`
    : `${theme} 방법론과 산출물 구조가 대상 과제와 연결됩니다.`;
  const forbidden = [...new Set([...(v10Array(record.forbidden_claims)), ...V10_PUBLIC_FORBIDDEN_CLAIMS])];
  return {
    record_id: stripPublicUnsafeText(record.record_id),
    client_public: client,
    project_title_public: title,
    tier,
    score: Math.round(dimensions.total),
    why_similar: why,
    evidence_layer: evidenceLayer,
    evidence_layer_label: proofLabel,
    safe_public_label: proofLabel,
    safe_public_copy: `${client} 관련 ${theme} ${contextLabel}`,
    proposal_copy: `${targetProfile.target_institution_name || "대상 기관"} 과제는 ${theme}와 유사한 구조로, ${client} 관련 수행경험을 ${proofLabel} 범위에서 제시할 수 있습니다.`,
    do_not_say: forbidden,
    recommended_visuals: ["similarity_constellation", "evidence_pyramid", "value_chain"],
    record,
  };
}

function v10ScoreRecord(record, targetProfile = {}, rfpKeywords = []) {
  const text = v10RecordSearchText(record);
  const targetTokens = [
    ...v10Tokens(targetProfile.target_institution_name),
    ...v10Tokens(targetProfile.institution_type),
    ...v10Tokens(targetProfile.ministry_or_parent),
    ...v10Tokens(targetProfile.evaluation_group),
    ...v10Tokens(targetProfile.rfp_title),
    ...rfpKeywords.flatMap(v10Tokens),
    ...(Array.isArray(targetProfile.required_outputs) ? targetProfile.required_outputs.flatMap(v10Tokens) : v10Tokens(targetProfile.required_outputs)),
  ];
  const institutionTokens = [
    ...v10Tokens(targetProfile.target_institution_name),
    ...v10Tokens(targetProfile.institution_type),
    ...v10Tokens(targetProfile.evaluation_group),
  ];
  const topicTokens = [
    ...rfpKeywords.flatMap(v10Tokens),
    ...(Array.isArray(targetProfile.required_outputs) ? targetProfile.required_outputs.flatMap(v10Tokens) : v10Tokens(targetProfile.required_outputs)),
  ];
  const parentTokens = [
    ...v10Tokens(targetProfile.ministry_or_parent),
    ...v10Tokens(targetProfile.evaluation_group),
  ];
  const functionTokens = [
    ...v10Tokens(targetProfile.institution_type),
    ...v10Tokens(targetProfile.target_institution_name),
    ...topicTokens,
  ];
  const institutionExact = toText(targetProfile.target_institution_name)
    && text.includes(toText(targetProfile.target_institution_name).toLowerCase());
  const classHit = v10HasArrayHit(record.institution_classes, targetProfile.institution_type)
    || v10HasArrayHit(record.function_models, targetProfile.institution_type)
    || v10HasArrayHit(record.evaluation_group, targetProfile.evaluation_group);
  const dimensions = {
    institution: Math.min(30, (institutionExact ? 18 : 0) + (classHit ? 16 : 0) + v10CountHits(institutionTokens, text) * 4),
    topic: Math.min(30, v10CountHits(topicTokens, text) * 6),
    parent: Math.min(15, v10CountHits(parentTokens, text) * 5),
    function: Math.min(15, v10CountHits(functionTokens, text) * 3),
    evidence: Math.min(10, Number(record.evidence_score || 0) / 10),
    representative: Math.min(10, Number(record.representative_score_base_v7 || 0) / 12),
  };
  let tier = "indirect";
  if ((institutionExact || classHit || dimensions.institution >= 16) && dimensions.topic >= 6) tier = "direct";
  else if (dimensions.institution >= 8 || dimensions.parent >= 5 || dimensions.function >= 6 || dimensions.topic >= 12) tier = "adjacent";
  const tierBase = tier === "direct" ? 300 : tier === "adjacent" ? 200 : 100;
  dimensions.total = tierBase + dimensions.institution + dimensions.topic + dimensions.parent + dimensions.function + dimensions.evidence + dimensions.representative;
  return { tier, dimensions };
}

function retrieveSimilarCases(targetProfile = {}, rfpKeywords = []) {
  const keywords = Array.isArray(rfpKeywords) ? rfpKeywords : v10Tokens(rfpKeywords);
  const records = strategyV10State.records.filter(v10AllowedForPublic);
  const scored = records
    .map((record, index) => {
      const { tier, dimensions } = v10ScoreRecord(record, targetProfile, keywords);
      return v10SafeCaseOutput(record, tier, dimensions, targetProfile, index + 1);
    })
    .filter((item) => item.score > 105)
    .sort((a, b) => {
      const tierDiff = V10_TIER_ORDER[a.tier] - V10_TIER_ORDER[b.tier];
      if (tierDiff !== 0) return tierDiff;
      return b.score - a.score;
    });
  const pick = (tier, limit) => scored.filter((item) => item.tier === tier).slice(0, limit);
  const direct = pick("direct", 4);
  const adjacent = pick("adjacent", 6);
  const indirect = pick("indirect", 4);
  const result = {
    target_profile: {
      target_institution_name: stripPublicUnsafeText(targetProfile.target_institution_name || "대상 기관"),
      institution_type: stripPublicUnsafeText(targetProfile.institution_type || ""),
      rfp_keywords: keywords.map(stripPublicUnsafeText).filter(Boolean),
      retrieval_policy: "direct > adjacent > indirect",
    },
    direct_cases: direct,
    adjacent_cases: adjacent,
    indirect_cases: indirect,
    why_similar: "동일 기관유형·정책영역·과제주제·운영기능을 먼저 보고, 같은 tier 안에서만 증거점수로 정렬했습니다.",
    evidence_layer: "L1/L2/L3/L4 분리. 공개 화면에서는 L4와 내부용 맥락을 제외합니다.",
    safe_public_copy: "유사 수행경험은 회사 공식 실적과 대표 PM 수행경험을 분리해 표시합니다.",
    proposal_copy: [
      "대상 과제와 동일한 기관유형·과제주제를 먼저 제시하고, 인접 정책영역과 방법론 경험으로 보강합니다.",
      "비공개 항목과 증빙 범위를 넘는 성과 단정은 공개 문구에서 제외합니다.",
    ],
    forbidden_claims: V10_PUBLIC_FORBIDDEN_CLAIMS,
    recommended_visuals: ["similarity_constellation", "ministry_theme_heatmap", "value_chain", "anchor_case_map", "person_evidence_card", "evidence_pyramid", "korea_map_secondary"],
  };
  strategyV10State.lastRetrieval = result;
  document.documentElement.dataset.strategyEvidenceOsMatches = String(direct.length + adjacent.length + indirect.length);
  return result;
}

async function fetchJSONSafe(url, fallback = null) {
  const response = await fetch(url, { cache: "no-store" }).catch(() => null);
  if (!response || !response.ok) return fallback;
  return response.json().catch(() => fallback);
}

async function fetchTextSafe(url, fallback = "") {
  const response = await fetch(url, { cache: "no-store" }).catch(() => null);
  if (!response || !response.ok) return fallback;
  return response.text().catch(() => fallback);
}

function parseJSONL(text) {
  return toText(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try { return JSON.parse(line); } catch (error) { return null; }
    })
    .filter(Boolean);
}

async function loadStrategyV10Data() {
  if (strategyV10State.loaded) {
    publishStrategyV10API();
    return strategyV10State;
  }
  const [recordsText, people, layers, forbidden, visualSchema, sampleOutput, dashboard] = await Promise.all([
    fetchTextSafe(`${STRATEGY_V10_BASE}strategy_v10_records.jsonl`),
    fetchJSONSafe(`${STRATEGY_V10_BASE}strategy_v10_people.json`, { people: [] }),
    fetchJSONSafe(`${STRATEGY_V10_BASE}strategy_v10_evidence_layers.json`, { layers: [] }),
    fetchJSONSafe(`${STRATEGY_V10_BASE}strategy_v10_forbidden_claims.json`, { forbidden_claims: [] }),
    fetchJSONSafe(`${STRATEGY_V10_BASE}strategy_v10_visualization_schema.json`, {}),
    fetchJSONSafe(`${STRATEGY_V10_BASE}strategy_v10_sample_gijang_output.json`, null),
    fetchJSONSafe(`${STRATEGY_V10_BASE}strategy_v10_dashboard_data.json`, null),
  ]);
  strategyV10State.records = parseJSONL(recordsText);
  strategyV10State.people = Array.isArray(people?.people) ? people.people : [];
  strategyV10State.layers = Array.isArray(layers?.layers) ? layers.layers : [];
  strategyV10State.forbiddenClaims = Array.isArray(forbidden?.forbidden_claims) ? forbidden.forbidden_claims : [];
  strategyV10State.visualSchema = visualSchema || {};
  strategyV10State.sampleOutput = sampleOutput;
  strategyV10State.dashboard = dashboard;
  strategyV10State.loaded = true;
  publishStrategyV10API();
  return strategyV10State;
}

function v10RecordToCaseItem(record = {}, index = 0) {
  const theme = v10Array(record.theme_buckets_kr)[0] || v10ThemeLabel(record.primary_theme);
  return {
    id: stripPublicUnsafeText(record.record_id) || `v10-${index + 1}`,
    masked_title: v10CaseHeadline(record, index + 1),
    client_category: v10ClientLabel(record, index + 1),
    client_type: stripPublicUnsafeText(record.ministry_family || record.canonical_ministry || "공공기관"),
    disclosure: "masked",
    problem: `${theme} 과제에서 ${v10Array(record.problem_archetypes).slice(0, 2).join("·") || "실행 기준 정렬"}이 핵심입니다.`,
    solution_cluster: theme,
    approach: `${v10EvidenceLabel(record)} 범위에서 기관유형·과제주제·산출물을 분리해 제시합니다.`,
    deliverables: v10Array(record.homepage_badges).slice(0, 4).join(" / ") || "전략·조직·성과 운영체계",
    customer_type: stripPublicUnsafeText(record.evaluation_group || record.ministry_family || "공공기관"),
    theme: v10ThemeLabel(record.primary_theme),
    sector: stripPublicUnsafeText(record.ministry_family || record.canonical_ministry || "공공영역"),
    evidence_layer: record.evidence_layer,
    is_featured: record.representative_priority === "hero" ? 1 : 0,
    inferred_type: v10ThemeToInferred(record),
    raw_record: record,
  };
}

function renderV10CaseList(targetId, cases = []) {
  const target = document.getElementById(targetId);
  if (!target) return;
  if (!cases.length) {
    target.innerHTML = `<div class="v10-case empty"><b>후보 없음</b><p>다른 키워드 또는 산출물을 넣으면 간접 후보까지 확장합니다.</p></div>`;
    return;
  }
  target.innerHTML = cases.map((item) => `
    <article class="v10-case">
      <div class="v10-case-top"><span>${escapeHTML(item.record_id)}</span><strong>${escapeHTML(item.safe_public_label)}</strong></div>
      <b>${escapeHTML(item.project_title_public)}</b>
      <p>${escapeHTML(item.safe_public_copy)}</p>
      <p><em>${escapeHTML(item.why_similar)}</em></p>
      <div class="v10-case-foot">
        <span>${escapeHTML(item.evidence_layer)}</span>
        <span>${item.score} pts</span>
      </div>
    </article>
  `).join("");
}

function renderV10Summary(result) {
  const target = document.getElementById("v10RetrievalSummary");
  if (!target || !result) return;
  const total = result.direct_cases.length + result.adjacent_cases.length + result.indirect_cases.length;
  target.innerHTML = `
    <div>
      <span>Target</span>
      <b>${escapeHTML(result.target_profile.target_institution_name)}</b>
      <p>${escapeHTML(result.why_similar)}</p>
    </div>
    <div>
      <span>Matched</span>
      <b>${total} cases</b>
      <p>Direct ${result.direct_cases.length} · Adjacent ${result.adjacent_cases.length} · Indirect ${result.indirect_cases.length}</p>
    </div>
    <div>
      <span>Public Guardrail</span>
      <b>안전 공개 모드</b>
      <p>${escapeHTML(result.safe_public_copy)}</p>
    </div>
  `;
}

function renderV10Heatmap() {
  const target = document.getElementById("v10Heatmap");
  if (!target) return;
  const counts = new Map();
  strategyV10State.records.filter(v10AllowedForPublic).forEach((record) => {
    const ministry = stripPublicUnsafeText(record.ministry_family || record.canonical_ministry || "기타");
    const theme = v10Array(record.theme_buckets_kr)[0] || v10ThemeLabel(record.primary_theme);
    const key = `${ministry}||${theme}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const max = Math.max(1, ...counts.values());
  const cells = [...counts.entries()]
    .map(([key, count]) => {
      const [ministry, theme] = key.split("||");
      return { ministry, theme, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 18);
  target.innerHTML = cells.map((cell) => {
    const intensity = Math.max(0.18, cell.count / max);
    return `<div class="heat-cell" style="--heat:${intensity}"><span>${escapeHTML(cell.ministry)}</span><b>${escapeHTML(cell.theme)}</b><em>${cell.count}</em></div>`;
  }).join("");
}

function renderV10ValueChain() {
  const target = document.getElementById("v10ValueChain");
  if (!target) return;
  target.innerHTML = V10_VALUE_CHAIN.map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><b>${escapeHTML(item)}</b></div>`).join("");
}

function renderV10AnchorMap() {
  const target = document.getElementById("v10AnchorMap");
  if (!target) return;
  const anchors = new Map();
  strategyV10State.records.filter(v10AllowedForPublic).forEach((record) => {
    v10Array(record.homepage_badges).slice(0, 3).forEach((badge) => anchors.set(badge, (anchors.get(badge) || 0) + 1));
  });
  target.innerHTML = [...anchors.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([badge, count], index) => `<div class="anchor-chip" style="--rank:${index + 1}"><b>${escapeHTML(badge)}</b><span>${count}</span></div>`)
    .join("");
}

function renderV10PersonCard() {
  const target = document.getElementById("v10PersonCard");
  if (!target) return;
  const person = strategyV10State.people[0] || {};
  const domains = v10Array(person.expertise_domains).slice(0, 8);
  target.innerHTML = `
    <div class="person-card-core">
      <span>${escapeHTML(stripPublicUnsafeText(person.current_affiliation || "STRATEGY"))}</span>
      <b>${escapeHTML(stripPublicUnsafeText(person.public_name || "김정성"))}</b>
      <p>${escapeHTML(stripPublicUnsafeText(person.public_role || "대표 컨설턴트 / 총괄 PM"))}</p>
      <p>${escapeHTML(stripPublicUnsafeText(person.trust_message || "회사 공식 수행경험과 대표 PM 수행경험을 구분해 증거 레이어 안에서 설명합니다."))}</p>
    </div>
    <div class="person-domain-list">${domains.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}</div>
  `;
}

function renderV10EvidencePyramid() {
  const target = document.getElementById("v10EvidencePyramid");
  if (!target) return;
  const layers = strategyV10State.layers.length ? strategyV10State.layers : Object.entries(V10_EVIDENCE_LABELS).map(([id, label], index) => ({ id, label, score: [100, 85, 70, 30][index] }));
  target.innerHTML = layers.map((layer, index) => `
    <div class="pyramid-layer" style="--level:${index + 1}">
      <span>${escapeHTML(stripPublicUnsafeText(layer.id))}</span>
      <b>${escapeHTML(stripPublicUnsafeText(layer.label) || V10_EVIDENCE_LABELS[layer.id] || "Evidence Layer")}</b>
      <em>${Number(layer.score || 0)}</em>
    </div>
  `).join("");
}

function renderV10KoreaMap() {
  const target = document.getElementById("v10KoreaMap");
  if (!target) return;
  const regions = ["서울", "경기", "인천", "강원", "충북", "충남", "경북", "경남", "부산", "울산", "전남", "전북", "광주", "대구", "대전", "제주"];
  const counts = regions.map((region) => ({
    region,
    count: strategyV10State.records.filter((record) => v10RecordSearchText(record).includes(region.toLowerCase())).length,
  })).filter((item) => item.count > 0);
  target.innerHTML = counts
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item) => `<div><b>${escapeHTML(item.region)}</b><span>${item.count}건</span></div>`)
    .join("") || `<div><b>전국</b><span>지역 공공기관 경험 축적</span></div>`;
}

function drawV10Constellation(result) {
  const canvas = document.getElementById("v10ConstellationCanvas");
  if (!canvas || !result) return;
  const ctx = canvas.getContext("2d");
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(320, Math.floor(box.width || canvas.width));
  const height = Math.max(260, Math.floor(width * 0.58));
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#101820";
  ctx.fillRect(0, 0, width, height);
  const center = { x: width * 0.5, y: height * 0.48, label: result.target_profile.target_institution_name };
  const cases = [
    ...result.direct_cases.map((item) => ({ ...item, color: "#ffd166", radius: 82 })),
    ...result.adjacent_cases.slice(0, 5).map((item) => ({ ...item, color: "#5eead4", radius: 128 })),
    ...result.indirect_cases.slice(0, 4).map((item) => ({ ...item, color: "#93c5fd", radius: 170 })),
  ];
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  for (let x = 0; x < width; x += 42) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  for (let y = 0; y < height; y += 42) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  cases.forEach((item, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(1, cases.length) - Math.PI / 2;
    const x = center.x + Math.cos(angle) * Math.min(item.radius, width * 0.38);
    const y = center.y + Math.sin(angle) * Math.min(item.radius * 0.62, height * 0.34);
    ctx.strokeStyle = item.tier === "direct" ? "rgba(255,209,102,.6)" : item.tier === "adjacent" ? "rgba(94,234,212,.32)" : "rgba(147,197,253,.22)";
    ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(x, y); ctx.stroke();
    ctx.fillStyle = item.color;
    ctx.beginPath(); ctx.arc(x, y, item.tier === "direct" ? 7 : 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.82)";
    ctx.font = "700 11px Pretendard, Inter, sans-serif";
    ctx.fillText(stripPublicUnsafeText(item.client_public).slice(0, 14), x + 10, y + 4);
  });
  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.arc(center.x, center.y, 10, 0, Math.PI * 2); ctx.fill();
  ctx.font = "900 14px Pretendard, Inter, sans-serif";
  ctx.fillText(stripPublicUnsafeText(center.label).slice(0, 24), center.x + 14, center.y + 5);
}

function renderV10Visuals(result) {
  renderV10Heatmap();
  renderV10ValueChain();
  renderV10AnchorMap();
  renderV10PersonCard();
  renderV10EvidencePyramid();
  renderV10KoreaMap();
  drawV10Constellation(result);
}

function renderV10EvidenceOS(result) {
  renderV10Summary(result);
  renderV10CaseList("v10DirectCases", result.direct_cases);
  renderV10CaseList("v10AdjacentCases", result.adjacent_cases);
  renderV10CaseList("v10IndirectCases", result.indirect_cases);
  renderV10Visuals(result);
  initMagneticControls();
}

function v10FormProfile(form) {
  const data = formPayload(form);
  const keywords = v10Tokens(data.keywords);
  return {
    profile: {
      target_institution_name: data.institution || "기장시설관리공단",
      institution_type: data.institution_type || "local_facility_management_corporation",
      rfp_title: `${data.institution || ""} ${data.keywords || ""}`,
      rfp_keywords: keywords,
      required_outputs: v10Tokens(data.outputs),
      evaluation_group: data.institution_type === "local_facility_management_corporation" ? "local_public_enterprise_or_facility_management_group" : "",
    },
    keywords,
  };
}

async function initV10EvidenceOS() {
  const form = document.getElementById("v10SearchForm");
  if (!form) return;
  await loadStrategyV10Data();
  const run = () => {
    const { profile, keywords } = v10FormProfile(form);
    const result = retrieveSimilarCases(profile, keywords);
    renderV10EvidenceOS(result);
  };
  if (!form.dataset.bound) {
    form.dataset.bound = "true";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      run();
      setInquiryContext({
        source: "evidence_os",
        route: "evidence_os",
        sourceTitle: form.elements.institution?.value || "Evidence OS 검색",
        sourceId: "v10_retrieval",
        inferredType: state.inferredType || "rr_role_confusion",
        caseContext: form.elements.keywords?.value || "",
      });
      document.getElementById("v10RetrievalSummary")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    window.addEventListener("resize", () => {
      if (strategyV10State.lastRetrieval) drawV10Constellation(strategyV10State.lastRetrieval);
    });
  }
  run();
}

function updateDiagnosisDock({ label = "Diagnosis", title = "", inferredType = "", sourceTitle = "", route = "" } = {}) {
  const dock = document.getElementById("diagnosisDock");
  if (!dock) return;
  const dockLabel = document.getElementById("dockLabel");
  const dockTitle = document.getElementById("dockTitle");
  const dockCta = dock.querySelector("[data-inquiry-cta]");
  const resolvedType = inferredType || state.inferredType || state.inquiryContext.inferredType || "";
  const resolvedTitle = title || sourceTitle || radarLensLabels[resolvedType] || "문제유형을 선택하면 대표 실적과 문의 경로가 고정됩니다.";
  const resolvedRoute = route || state.inquiryContext.route || "diagnosis_dock";
const dockCtaLabel = {
    issue_result: "이 진단으로 대표 진단 요청",
    case_grid: "이 사례로 진단 확장",
    case_radar: "맵으로 선별된 실적으로 진단 요청",
    case_universe: "연결된 실적으로 대표 진단 요청",
    case_study_lab: "유사 사례 기준으로 진단 요청",
    flagship_case: "해당 실적으로 바로 진단 요청",
    conversion_engine: "엔진 기반 진단 요청",
    decision_brief: "대표 진단 요청",
    conversion_rail: "진단 경로를 이어 문의하기",
    diagnosis_dock: "진단 문의로 이어가기",
    problem_mirror: "문제 진단으로 이어 문의하기",
    cases_overview: "실적 비교 후 진단 요청",
    contact_nav: "문의 계속 진행",
    hero: "문제 진단 시작",
    issue_finder: "진단 이어가기",
    direct: "문의 시작",
  };
  if (dockLabel) dockLabel.textContent = label;
  if (dockTitle) dockTitle.textContent = resolvedTitle;
  if (dockCta) {
    dockCta.dataset.inquirySource = "diagnosis_dock";
    dockCta.dataset.inquiryRoute = resolvedRoute;
    dockCta.dataset.inquiryCaseTitle = resolvedTitle;
    dockCta.dataset.inquiryCaseId = resolvedType || state.inquiryContext.sourceId || "diagnosis_dock";
    dockCta.dataset.inquiryInferredType = resolvedType;
    if (dockCtaLabel[resolvedRoute]) dockCta.textContent = dockCtaLabel[resolvedRoute];
  }
  dock.hidden = false;
  document.body.classList.add("dock-active");
  requestAnimationFrame(() => dock.classList.add("is-visible"));
}

function setInquiryContext(next = {}) {
  state.inquiryContext = { ...state.inquiryContext, ...next, inferredType: next.inferredType || state.inferredType || state.inquiryContext.inferredType || "", source: next.source || state.inquiryContext.source || "direct" };
  const route = state.inquiryContext.route || "";
  const { source, sourceTitle = "", sourceId = "", inferredType = "", caseContext = "" } = state.inquiryContext;
  const inquirySource = $("#inquirySource");
  const inquiryCaseTitle = $("#inquiryCaseTitle");
  const inquiryRoute = $("#inquiryRoute");
  const inquiryInferredType = $("#inquiryInferredType");
  const notice = $("#inquiryIntentNotice");
  const inquiryMessage = document.querySelector("#inquiryForm textarea[name='message']");
  const prioritySelect = document.querySelector("#inquiryForm select[name='priority_context']");
  if (inquirySource) inquirySource.value = source;
  if (inquiryCaseTitle) inquiryCaseTitle.value = sourceTitle;
  if (inquiryRoute) inquiryRoute.value = route;
  if (inquiryInferredType) inquiryInferredType.value = inferredType;
  if (prioritySelect && inferredType && priorityValueByType[inferredType] && !prioritySelect.value) {
    prioritySelect.value = priorityValueByType[inferredType];
  }

  if (notice) {
    if (!route || route === "direct") { notice.hidden = true; notice.textContent = ""; }
    else {
      notice.hidden = false;
      const contextText = caseContext ? ` / 연결 맥락: ${clampText(caseContext, 54)}` : "";
      notice.textContent = `선택 경로: ${INQUIRY_ROUTE_LABEL_BY_ROUTE[route] || "문의 출처"} / 진단 축: ${inferredType ? inferLabel(inferredType) : "미확인"} / 기준 실적: ${clampText(sourceTitle || sourceId || "컨텍스트 미상", 48)}${contextText}`;
    }
  }

  if (inquiryMessage && !inquiryMessage.value.trim()) {
    const typeText = inferredType ? `진단 유형: ${inferLabel(inferredType)} (${state.inferredType || inferredType})` : "진단 유형: 미확인";
    const routeText = sourceId || sourceTitle ? `컨택 경로: ${sourceTitle || sourceId}` : "컨택 경로: 웹사이트 진입";
    const questionText = inferredType && inquiryQuestionByType[inferredType] ? `대표가 먼저 봐야 할 질문: ${inquiryQuestionByType[inferredType]}` : "대표가 먼저 봐야 할 질문: 현재 문제가 무엇인지 먼저 판별하고 싶습니다.";
    const contextText = caseContext ? `연결 실적 포인트: ${caseContext}` : "연결 실적 포인트: 없음";
    inquiryMessage.value = [INQUIRY_MESSAGE_TEMPLATE_BY_ROUTE[route] || "문의 출처: 웹사이트 진입", typeText, routeText, contextText, questionText].join("\n");
  }
}

function setInquiryContextFromElement(target, next = {}) {
  const dataset = target?.dataset || {};
  setInquiryContext({
    source: dataset.inquirySource || state.inquiryContext.source || "direct",
    route: dataset.inquiryRoute || next.route || "direct",
    sourceTitle: dataset.inquiryCaseTitle || next.sourceTitle || "일반 문의",
    sourceId: dataset.inquiryCaseId || next.sourceId || target?.id || "",
    inferredType: dataset.inquiryInferredType || state.inferredType,
    caseContext: dataset.inquiryCaseContext || next.caseContext || "",
    ...next,
  });
}

function enrichInquiryMessage(data) {
  const lines = [];
  const priority = toText(data.priority_context);
  const selectedProblem = toText(state.selectedProblem);
  const sourceTitle = toText(state.inquiryContext.sourceTitle);
  const caseContext = toText(state.inquiryContext.caseContext);
  const route = toText(state.inquiryContext.route);
  const inferred = toText(state.inferredType || state.inquiryContext.inferredType);
  if (priority) lines.push(`우선 진단 영역: ${priority}`);
  if (selectedProblem) lines.push(`선택한 문제유형: ${selectedProblem}`);
  if (sourceTitle) lines.push(`문의 맥락: ${sourceTitle}`);
  if (caseContext) lines.push(`연결 실적 포인트: ${caseContext}`);
  if (route && route !== "direct") lines.push(`유입 경로: ${route}`);
  if (inferred) lines.push(`추론 유형: ${inferLabel(inferred)} (${inferred})`);
  if (!lines.length) return toText(data.message);
  const marker = "[웹 진단 컨텍스트]";
  const message = toText(data.message);
  if (message.includes(marker)) return message;
  return `${marker}\n${lines.join("\n")}\n\n[사용자 입력]\n${message}`;
}

function inferType() {
  return inferTypeWithDetails().type;
}

function getInferenceScores() {
  const scores = {};
  const primary = routeBySymptom[state.answers.symptom] || "strategy_org_performance_gap";
  scores[primary] = 3;
  const sceneWeight = sceneWeights[state.answers.scene] || {};
  const needWeight = needWeights[state.answers.need] || {};
  Object.entries(sceneWeight).forEach(([key, value]) => { scores[key] = (scores[key] || 0) + value; });
  Object.entries(needWeight).forEach(([key, value]) => { scores[key] = (scores[key] || 0) + value; });
  return scores;
}

function inferTypeWithDetails() {
  const scores = getInferenceScores();
  const ordered = Object.entries(scores).sort((a, b) => (b[1] - a[1]) || ((caseInferenceTieBreak[b[0]] || 0) - (caseInferenceTieBreak[a[0]] || 0)) || 0);
  const top = ordered[0] || ["strategy_org_performance_gap", 3];
  const second = ordered[1] || [top[0], 0];
  const topScore = Number(top[1]) || 0;
  const secondScore = Number(second[1]) || 0;
  const confidence = Math.max(58, Math.min(97, Math.round(56 + (topScore * 9) + Math.max(0, topScore - secondScore) * 6)));
  return { type: top[0], confidence, topScore, secondScore, margin: Math.max(0, topScore - secondScore), scores };
}

function renderStep() {
  const step = steps[state.step];
  $("#stepLabel").textContent = step.label;
  $("#question").textContent = step.question;
  $("#progress").style.width = `${((state.step + 1) / steps.length) * 100}%`;
  const options = $("#options");
  options.innerHTML = "";
  step.options.forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button"; button.textContent = label;
    if (state.answers[step.key] === value) button.classList.add("active");
    button.addEventListener("click", () => {
      state.answers[step.key] = value;
      document.body.classList.add("issue-armed");
      updateDiagnosisDock({ label: "Issue Selected", title: label, route: "issue_finder" });
      [...options.children].forEach((child) => child.classList.remove("active"));
      button.classList.add("active");
      track("issue_step_select", {
        source_section: "issue_finder",
        step: state.step + 1,
        step_key: step.key,
        response: value,
        label,
        metadata: { source: "finder_step_option" },
      });
      if (state.step === 0) {
        track("issue_start", { source_section: "issue_finder", step: state.step + 1, symptom: value, metadata: { source: "finder_step_option", started_from: "step1" } });
      }
    });
    options.appendChild(button);
  });
  initMagneticControls();
}

function buildRelatedProjects(items) {
  if (!items?.length) return "";
  const normalized = items.slice(0, 3).map((item, index) => { const title = publicProjectTitle(item, index + 1); const caseId = toText(item.id) || "";
    return `<a class="chip" href="#cases" data-inquiry-cta="related" data-inquiry-source="cases_overview" data-inquiry-route="cases_overview" data-inquiry-case-title="${escapeHTML(title)}" data-inquiry-case-id="${caseId || 'cases_overview'}" aria-label="${escapeHTML(title)}"><b>${escapeHTML(title)}</b><span>${escapeHTML(clientCategory(item))}</span></a>`;
  }).join("");
  return `<div class="diagnosis-block"><p><b>관련 실적 후보</b></p><div class="chips">${normalized}</div></div>`;
}

function buildChips(items) {
  if (!items?.length) return "";
  return `<div class="diagnosis-block"><p><b>진단 가설</b></p><div class="chips">${items.map((item) => `<div class="chip">${item}</div>`).join("")}</div></div>`;
}

function buildDecisionChecklist(inferredType = "", proofTitle = "", nextAction = "") {
  const type = inferredType || state.inferredType || "strategy_org_performance_gap";
  const action = (toText(nextAction) || "미팅").replace(/\\s+/g, " ").trim();
  const checks = [
    `현재 병목이 가장 크게 터지는 의사결정 축을 먼저 고정해야 합니다.`,
    `${inferLabel(type)} 유형에 맞는 산출물 우선순위로 운영 판단을 압축합니다.`,
    `${proofTitle ? `${proofTitle.slice(0, 40)}` : "선정 사례"}에서 바로 적용 가능한 판단 포인트를 1차 추출합니다.`,
    `${action || "미팅"} 전, 의사결정권자/실행책임자 관점으로 질문목록을 정합합니다.`,
  ];
  const items = checks.map((entry, index) => `<li><span>STEP ${index + 1}</span>${entry}</li>`).join("");
  return `<div class="diagnosis-block"><p><b>미팅 전 판단 체크</b></p><ul class="result-checklist">${items}</ul></div>`;
}

function buildResultDecisionSeeds(type = state.inferredType) {
  const baseQuestions = {
    strategy_org_performance_gap: [
      "전략이 어느 수준에서 KPI로 번역되지 못하고 멈추고 있나요?",
      "누가 최종 판단을 내리고 누가 책임을 마감하나요?",
      "우선순위 충돌이 생길 때 누가 조정하고 있나요?",
    ],
    rr_role_confusion: [
      "의사결정권과 실행책임 경계가 어디서 가장 자주 충돌하나요?",
      "R&R이 정의돼도 실제 판단은 어디서 흐려지나요?",
      "적어도 한 번이라도 누가 책임을 넘겨야 했던 지점이 있나요?",
    ],
    performance_system_failure: [
      "지표가 늘었는데도 현장이 행동하지 않는 지점이 어디인가요?",
      "평가 결과가 다음 실행계획으로 연결되지 않는 병목은 무엇인가요?",
      "성과지표 수용성은 누가 판단하고 누가 거부하나요?",
    ],
    transformation_execution_gap: [
      "파일럿이 끝났지만 확산 판단이 안 된 이유는 무엇인가요?",
      "실행 주체는 누가, 판단 주체는 누가 되어야 하나요?",
      "확산 기준과 중단 기준이 동일하게 문서화되어 있나요?",
    ],
    job_capability_gap: [
      "전략 난도에 비해 인력·직무 배치가 맞지 않는 지점은 어디인가요?",
      "보상·성과 인센티브가 역량 배치와 어긋나는가요?",
      "핵심 역할의 의사결정자는 누가 장기적으로 유지되나요?",
    ],
  };
  const questions = baseQuestions[type] || baseQuestions.strategy_org_performance_gap;
  return `
    <div class="result-brief-grid">
      <p class="decision-point-label">이 3가지 질문이 진단의 시작점입니다. 클릭하면 문의 입력란에 반영됩니다.</p>
      <div class="decision-grid result-prefill-grid">
        ${questions.map((entry) => `<button type="button" data-prefill-problem="${escapeHTML(entry)}">${entry}</button>`).join("")}
      </div>
    </div>
  `;
}

function clampText(value, maxLength = 64) {
  const text = toText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 2)).trim()}…`;
}

function buildResultConversionPlan(inferredType, proofTitle, nextAction = "") {
  const typeLabel = inferLabel(inferredType || state.inferredType);
  const action = toText(nextAction) || "15분 진단 미팅 요청";
  const actionLabel = action.length > 38 ? `${action.slice(0, 36).trim()}… 요청` : `${action} 요청`;
  const routeSteps = [
    {
      step: "STEP 01",
      stage: "진단 정렬",
      detail: `${typeLabel} 유형으로 병목 축을 먼저 고정합니다.`,
    },
    {
      step: "STEP 02",
      stage: "실적 매칭",
      detail: `진단군과 닮은 사례(${clampText(proofTitle, 34)}) 기반으로 실행 우선순위를 검증합니다.`,
    },
    {
      step: "STEP 03",
      stage: "의사결정 전환",
      detail: "현장 의사결정자가 바로 쓸 수 있는 1회 미팅 아젠다로 정리합니다.",
    },
  ];
  const routeCards = [
    {
      actionLabel: "이 유형 실적 지도 보기",
      actionHref: "#case-radar",
      actionRoute: "case_radar",
      actionSource: "issue_result",
      actionSourceId: "issue-result-radar",
      actionContext: `${typeLabel} 문제군에서 우선 노드형 실적 맵으로 전환`,
      actionHint: "진단 유형 기준 1분 안에 우선 과제를 정렬합니다.",
    },
    {
      actionLabel: "대표 문의로 연결",
      actionHref: "#contact",
      actionRoute: "conversion_plan",
      actionSource: "issue_result",
      actionSourceId: "result-next",
      actionContext: action,
      actionHint: "현재 병목에 맞춰 15분 미팅 의제로 바로 전환합니다.",
    },
  ];
  return `
    <div class="result-route">
      <p class="decision-point-label">진단 결과는 바로 다음 단계로 이어집니다.</p>
      <div class="result-route-grid">
        ${routeSteps.map((entry) => `<article class="route-card"><small>${entry.step}</small><b>${entry.stage}</b><p>${entry.detail}</p></article>`).join("")}
      </div>
      <p class="result-route-kicker">권장 액션: ${action}</p>
      <div class="result-actions">
        ${routeCards.map((entry) => `<a class="btn secondary" href="${entry.actionHref}" data-inquiry-cta="route_bridge" data-inquiry-source="${entry.actionSource}" data-inquiry-route="${entry.actionRoute}" data-inquiry-case-title="${escapeHTML(entry.actionLabel)}" data-inquiry-case-id="${entry.actionSourceId}" data-inquiry-case-context="${escapeHTML(entry.actionContext)}" data-event="case_cta_click">${entry.actionLabel}</a>`).join("")}
        <a class="btn primary" href="#contact" data-inquiry-cta="result" data-inquiry-source="issue_result" data-inquiry-route="conversion_plan" data-inquiry-case-title="${escapeHTML(action)}" data-inquiry-case-id="result-next" data-inquiry-case-context="${escapeHTML(action)}" data-event="case_cta_click">${actionLabel}</a>
        <a class="btn secondary" href="#caseGrid" data-case-cta="진단 유형 기반 실적 비교" data-case-source="case_grid" data-inquiry-source="issue_result" data-inquiry-route="case_overview_link" data-inquiry-case-title="${escapeHTML(typeLabel)} 실적 전체 비교" data-inquiry-case-id="issues-${encodeURIComponent(typeLabel)}" data-event="case_cta_click">진단 유형 실적 더보기</a>
      </div>
      <p class="result-route-note">${routeCards[0].actionHint} / ${routeCards[1].actionHint}</p>
    </div>
  `;
}

function buildResultReportDeck({
  typeLabel,
  whyText,
  outcomeHint,
  proofTitle,
  hypothesisItems,
  proofHint,
  decisionQuestion,
  matchedContext,
}) {
  const topHypotheses = (hypothesisItems || []).slice(0, 3).map((item) => `<li>${item}</li>`).join("");
  return `
    <div class="diagnosis-report">
      <article class="result-card">
        <span class="result-card-kicker">진단 유형</span>
        <b>${typeLabel}</b>
        <p>${clampText(proofHint, 86)}</p>
      </article>
      <article class="result-card">
        <span class="result-card-kicker">왜 이렇게 되나요</span>
        <b>${clampText(toText(whyText), 64) || "병목의 기저 구조를 우선 확인합니다."}</b>
        <ul>${topHypotheses || "<li>15분 미팅에서 실행 가설을 정교화합니다.</li>"}</ul>
      </article>
      <article class="result-card">
        <span class="result-card-kicker">가설적 해결 방향</span>
        <b>${clampText(toText(proofTitle), 64) || "실행 구조를 중심으로 가설을 압축합니다."}</b>
        <p>${toText(outcomeHint)}</p>
      </article>
      <article class="result-card">
        <span class="result-card-kicker">대표 미팅 질문</span>
        <b>${toText(decisionQuestion).split(".")[0] || "진단 우선순위를 정리해보겠습니다."}</b>
        <p>${toText(decisionQuestion)}</p>
      </article>
      <article class="result-card">
        <span class="result-card-kicker">대표 사례 매칭</span>
        <b>${clampText(matchedContext || "유사 실적 라인 우선 정렬", 42)}</b>
        <p>유사도와 실행 경로를 기준으로 1차 유사 실적을 바로 연결합니다.</p>
      </article>
    </div>
  `;
}

function buildResultMeter(activeType) {
  const scores = state.inferenceScores || {};
  const maxScore = Math.max(1, ...Object.values(scores).map((value) => Number(value) || 0));
  const types = Object.entries(radarLensLabels);
  return `<div class="result-meter" aria-label="진단 매치 미터">${types.map(([type, label], index) => {
    const active = type === activeType;
    const rawScore = Number(scores[type] || 0);
    const score = active ? 95 : rawScore ? Math.max(34, Math.round((rawScore / maxScore) * 72)) : Math.max(38, 72 - index * 9);
    return `<div class="${active ? "active" : ""}"><span>${label}</span><i style="--score:${score}%"></i><b>${score}</b></div>`;
  }).join("")}</div>`;
}

function resolveProofNarrative(inferredType) {
  return flagshipProofNarrative[inferredType] || flagshipPanelFallback;
}

function showResult() {
  document.body.classList.add("result-ready");
  const inference = inferTypeWithDetails();
  state.inferredType = inference.type;
  state.inferredConfidence = inference.confidence;
  state.inferenceScores = inference.scores;
  const payload = { user_id: state.userId, session_id: state.sessionId, symptom: state.answers.symptom, scene: state.answers.scene, need: state.answers.need, inferred_type: state.inferredType };
  return postJSON("/api/issue", payload).then((response) => {
    if (response.session_id) { state.sessionId = response.session_id; localStorage.setItem("strat_session_id", state.sessionId); }
    const hasApiResult = response && response.ok !== false && response.result && typeof response.result === "object";
    const result = hasApiResult ? response.result : {};
    const diagnosis = inferenceNarrative[state.inferredType] || inferenceNarrative.strategy_org_performance_gap;
    const proof = flagshipProofByType[state.inferredType] || flagshipProofByType.strategy_org_performance_gap;
    const proofHint = result.proof_hint || diagnosis.proofHint;
    track("issue_complete", {
      source_section: "issue_finder",
      target_id: proof.id,
      target_title: proof.title,
      inferred_type: state.inferredType,
      confidence: state.inferredConfidence,
      top_score: inference.topScore,
      margin_to_next: inference.margin,
      top_ratio: Math.max(0, inference.topScore - inference.secondScore),
    });
    setInquiryContext({
      source: "issue_result",
      route: "issue_result",
      sourceTitle: proof.title,
      sourceId: proof.id,
      inferredType: state.inferredType,
      caseContext: proofHint ? clampText(proofHint, 54) : clampText(result.matching_context || "방문자 문제와 닮은 실적", 54),
    });
    updateDiagnosisDock({ label: "Diagnosis Ready", title: `${inferLabel(state.inferredType)} - ${proof.title}`, inferredType: state.inferredType, sourceTitle: proof.title, route: "issue_result" });
    if (!hasApiResult) {
      track("issue_result_view", { source_section: "issue_result", target_id: proof.id, target_title: proof.title, inferred_type: state.inferredType, fallback: true });
    }
    const headline = result.headline || `${diagnosis.title} 진단`;
    const why = result.interpretation || diagnosis.why;
    const hypothesis = result.hypothesis || diagnosis.hypothesis || [];
    const relatedProjects = buildRelatedProjects((result.related_projects && result.related_projects.length) ? result.related_projects : allCases || []);
    const outcome = result.outcome_hint || diagnosis.outcomeHint;
    const nextAction = result.next_action || diagnosis.cta || "진단 요청하기";
    const hypothesisList = hypothesis.length ? hypothesis : ["가설이 충분히 축적되지 않았습니다. 15분 진단 미팅에서 정교화합니다."];
    const proofNarrative = resolveProofNarrative(state.inferredType);
    const decisionQuestion = toText(result.representative_question || proofNarrative.hardQuestion);
    const outcomeLine = toText(result.outcome_hint || proofNarrative.outcome || outcome);
    const decisionChecklist = buildDecisionChecklist(state.inferredType, proof.title, nextAction);
    const conversionPlan = buildResultConversionPlan(state.inferredType, proof.title, nextAction);
    const diagnosisEvidence = buildDiagnosisEvidence();
    const reportDeck = buildResultReportDeck({
      typeLabel: inferLabel(state.inferredType),
      whyText: why,
      proofTitle: proof.title,
      outcomeHint: outcomeLine,
      hypothesisItems: hypothesisList,
      proofHint,
      decisionQuestion,
      matchedContext: result.matching_context || "방문자 맥락과 닮은 실적 라인으로 추천했습니다.",
    });
    if (allCases.length || defaultProofs.length) {
      applyRadarLens(state.inferredType);
    }

    $("#result").hidden = false;
    $("#result").innerHTML = `
      <div class="diagnosis-block">
        <p class="kicker">Diagnosis Snapshot</p>
        <p class="result-meta">
          <span>진단유형: ${inferLabel(state.inferredType)}</span>
          <span>현재 단계: Step 3/3</span>
          <span>진단 신뢰도: ${state.inferredConfidence}%</span>
        </p>
        <p class="result-brief">
          아래 결과는 보고서 제안이 아니라, 다음 15분 미팅에서 확인해야 할 실행 판단의 출발점입니다.
        </p>
        <h3>${headline}</h3>
        ${hasApiResult ? "" : "<p class='result-fallback'>실시간 분석 응답이 지연돼 기본 진단으로 표시했습니다. 핵심 가설로 1회 진단을 진행하고 다음 단계에서 세부 진단을 정밀화합니다.</p>"}
        <p>${why}</p>
        ${diagnosisEvidence}
        ${buildResultMeter(state.inferredType)}
      </div>
      ${reportDeck}
      ${conversionPlan}
      ${buildResultDecisionSeeds(state.inferredType)}
      <div class="proof-jump">
        <span>${proof.label}</span>
        <b>${proof.title}</b>
        <p>${result.matching_context || "방문자 맥락과 닮은 실적 라인으로 추천했습니다."}</p>
        <a class="btn secondary" href="#${proof.id}" data-proof-jump="${proof.id}">이 실적의 실행 근거 구조 보기</a>
      </div>
      ${relatedProjects}
      ${decisionChecklist}
      <div class="diagnosis-block">
        <p><b>예상 변화</b></p>
        <p>${outcomeLine}</p>
      </div>
      <p class="note">이 진단은 보고서 제출이 아니라, 1회 미팅으로 실행 판단을 정밀화하는 시작점입니다.</p>
      <div class="result-actions">
        <a class="btn secondary" href="#cases" data-inquiry-source="cases_overview" data-inquiry-route="cases_overview" data-inquiry-case-title="실적 목록 전체" data-inquiry-case-id="cases_list">실적 전체 보기</a>
        <a class="btn secondary" href="#case-radar" data-inquiry-source="issue_result" data-inquiry-route="issue_result" data-inquiry-case-title="${proof.title}" data-inquiry-case-id="${proof.id}">이 유형 실적 지도에서 더보기</a>
        <a class="btn primary" href="#contact" data-inquiry-cta="result" data-event="case_cta_click" data-inquiry-source="issue_result" data-inquiry-route="issue_result" data-inquiry-case-title="${proof.title}" data-inquiry-case-id="${proof.id}">${toText(nextAction).slice(0, 58) || "15분 진단 미팅 요청하기"}</a>
      </div>
    `;
    renderCaseGrid(allCases, state.inferredType);
    $("#result").scrollIntoView({ behavior: "smooth", block: "nearest" });
    $("#result").insertAdjacentHTML("beforeend", buildChips([result.problem_name || proofHint, result.solution_direction || "진단 대상의 실행 경로를 우선 정렬합니다."]));
  });
}

$("#nextBtn")?.addEventListener("click", async () => {
  const step = steps[state.step];
  if (!state.answers[step.key]) { $("#options button")?.focus(); return; }
  if (state.step < steps.length - 1) {
    track("issue_step_next", {
      source_section: "issue_finder",
      step: state.step + 1,
      next_step: state.step + 2,
      step_key: step.key,
      response: state.answers[step.key],
    });
    state.step += 1;
    renderStep();
    return;
  }
  await showResult();
});

function startFromMirror(symptom) {
  state.answers.symptom = symptom;
  state.step = 1;
  document.body.classList.add("issue-armed");
  updateDiagnosisDock({
    label: "Problem Mirror",
    title: routeBySymptom[symptom] ? radarLensBriefs[routeBySymptom[symptom]] : "선택한 문제문장을 기준으로 진단을 이어갑니다.",
    inferredType: routeBySymptom[symptom] || "",
    route: "problem_mirror",
  });
  track("issue_step_select", {
    source_section: "problem_mirror",
    step: 1,
    step_key: "symptom",
    response: symptom,
    metadata: { source: "problem_mirror" },
  });
  track("issue_start", { source_section: "problem_mirror", symptom, metadata: { channel: "problem_mirror" } });
  renderStep();
  $("#finder").scrollIntoView({ behavior: "smooth", block: "center" });
}
document.querySelectorAll("[data-symptom]").forEach((button) => button.addEventListener("click", () => startFromMirror(button.dataset.symptom)));

let projectRecords = [];
let allCases = [];
let activeTheme = "all";
let activeRadarLens = "strategy_org_performance_gap";
let caseUniverseGraph = null;
let caseUniverseContent = { items: [], nodes: [], links: [] };
const observedProofs = new Set();
const magneticBound = new WeakSet();

const radarLensLabels = {
  strategy_org_performance_gap: "전략-실행 단절",
  rr_role_confusion: "조직 R&R 혼선",
  performance_system_failure: "성과체계 불일치",
  transformation_execution_gap: "AI/UAM 실행 전환",
  job_capability_gap: "인력·직무 정렬 미흡",
};

const radarLensBriefs = {
  strategy_org_performance_gap: "전략은 있지만 실행·성과로 번역되지 않는 문제를 기준으로 대표 실적을 재정렬합니다.",
  rr_role_confusion: "역할, 권한, 책임 경계가 흐려 의사결정이 느려지는 문제를 중심으로 조직 재설계 실적을 우선 배치합니다.",
  performance_system_failure: "KPI와 평가가 현장을 움직이지 못하는 문제를 기준으로 성과관리·평가체계 실적을 끌어올립니다.",
  transformation_execution_gap: "AI·ESG·UAM 같은 미래전략이 파일럿 이후 실행으로 넘어가지 못하는 문제를 우선 매칭합니다.",
  job_capability_gap: "전략·실행은 명확하지만 인력 배치, 직무 설계, 책임 체계가 어긋나는 문제를 중심으로 실적을 재배치합니다.",
};

const priorityValueByType = {
  strategy_org_performance_gap: "전략-실행 단절",
  rr_role_confusion: "조직 R&R 혼선",
  performance_system_failure: "성과체계 불일치",
  transformation_execution_gap: "AI/ESG/UAM 실행 전환",
  job_capability_gap: "인력·직무 정렬 미흡",
};

const inquiryQuestionByType = {
  strategy_org_performance_gap: "전략 문장이 실제 과제, KPI, 책임 단위로 내려오는지 확인하고 싶습니다.",
  rr_role_confusion: "조직 역할, 권한, 책임 경계 중 어디가 병목인지 먼저 확인하고 싶습니다.",
  performance_system_failure: "KPI와 평가체계가 현장 실행을 움직이는 구조인지 확인하고 싶습니다.",
  transformation_execution_gap: "AI/ESG/UAM 전략이 파일럿 이후 실행 체계로 전환되는 조건을 확인하고 싶습니다.",
  job_capability_gap: "전략 우선순위에 맞게 인력·직무·보상 축이 맞춰져 있는지 확인하고 싶습니다.",
};

function scoreCaseForInferred(item, inferredType) {
  const haystack = [toText(item.title), toText(item.customer_type), toText(item.problem), toText(item.approach), toText(item.deliverables)].join(" ").toLowerCase();
  const themeHints = {
    strategy_org_performance_gap: ["전략", "성과", "kpi", "조직", "실행", "roadmap", "목표", "개선", "정렬"],
    rr_role_confusion: ["조직", "r&r", "직무", "보상", "성과", "권한", "의사결정", "책임", "역할"],
    performance_system_failure: ["성과", "평가", "kpi", "보상", "지표", "운영", "체계", "책임"],
    transformation_execution_gap: ["ai", "esg", "uam", "기술", "실행", "파일럿", "확대", "운영", "로드맵", "변화"],
    job_capability_gap: ["직무", "역량", "인력", "보상", "권한", "조직", "성과", "교육", "전문성", "인력 운용"],
  };
  const keywords = themeHints[inferredType] || themeHints.strategy_org_performance_gap;
  return keywords.reduce((score, keyword) => (haystack.includes(keyword.toLowerCase()) ? score + 1 : score), 0);
}

function sortCasesByInferredType(items, inferredType) {
  if (!Array.isArray(items) || !inferredType) return [...items];
  return [...items].sort((a, b) => {
    const scoreA = scoreCaseForInferred(a, inferredType);
    const scoreB = scoreCaseForInferred(b, inferredType);
    if (scoreA === scoreB) return (Number(b.is_featured) || 0) - (Number(a.is_featured) || 0);
    return scoreB - scoreA;
  });
}

function formatTopCase(item, fallbackType) {
  const title = publicProjectTitle(item, 1) || fallbackType;
  const problem = toText(item?.problem) || toText(item?.situation) || "문제 진단으로 이어지는 실적 후보입니다.";
  const approach = toText(item?.approach) || toText(item?.solution_cluster) || "실행 번역이 가능한 접근 프레임으로 정렬했습니다.";
  return { title, category: clientCategory(item), problem, approach };
}

function renderConversionEngine(items = []) {
  const container = document.getElementById("conversionEngine");
  if (!container) return;
  const source = Array.isArray(items) && items.length ? items : defaultProofs;
  const types = Object.keys(radarLensLabels);
  container.innerHTML = types.map((type) => {
    const ranked = sortCasesByInferredType(source, type);
    const bestCase = ranked[0] || {};
    const blueprint = conversionEngineBlueprint[type] || {};
    const caseData = formatTopCase(bestCase, conversionEngineLabels.fallbackEvidence);
    const score = scoreCaseForInferred(bestCase, type);
    const path = [blueprint.stage?.[0] || "진단 유형", blueprint.stage?.[1] || "핵심 증거", blueprint.stage?.[2] || "첫 질문"];
    return `
      <article class="conversion-card">
        <span class="path-pill">${inferLabel(type)}</span>
        <b>${blueprint.cta || radarLensLabels[type]}에 맞춘 진단 흐름</b>
        <p class="conversion-copy">${blueprint.anchor || conversionEngineLabels.fallbackQuestion}</p>
        <div class="path-rail">
          <div class="path-item"><span>${path[0]}</span><span>${type}</span></div>
          <div class="path-item"><span>${path[1]}</span><span>${caseData.category} / ${caseData.title}</span></div>
          <div class="path-item"><span>${path[2]}</span><span>${caseData.problem}</span></div>
        </div>
        <p class="path-item">
          <span>${conversionEngineLabels.stageQuestion}</span>
          <span>${path[1]} 기준으로, 실제 실행 체감도가 높은 과제부터 검증할 수 있습니다.</span>
        </p>
        <p class="path-item">
          <span>Match Score</span>
          <span>${score}점</span>
        </p>
        <a class="btn secondary" href="#contact" data-inquiry-cta="conversion_engine" data-inquiry-source="conversion_engine" data-inquiry-route="conversion_engine" data-inquiry-case-title="${caseData.title}" data-inquiry-case-id="conversion-${type}" data-inquiry-inferred-type="${type}">이 흐름으로 바로 문의</a>
      </article>
    `;
  }).join("");
  initMagneticControls();
}

function renderCaseGrid(items, inferredType = "") {
  const source = Array.isArray(items) && items.length ? items : defaultProofs;
  const ordered = inferredType ? sortCasesByInferredType(source, inferredType) : [...source];
  const ranked = ordered.slice(0, 6);
  $("#caseGrid").innerHTML = ranked.map((item, index) => {
    const title = publicProjectTitle(item, index + 1);
    const category = clientCategory(item);
    const contextHint = clampText(toText(item.problem) || toText(item.approach) || toText(item.solution_cluster) || "유형 대응 맥락을 먼저 진단 후 제안드립니다.", 64);
    const matchScore = inferredType ? scoreCaseForInferred(item, inferredType) : 0;
    const matchText = inferredType ? `<span class="tag match-tag">진단유형 ${inferLabel(inferredType)} 매치 ${matchScore}점</span>` : "";
    return `<article class="case-card"><span class="tag">${category}</span><span class="tag disclosure-tag">${disclosureTag(item)}</span>${matchText}<b>${title}</b><p><b>문제</b><br>${toText(item.problem)}</p><p><b>접근</b><br>${toText(item.approach)}</p><p><b>산출물</b><br>${toText(item.deliverables)}</p><a class="btn secondary" href="#contact" data-case-cta="${escapeHTML(title)}" data-case-id="${toText(item.id) || `case-${index + 1}`}" data-case-source="case_grid" data-inquiry-source="case_grid" data-inquiry-route="case_grid" data-inquiry-case-title="${escapeHTML(title)}" data-inquiry-case-id="${toText(item.id) || `case-${index + 1}`}" data-inquiry-case-context="${escapeHTML(contextHint)}" data-event="case_cta_click">이 사례로 바로 미팅 의제 확정</a></article>`;
  }).join("");
  initMagneticControls();
}

function renderCaseStudies(filter = "all") {
  const target = document.getElementById("caseStudyGrid");
  if (!target) return;
  const studies = filter === "all" ? caseStudies20 : caseStudies20.filter((item) => item.type === filter);
  target.innerHTML = studies.map((item, index) => `
    <article class="case-study-card" data-study-type="${item.type}">
      <div class="case-study-head">
        <span class="tag">${item.label}</span>
        <span class="tag disclosure-tag">익명 공개</span>
        <b>${item.title}</b>
        <p>${item.situation}</p>
      </div>
      <div class="case-study-flow" aria-label="${item.title} 문제해결 흐름">
        <div><span>Real Problem</span><p>${item.realProblem}</p></div>
        <div><span>STRATEGY Judgment</span><p>${item.judgment}</p></div>
        <div><span>Visitor Hook</span><p>${item.visitorHook}</p></div>
      </div>
      <div class="case-study-meta">
        <div><b>방법론</b>${item.approach.map((entry) => `<span>${entry}</span>`).join("")}</div>
        <div><b>산출물</b>${item.deliverables.map((entry) => `<span>${entry}</span>`).join("")}</div>
      </div>
      <div class="case-study-diagnosis">
        <div><b>첫 미팅 질문</b><ul>${item.firstQuestions.map((entry) => `<li>${entry}</li>`).join("")}</ul></div>
        <div><b>가설적 솔루션</b><p>${item.solutionHypothesis}</p></div>
      </div>
      <div class="case-study-impact">
        <div><b>Before / After</b><ul>${item.beforeAfter.map((entry) => `<li>${entry}</li>`).join("")}</ul></div>
        <div><b>Decision Impact</b><p>${item.decisionImpact}</p></div>
      </div>
      <a class="btn secondary" href="#contact" data-case-cta="${escapeHTML(item.title)}" data-case-id="${item.id}" data-case-source="case_study_lab" data-inquiry-source="case_study_lab" data-inquiry-route="case_study_lab" data-inquiry-case-title="${escapeHTML(item.title)}" data-inquiry-case-id="${item.id}" data-inquiry-inferred-type="${item.type}" data-inquiry-case-context="${escapeHTML(item.realProblem || item.situation || item.visitorHook || "")}" data-event="case_cta_click">이 문제와 닮았는지 대표에게 묻기</a>
    </article>
  `).join("");
  if (!studies.length) {
    target.innerHTML = `<article class="case-study-card"><b>해당 유형의 케이스가 준비 중입니다.</b><p>문의하면 가장 가까운 실적 라인으로 먼저 진단합니다.</p></article>`;
  }
  initMagneticControls();
}

function initCaseStudyLab() {
  renderCaseStudies("all");
  document.querySelectorAll("[data-study-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.studyFilter || "all";
      document.querySelectorAll("[data-study-filter]").forEach((item) => item.classList.toggle("active", item === button));
      renderCaseStudies(filter);
      if (filter !== "all") {
        setInquiryContext({ source: "case_study_filter", route: "case_study_filter", sourceTitle: inferLabel(filter), sourceId: filter, inferredType: filter });
        updateDiagnosisDock({ label: "Case Lens", title: `${inferLabel(filter)} 케이스 스터디`, inferredType: filter, route: "case_study_filter" });
      }
    });
  });
}

function renderRadarStats(items, inferredType = activeRadarLens) {
  const target = document.getElementById("radarStats");
  const brief = document.getElementById("radarBrief");
  if (brief) brief.textContent = radarLensBriefs[inferredType] || radarLensBriefs.strategy_org_performance_gap;
  if (!target) return;
  const source = Array.isArray(items) && items.length ? items : defaultProofs;
  const sorted = sortCasesByInferredType(source, inferredType);
  const scores = sorted.map((item) => scoreCaseForInferred(item, inferredType));
  const highMatches = scores.filter((score) => score >= 2).length;
  const bestScore = Math.max(0, ...scores);
  const bestTitle = caseTitle(sorted[0] || {});
  target.innerHTML = `
    <div><b>${highMatches}</b><span>${radarLensLabels[inferredType] || "문제유형"} 고연관 실적</span></div>
    <div><b>${bestScore}</b><span>최고 매치 점수</span></div>
    <div><b>${bestTitle ? "1" : "0"}</b><span>${bestTitle || "추천 실적 대기"}</span></div>
  `;
}
const defaultProofs = [
  { title: "신용보증기금(신보) 성과관리체계 고도화", masked_title: "신용보증기금(신보) 성과관리체계 고도화", client_category: "금융기관", client_type: "금융", disclosure: "masked", problem: "성과평가는 있었지만 전략 판단과 현장 실행이 같은 언어로 이어지지 않았습니다.", solution_cluster: "전략-KPI-평가 운영의 단일 지도화", approach: "전략 지표, 평가 운영, 책임 단위를 재정렬해 의사결정자가 같은 성과지도를 보게 했습니다.", deliverables: "KPI 계보도, 성과관리 운영안, 평가 수용성 개선 프레임", customer_type: "금융기관", year_note: "대표 실적", id: 1001 },
  { title: "해양진흥공사 중장기 경영전략 정렬", masked_title: "해양진흥공사 중장기 경영전략 정렬", client_category: "해양진흥공사", client_type: "공공기관", disclosure: "masked", problem: "산업정책, 역할 분담, 성과책임이 동시에 변하는 상황에서 중장기 기준점이 필요했습니다.", solution_cluster: "중장기 전략과 기관 운영 정렬", approach: "전략 목표와 조직 실행을 분리하지 않고, 추진과제와 성과관리 기준을 함께 설계했습니다.", deliverables: "중장기 전략안, 과제체계, 실행관리 프레임", customer_type: "공공기관", year_note: "대표 실적", id: 1002 },
  { title: "주택금융공사(주금공) 재정책임 재설정", masked_title: "주택금융공사(주금공) 성과관리체계 고도화", client_category: "주택금융공사", client_type: "공공기관", disclosure: "masked", problem: "기관의 미래 역할이 확대되면서 전략·실행 우선순위의 판단 체계가 분산됐습니다.", solution_cluster: "뉴비전과 실행 우선순위 정렬", approach: "비전·전략·평가체계를 연결해 정책 목적과 실행 성과를 하나의 책임망으로 통합했습니다.", deliverables: "뉴비전 전략체계, 중점과제, 실행 우선순위 프레임", customer_type: "공공기관", year_note: "대표 실적", id: 1003 },
  { title: "지역개발공사(도공) 올림픽 레거시 활용전략", masked_title: "지역개발공사(도공) 올림픽 레거시 활용전략", client_category: "지역개발공사", client_type: "공공기관", disclosure: "masked", problem: "대형 이벤트 이후 남은 자산을 지속가능한 사업과 기관 역할로 전환해야 했습니다.", solution_cluster: "레거시 자산의 사업화 판단 프레임", approach: "자산, 지역, 산업, 운영 주체를 함께 놓고 실행 가능한 활용 시나리오를 설계했습니다.", deliverables: "레거시 활용전략, 실행 로드맵, 성과 추적 기준", customer_type: "도시개발", year_note: "대표 실적", id: 1004 },
  { title: "도로인프라 공기업 도로전략 UAM 대응", masked_title: "도로인프라 공기업 도로전략 UAM 대응", client_category: "도로인프라 공기업", client_type: "인프라", disclosure: "masked", problem: "미래 모빌리티 변화에 어떤 역할로 대응해야 할지 판단 구조가 필요했습니다.", solution_cluster: "미래사업·정책대응 실행 로드맵", approach: "기술 변화보다 기관의 기능, 협력 구조, 단계별 과제를 먼저 정렬해 실행 책임과 확산 기준을 고정했습니다.", deliverables: "미래전략 과제, UAM 대응전략, 실행 로드맵", customer_type: "인프라 공기업", year_note: "대표 실적", id: 1005 },
  { title: "UAM 팀코리아 실행전략·파일럿 확산", masked_title: "UAM 팀코리아 실행전략·파일럿 확산", client_category: "미래 모빌리티", client_type: "UAM", disclosure: "masked", problem: "미래산업 과제의 실패 원인은 선언이 아니라 파일럿 확산의 승인선과 책임선 미흡이었습니다.", solution_cluster: "기술 과제의 파일럿-확산 정합 설계", approach: "R&R, 승인선, 성과측정의 3축을 묶어 실행 의사결정 라인을 고정했습니다.", deliverables: "실행전환 계획, KPI 정의, 성과측정 지표", customer_type: "UAM", year_note: "대표 실적", id: 1006 },
];

const caseStudies20 = [
  {
    id: "study-policy-finance-vision",
    type: "strategy_org_performance_gap",
    title: "정책금융 보증기관 B사 뉴비전 수립",
    label: "Vision / Portfolio",
    situation: "금융환경과 정책 역할이 동시에 변하면서 기관의 미래 역할, 전략방향, 성과체계가 다시 정렬되어야 했습니다.",
    realProblem: "비전 문구를 새로 쓰는 일이 아니라, 경영진이 무엇을 선택하고 무엇을 포기할지 판단할 기준이 약한 상태였습니다.",
    judgment: "비전-전략목표-전략과제-BSC KPI를 한 번에 내려보는 구조로 재설계해야 실행 저항이 줄어든다고 판단했습니다.",
    approach: ["환경분석과 이해관계자 인터뷰", "비전 워크숍", "BSC 전략맵", "실행 로드맵"],
    deliverables: ["비전·미션 재정의", "전략목표 및 과제체계", "성과지표 구조", "실행계획"],
    visitorHook: "우리 기관의 비전이 선언문에 머물고 있다면, 먼저 선택 기준과 KPI 계보를 봐야 합니다.",
    firstQuestions: ["현재 비전이 실제 예산·사업 포트폴리오 선택에 쓰이고 있습니까?", "경영진이 포기할 사업과 밀어야 할 사업을 같은 기준으로 판단합니까?"],
    solutionHypothesis: "비전 문구보다 먼저 역할 재정의, 포트폴리오 선택 기준, KPI 계보를 한 장으로 연결해야 합니다.",
    beforeAfter: ["Before: 비전·사업·KPI가 따로 설명됨", "After: 경영진 선택 기준과 성과책임이 한 구조로 연결됨"],
    decisionImpact: "경영진이 비전 문구가 아니라 사업 포트폴리오와 실행 우선순위를 기준으로 토론할 수 있게 만드는 유형의 과제입니다.",
  },
  {
    id: "study-housing-performance",
    type: "performance_system_failure",
    title: "금융분야 주택금융 공기업 A사 부점성과평가 고도화",
    label: "Performance System",
    situation: "지역본부와 지점 단위 성과평가가 전략과 현장 업무성과를 충분히 설명하지 못하는 상태였습니다.",
    realProblem: "지표가 부족한 것이 아니라 평가 기준, 가중치, 수용성, 환류 루프가 같은 목적을 향하지 못했습니다.",
    judgment: "성과평가는 점수표가 아니라 경영진과 현장이 같은 우선순위를 보게 하는 운영 시스템이어야 했습니다.",
    approach: ["BSC 기반 지표 설계", "AHP 가중치 검토", "정량·정성 균형평가", "평가 운영 프로세스 정비"],
    deliverables: ["부점 KPI 체계", "평가 운영안", "결과 분석 프레임", "환류체계"],
    visitorHook: "성과평가가 현장을 움직이지 못한다면 지표 수보다 판단력과 수용성부터 봐야 합니다.",
    firstQuestions: ["현장이 평가 결과를 납득하지 못하는 이유가 지표입니까, 운영 방식입니까?", "성과평가 결과가 다음 실행 조정회의로 이어지고 있습니까?"],
    solutionHypothesis: "KPI 수를 줄이는 것보다 지표의 판단 목적, 가중치, 운영 루프, 환류 회의체를 함께 재설계해야 합니다.",
    beforeAfter: ["Before: 평가 결과는 나오지만 현장 행동 변화가 약함", "After: KPI·평가·환류회의가 같은 운영 루프로 연결됨"],
    decisionImpact: "평가가 통제 장치에 머물지 않고 부점별 우선순위와 다음 실행을 조정하는 경영 도구가 되도록 설계하는 유형입니다.",
  },
  {
    id: "study-marine-portfolio",
    type: "strategy_org_performance_gap",
    title: "해양분야 진흥공기업 C사 중장기 경영전략",
    label: "Mid-term Strategy",
    situation: "해양산업 정책환경 변화 속에서 기관 역할과 사업 포트폴리오의 기준점이 흔들릴 수 있는 과제였습니다.",
    realProblem: "중장기 전략과 사업 포트폴리오, BSC 성과체계가 따로 움직이면 전략은 보고서에 머물 가능성이 컸습니다.",
    judgment: "정책금융 역할, 산업지원 기능, 사업 포트폴리오, 성과책임을 한 지도에 올려야 했습니다.",
    approach: ["3C Analysis", "BCG Matrix", "Porter Value Chain", "BSC 전략맵"],
    deliverables: ["중장기 전략체계", "사업 포트폴리오 조정안", "전략과제", "성과관리 프레임"],
    visitorHook: "사업 포트폴리오가 많아질수록 전략은 더 짧고 단단한 선택 기준이 필요합니다.",
    firstQuestions: ["현재 사업 포트폴리오는 기관 역할 기준으로 정렬되어 있습니까?", "성과책임은 전략과제 단위까지 내려가 있습니까?"],
    solutionHypothesis: "정책 역할, 산업지원 기능, 사업 매력도, 실행 역량을 함께 놓고 포트폴리오 우선순위를 다시 계산해야 합니다.",
    beforeAfter: ["Before: 중장기 전략과 사업 포트폴리오가 병렬로 존재함", "After: 기관 역할·사업 우선순위·성과책임이 하나의 지도에 배치됨"],
    decisionImpact: "사업 확대보다 중요한 것은 무엇을 먼저 추진하고 어떤 성과책임으로 관리할지 결정하는 구조를 만드는 것입니다.",
  },
  {
    id: "study-road-uam",
    type: "transformation_execution_gap",
    title: "도로 인프라 공기업 E사 K-UAM 대응전략",
    label: "Future Mobility",
    situation: "UAM 정책 변화와 인프라 활용 가능성 앞에서 기관이 어떤 역할로 참여할지 정해야 했습니다.",
    realProblem: "기술 트렌드 분석보다 어려운 것은 기관의 역할, 사업모델, 단계별 판단 기준을 정하는 일이었습니다.",
    judgment: "미래사업은 파일럿 아이디어가 아니라 실행 주체, 공간, 재무성, 정책 정합성이 함께 맞아야 움직입니다.",
    approach: ["Mega Trend Analysis", "3C Analysis", "Business Model Canvas", "단계별 로드맵"],
    deliverables: ["참여전략", "사업모델 후보", "추진 로드맵", "성과 판단 기준"],
    visitorHook: "AI·UAM·ESG 전략이 발표 이후 멈췄다면 실행 주체와 확산 기준부터 다시 잡아야 합니다.",
    firstQuestions: ["파일럿 이후 누가 확산 여부를 판단합니까?", "기술 과제의 성공 기준이 예산·조직·성과평가와 연결되어 있습니까?"],
    solutionHypothesis: "기술 로드맵이 아니라 실행 주체, 승인선, 파일럿 기준, 확산 조건을 먼저 고정해야 합니다.",
    beforeAfter: ["Before: 기술 트렌드와 아이디어는 있으나 기관 역할이 불명확함", "After: 참여 역할·사업모델·단계별 판단 기준이 정리됨"],
    decisionImpact: "미래사업 논의를 기술 소개에서 기관의 실행 포지션과 투자 판단으로 옮기는 유형의 과제입니다.",
  },
  {
    id: "study-urban-vision",
    type: "rr_role_confusion",
    title: "도시개발 공기업 G사 장기비전 및 조직·재무 플랜",
    label: "Urban Vision",
    situation: "대규모 개발사업과 장기 비전이 동시에 요구되며 조직, 인력, 재무 계획까지 연결되어야 했습니다.",
    realProblem: "비전 수립만으로는 부족했고, 실제 사업 추진 역할과 조직·인력·재무 계획이 함께 설계되어야 했습니다.",
    judgment: "장기 비전은 슬로건이 아니라 조직이 감당할 역할과 자원 배분의 기준이어야 했습니다.",
    approach: ["PESTEL Analysis", "SWOT to TOWS", "Scenario Planning", "BSC 전략맵"],
    deliverables: ["장기 비전", "전략목표와 과제", "조직·인력 방향", "실행 로드맵"],
    visitorHook: "대형 사업 앞에서 조직이 흔들린다면 전략보다 역할·자원·책임의 순서를 먼저 봐야 합니다.",
    firstQuestions: ["장기 비전이 조직·인력·재무 계획까지 내려가 있습니까?", "대형 사업별 최종 판단권과 실행 책임이 분리되어 있지 않습니까?"],
    solutionHypothesis: "비전-사업-조직-재무를 따로 쓰지 말고, 사업 추진 역할과 자원 배분 기준을 한 구조로 묶어야 합니다.",
    beforeAfter: ["Before: 장기 비전과 실제 사업 추진체계가 분리됨", "After: 비전·사업·조직·재무 계획이 같은 실행 기준으로 묶임"],
    decisionImpact: "대형 사업 추진에서 기관의 역할, 조직 규모, 자원 배분을 같은 테이블에서 판단하게 만드는 유형입니다.",
  },
  {
    id: "study-energy-organization",
    type: "rr_role_confusion",
    title: "에너지 공공기관 H사 조직진단 및 재설계",
    label: "Organization Design",
    situation: "정책 변화와 사업구조 전환 속에서 조직 효율성과 미래 대응력을 동시에 확보해야 했습니다.",
    realProblem: "조직도를 바꾸는 문제가 아니라 직무, 적정인력, 성과관리, 의사결정 구조를 함께 재정의해야 했습니다.",
    judgment: "조직개편은 박스 이동이 아니라 업무량, 책임, 권한, 성과체계가 동시에 맞는지 확인하는 일입니다.",
    approach: ["McKinsey 7S", "직무분석", "적정인력 산정", "조직 시뮬레이션"],
    deliverables: ["조직진단", "직무체계", "적정인력 산정", "조직재설계안"],
    visitorHook: "조직개편이 반복되는데 실행이 나아지지 않는다면 R&R과 판단권부터 확인해야 합니다.",
    firstQuestions: ["조직개편 전후로 의사결정 속도가 실제로 빨라졌습니까?", "업무량, 권한, 책임, 성과지표가 같은 단위로 설계되어 있습니까?"],
    solutionHypothesis: "조직도보다 먼저 업무량-직무-권한-성과책임의 불일치 지점을 찾아야 합니다.",
    beforeAfter: ["Before: 조직도는 바뀌지만 업무와 책임 공백은 반복됨", "After: 직무·권한·적정인력·성과책임이 같은 단위로 재정렬됨"],
    decisionImpact: "조직개편을 인사 이벤트가 아니라 의사결정 속도와 실행 책임을 회복하는 운영 설계로 바꾸는 유형입니다.",
  },
];

const FLAGSHIP_PRIORITY_KEYWORDS = [
  "주택금융",
  "보증기관",
  "정책금융",
  "해양",
  "올림픽",
  "도시공사",
  "지역개발",
  "미래사업",
  "UAM",
  "모빌리티",
];

function getCaseText(item) {
  return [
    item.title,
    item.masked_title,
    item.public_title,
    item.client,
    item.client_category,
    item.client_type,
    item.customer_type,
    item.project_title,
    item.problem,
    item.approach,
    item.solution_cluster,
    item.deliverables,
    item.summary,
    item.sector,
    item.theme,
    item.problem_name,
  ].map(toText).join(" ");
}

function resolveCaseField(item, ...fields) {
  for (const field of fields) {
    if (toText(item?.[field])) return toText(item[field]);
  }
  return "";
}

function pickFlagshipCases(items = [], limit = 6) {
  const sourceItems = Array.isArray(items) ? items : [];
  if (!sourceItems.length) return defaultProofs.slice(0, limit);
  const scored = sourceItems.map((item) => {
    const haystack = getCaseText(item).toLowerCase();
    const score = FLAGSHIP_PRIORITY_KEYWORDS.reduce((acc, keyword) => (haystack.includes(keyword.toLowerCase()) ? acc + 2 : acc), 0);
    return { ...item, __score: score };
  });
  const ordered = [...scored].sort((a, b) => {
    const scoreDiff = b.__score - a.__score;
    if (scoreDiff !== 0) return scoreDiff;
    return (Number(b.is_featured) || 0) - (Number(a.is_featured) || 0);
  });
  const seen = new Set();
  const selected = [];
  ordered.forEach((item) => {
    const key = String(item.id || caseTitle(item));
    if (selected.length >= limit || seen.has(key)) return;
    seen.add(key);
    selected.push(item);
  });
  if (selected.length < limit) {
    defaultProofs.forEach((item) => {
      if (selected.length >= limit) return;
      const key = String(item.id || caseTitle(item));
      if (!seen.has(key)) {
        seen.add(key);
        selected.push(item);
      }
    });
  }
  return selected.slice(0, limit);
}

function bindFormButtonLabels() {
  document.querySelectorAll("form .btn[type='submit']").forEach((button) => {
    if (!button.dataset.originalLabel) {
      button.dataset.originalLabel = button.textContent.trim() || "전송";
    }
  });
}

function renderFlagshipProof(items) {
  const proof = $("#flagshipProof");
  if (!proof) return;
  const entries = pickFlagshipCases(Array.isArray(items) ? items : [], 6);

  proof.innerHTML = entries.map((item, index) => {
    const title = publicProjectTitle(item, index + 1);
    const category = clientCategory(item);
    const proofType = toText(item.inferred_type) || state.inferredType;
    const contextHint = clampText(toText(item.problem) || toText(item.approach) || toText(item.solution_cluster) || "유형-산업-결과로 실적 연계가 가능합니다.", 64);
    const difficulty = resolveProofDifficulty(proofType, item);
    const proofLine = resolveProofNarrative(proofType);
    return `
    <article class="proof-panel" id="proof-${index + 1}" data-proof-index="${index + 1}" data-proof-title="${title}">
      <div class="proof-number">${String(index + 1).padStart(2, "0")}</div>
      <div class="proof-copy">
      <span class="tag">${category}</span><span class="tag disclosure-tag">${disclosureTag(item)}</span><span class="tag">핵심 실적</span>
      <div class="proof-meta">
        <span>문제 축: ${inferLabel(proofType) || "전략진단 축"}</span>
        <span>증거: ${escapeHTML(v10EvidenceLabel(item.raw_record || item))}</span>
      </div>
        <h3>${title}</h3>
        <p class="proof-line">${proofLine.outcome}</p>
        <dl>
          <div><dt>문제</dt><dd>${toText(item.problem)}</dd></div>
          <div><dt>접근</dt><dd>${toText(item.approach)}</dd></div>
          <div><dt>솔루션</dt><dd>${toText(item.solution_cluster)}</dd></div>
          <div><dt>결과</dt><dd>${toText(item.deliverables)}</dd></div>
          <div><dt>난이도</dt><dd>${difficulty}</dd></div>
          <div><dt>진입점</dt><dd>가장 닮은 실적 라인으로 먼저 진입 후 기관 맥락에 맞게 축소 적용합니다.</dd></div>
          <div><dt>실행 판단 포인트</dt><dd>${proofLine.hardQuestion}</dd></div>
        </dl>
        <p class="proof-disclosure">공개 화면에서는 고객명을 통제하고, 산업·기관유형·과제 난도 중심으로 설명합니다.</p>
        <a class="btn secondary" href="#contact" data-case-cta="${escapeHTML(title)}" data-case-id="proof-${index + 1}" data-case-source="flagship_case" data-inquiry-source="flagship_case" data-inquiry-route="flagship_case" data-inquiry-case-title="${escapeHTML(title)}" data-inquiry-case-id="proof-${index + 1}" data-inquiry-case-context="${escapeHTML(contextHint)}" data-event="case_cta_click">이 실적으로 바로 진단 요청</a>
      </div>
      <div class="proof-visual" aria-hidden="true"><span>${toText(item.solution_cluster) || "Strategy Map"}</span><i></i><i></i><i></i></div>
    </article>
  `;
  }).join("");
}

function escapeHTML(value) {
  return toText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function bestInferenceTypeForCase(item) {
  return Object.keys(radarLensLabels)
    .map((type) => ({ type, score: scoreCaseForInferred(item, type) }))
    .sort((a, b) => b.score - a.score)[0]?.type || "strategy_org_performance_gap";
}

function normalizeUniverseItems(items = []) {
  const source = Array.isArray(items) && items.length ? items : defaultProofs;
  const externalItems = Array.isArray(caseUniverseContent.items) ? caseUniverseContent.items : [];
  const records = projectRecords.slice(0, 54).map((record, index) => ({
    ...record,
    id: `record-${record.id || index}`,
    masked_title: publicProjectTitle(record, index + 1),
    client_category: clientCategory(record),
    problem: [record.theme, record.sector, record.project_title || record.title].map(toText).filter(Boolean).join(" / "),
    approach: "Track Record 기반 과제 맥락을 문제유형, 산업, 방법론 네트워크로 연결합니다.",
    solution_cluster: toText(record.theme) || toText(record.solution_cluster) || "Track Record",
    deliverables: toText(record.project_title || record.title) || "프로젝트 산출물",
  }));
  const seen = new Set();
  return [...source, ...externalItems, ...records].filter((item, index) => {
    const key = caseTitle(item) || `case-${index}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 72);
}

function normalizeUniverseNode(raw = {}) {
  const group = toText(raw.group) || "custom";
  const item = raw.item || (group === "case" ? {
    id: raw.id,
    masked_title: raw.name || raw.title,
    client_category: raw.subtitle || raw.category,
    problem: raw.problem || raw.subtitle,
    approach: raw.approach,
    solution_cluster: raw.method || raw.solution_cluster,
    deliverables: raw.deliverables,
  } : null);
  return {
    id: toText(raw.id) || `${group}:${toText(raw.name)}`,
    name: toText(raw.name || raw.title || raw.id) || "연결 노드",
    group,
    inferredType: toText(raw.inferredType || raw.inferred_type || raw.type),
    subtitle: toText(raw.subtitle || raw.category || raw.description),
    val: Number(raw.val || raw.value || 5),
    color: raw.color,
    item,
  };
}

function universeMethodsForCase(item, inferredType) {
  const text = getCaseText(item).toLowerCase();
  const methods = new Set();
  if (inferredType === "strategy_org_performance_gap" || text.includes("전략") || text.includes("vision")) methods.add("Strategy-KPI Map");
  if (inferredType === "rr_role_confusion" || text.includes("조직") || text.includes("r&r") || text.includes("직무")) methods.add("R&R Matrix");
  if (inferredType === "performance_system_failure" || text.includes("성과") || text.includes("kpi") || text.includes("평가")) methods.add("Performance Loop");
  if (inferredType === "transformation_execution_gap" || text.includes("uam") || text.includes("ai") || text.includes("미래")) methods.add("Scenario Roadmap");
  if (inferredType === "job_capability_gap" || text.includes("인력") || text.includes("보상") || text.includes("역량")) methods.add("Job-Based HR");
  methods.add(toText(item.solution_cluster) || "Fermat Point");
  return [...methods].slice(0, 4);
}

function buildCaseUniverseData(items = [], inferredType = activeRadarLens) {
  const nodes = [];
  const links = [];
  const byId = new Map();
  const addNode = (node) => {
    if (byId.has(node.id)) return byId.get(node.id);
    byId.set(node.id, node);
    nodes.push(node);
    return node;
  };
  const addLink = (source, target, kind, strength = 1) => {
    links.push({ source, target, kind, value: strength, color: kind === "proof" ? "rgba(251,191,36,.62)" : "rgba(255,255,255,.22)" });
  };

  addNode({ id: "root:strategy", name: "STRATEGY", group: "root", val: 18, color: "#ffffff", subtitle: "문제해결 전략컨설팅" });
  Object.entries(radarLensLabels).forEach(([type, label]) => {
    addNode({ id: `problem:${type}`, name: label, group: "problem", inferredType: type, val: type === inferredType ? 12 : 8, color: type === inferredType ? "#fbbf24" : "#5eead4", subtitle: radarLensBriefs[type] });
    addLink("root:strategy", `problem:${type}`, "problem", type === inferredType ? 3 : 1);
  });

  const universeItems = normalizeUniverseItems(items);
  universeItems.forEach((item, index) => {
    const title = publicProjectTitle(item, index + 1);
    const type = bestInferenceTypeForCase(item);
    const caseId = `case:${toText(item.id) || index}:${title}`;
    const category = clientCategory(item);
    const domainId = `domain:${category}`;
    const output = clampText(toText(item.deliverables) || "전략 산출물", 32);
    const outputId = `output:${output}`;

    addNode({ id: caseId, name: title, group: "case", inferredType: type, item, val: type === inferredType ? 11 : 7, color: type === inferredType ? "#f59e0b" : "#93c5fd", subtitle: category });
    addNode({ id: domainId, name: category, group: "domain", val: 5, color: "#38bdf8", subtitle: "산업/기관 유형" });
    addNode({ id: outputId, name: output, group: "output", val: 4, color: "#a7f3d0", subtitle: "산출물" });
    addLink(`problem:${type}`, caseId, "proof", type === inferredType ? 3 : 1);
    addLink(caseId, domainId, "domain", 1);
    addLink(caseId, outputId, "output", 1);

    universeMethodsForCase(item, type).forEach((method) => {
      const methodId = `method:${method}`;
      addNode({ id: methodId, name: method, group: "method", val: 5, color: "#c4b5fd", subtitle: "방법론" });
      addLink(caseId, methodId, "method", 1);
    });
  });

  (Array.isArray(caseUniverseContent.nodes) ? caseUniverseContent.nodes : []).forEach((raw) => {
    const node = normalizeUniverseNode(raw);
    addNode({
      ...node,
      color: node.color || (node.group === "case" ? "#f59e0b" : node.group === "method" ? "#c4b5fd" : node.group === "domain" ? "#38bdf8" : "#e5e7eb"),
      val: node.val || 5,
    });
    if (node.group === "case" && node.inferredType) addLink(`problem:${node.inferredType}`, node.id, "proof", 2);
  });

  (Array.isArray(caseUniverseContent.links) ? caseUniverseContent.links : []).forEach((raw) => {
    const sourceId = toText(raw.source);
    const targetId = toText(raw.target);
    if (!sourceId || !targetId) return;
    if (!byId.has(sourceId)) addNode({ id: sourceId, name: sourceId.replace(/^[^:]+:/, ""), group: "custom", val: 3, color: "#e5e7eb" });
    if (!byId.has(targetId)) addNode({ id: targetId, name: targetId.replace(/^[^:]+:/, ""), group: "custom", val: 3, color: "#e5e7eb" });
    addLink(sourceId, targetId, toText(raw.kind || raw.type || "custom"), Number(raw.value || raw.strength || 1));
  });

  const cases = nodes.filter((node) => node.group === "case");
  cases.forEach((node, index) => {
    cases.slice(index + 1, index + 7).forEach((other) => {
      if (node.inferredType === other.inferredType || node.subtitle === other.subtitle) {
        addLink(node.id, other.id, "similar", 0.35);
      }
    });
  });

  return { nodes, links };
}

function updateCaseUniverseFocus(node) {
  const target = document.getElementById("caseUniverseFocus");
  if (!target || !node) return;
  const label = node.group === "case" ? "대표 실적 노드" : node.group === "problem" ? "문제유형 노드" : node.group === "method" ? "방법론 노드" : node.group === "domain" ? "산업 노드" : "연결 노드";
  const title = escapeHTML(node.name);
  const subtitle = escapeHTML(node.subtitle || radarLensLabels[node.inferredType] || "연결 맥락");
  const item = node.item;
  const caseTitleText = item ? publicProjectTitle(item, 1) : node.name;
  const contextText = item ? toText(item.problem) || toText(item.approach) || toText(item.solution_cluster) : toText(node.subtitle || "");
  target.innerHTML = `
    <span>${label}</span>
    <b>${title}</b>
    <p>${subtitle}</p>
    ${item ? `<a class="btn secondary" href="#contact" data-inquiry-cta="case_universe" data-inquiry-source="case_universe" data-inquiry-route="case_universe" data-inquiry-case-title="${escapeHTML(caseTitleText)}" data-inquiry-case-id="${escapeHTML(toText(item.id) || node.id)}" data-inquiry-inferred-type="${escapeHTML(node.inferredType || "")}" data-inquiry-case-context="${escapeHTML(clampText(contextText, 64))}">이 연결구조로 대표 진단 요청</a>` : ""}
  `;
}

function focusCaseUniverseNode(node) {
  if (!node) return;
  updateCaseUniverseFocus(node);
  const inferredType = node.inferredType || activeRadarLens;
  if (node.group === "case" && node.item) {
    const title = publicProjectTitle(node.item, 1);
    setInquiryContext({
      source: "case_universe",
      route: "case_universe",
      sourceTitle: title,
      sourceId: toText(node.item.id) || node.id,
      inferredType,
      caseContext: toText(node.item.problem) || toText(node.item.approach) || "문제 유형과 산출물의 연결 축으로 선별",
    });
    updateDiagnosisDock({ label: "Case Universe", title: `${inferLabel(inferredType)} - ${title}`, inferredType, route: "case_universe" });
    renderCaseGrid(allCases.length ? allCases : defaultProofs, inferredType);
    renderRadarStats(allCases.length ? allCases : defaultProofs, inferredType);
    track("case_cta_click", {
      source_section: "case_universe",
      target_id: toText(node.item.id) || node.id,
      target_title: title,
      source: "case_universe",
      route: "case_universe",
      case_context: toText(node.item.problem) || toText(node.item.approach) || "",
    });
  } else if (inferredType) {
    setInquiryContext({
      source: "case_universe",
      route: "case_universe",
      sourceTitle: node.name,
      sourceId: node.id,
      caseContext: toText(node.subtitle || ""),
      inferredType,
    });
    updateDiagnosisDock({ label: "Case Universe", title: `${node.name} 연결망`, inferredType, route: "case_universe" });
  }
  if (caseUniverseGraph && Number.isFinite(node.x) && Number.isFinite(node.y) && Number.isFinite(node.z)) {
    const distance = 118;
    const distRatio = 1 + distance / Math.max(1, Math.hypot(node.x, node.y, node.z));
    caseUniverseGraph.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, node, 1100);
  }
}

function createCaseUniverseGraph(container) {
  const config = { controlType: "orbit", rendererConfig: { antialias: true, alpha: true } };
  try {
    return window.ForceGraph3D(config)(container);
  } catch (error) {
    return new window.ForceGraph3D(container, config);
  }
}

function initCaseUniverse(items = [], inferredType = activeRadarLens) {
  const container = document.getElementById("caseUniverseGraph");
  const shell = document.getElementById("case-radar");
  if (!container || !window.ForceGraph3D) return false;
  const graphData = buildCaseUniverseData(items, inferredType);
  shell?.classList.add("universe-ready");
  if (!caseUniverseGraph) {
    caseUniverseGraph = createCaseUniverseGraph(container)
      .backgroundColor("rgba(0,0,0,0)")
      .showNavInfo(false)
      .nodeRelSize(4.4)
      .nodeOpacity(0.9)
      .nodeResolution(16)
      .nodeColor((node) => node.color)
      .nodeVal((node) => node.val || 4)
      .nodeLabel((node) => `<b>${escapeHTML(node.name)}</b><br>${escapeHTML(node.subtitle || node.group)}`)
      .linkColor((link) => link.color || "rgba(255,255,255,.18)")
      .linkOpacity(0.35)
      .linkWidth((link) => Math.max(0.2, (link.value || 1) * 0.7))
      .linkDirectionalParticles((link) => link.kind === "proof" ? 2 : link.kind === "similar" ? 1 : 0)
      .linkDirectionalParticleWidth(1.15)
      .linkDirectionalParticleSpeed(0.0035)
      .onNodeClick(focusCaseUniverseNode)
      .onNodeHover((node) => {
        container.style.cursor = node ? "pointer" : "grab";
      });
    try {
      caseUniverseGraph.d3Force("charge").strength(-115);
      caseUniverseGraph.d3Force("link").distance((link) => link.kind === "proof" ? 48 : 78);
    } catch (error) {
      // Some CDN builds expose a narrower API; the graph still renders without force tuning.
    }
    window.addEventListener("resize", () => {
      const rect = container.getBoundingClientRect();
      if (rect.width && rect.height) caseUniverseGraph.width(rect.width).height(rect.height);
    });
  }
  const rect = container.getBoundingClientRect();
  caseUniverseGraph.width(Math.max(320, rect.width)).height(Math.max(420, rect.height)).graphData(graphData);
  const focusNode = graphData.nodes.find((node) => node.inferredType === inferredType && node.group === "case") || graphData.nodes[0];
  updateCaseUniverseFocus(focusNode);
  return true;
}

function initCaseRadar(items = []) {
  const source = (Array.isArray(items) && items.length ? items : defaultProofs).slice(0, 72);
  if (initCaseUniverse(source, activeRadarLens)) return;
  const canvas = document.getElementById("caseRadarCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const radarSource = source.slice(0, 8);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let frame = 0;
  let active = true;
  const axes = [
    { label: "Strategy", x: 0.2, y: 0.24, color: "rgba(15,118,110,.95)" },
    { label: "Organization", x: 0.28, y: 0.72, color: "rgba(37,99,235,.92)" },
    { label: "Performance", x: 0.68, y: 0.3, color: "rgba(183,121,31,.95)" },
    { label: "Future", x: 0.74, y: 0.76, color: "rgba(255,255,255,.82)" },
  ];
  const nodes = radarSource.map((item, index) => {
    const text = getCaseText(item).toLowerCase();
    const xBias = text.includes("조직") || text.includes("r&r") ? 0.28 : text.includes("uam") || text.includes("ai") ? 0.76 : text.includes("성과") || text.includes("kpi") ? 0.66 : 0.42;
    const yBias = text.includes("미래") || text.includes("uam") || text.includes("ai") ? 0.72 : text.includes("성과") ? 0.34 : 0.5;
    return {
      item,
      x: xBias,
      y: yBias,
      vx: (index % 2 ? 0.0012 : -0.001) * (1 + index * 0.08),
      vy: (index % 3 ? -0.001 : 0.0011) * (1 + index * 0.06),
      size: 5 + (index % 3) * 2,
      color: axes[index % axes.length].color,
      label: caseTitle(item).slice(0, 12),
    };
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function drawGrid() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    axes.forEach((axis) => {
      const ax = axis.x * width;
      const ay = axis.y * height;
      ctx.fillStyle = axis.color;
      ctx.beginPath();
      ctx.arc(ax, ay, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.52)";
      ctx.font = "900 11px Inter, sans-serif";
      ctx.fillText(axis.label, ax + 10, ay - 8);
    });
  }

  function draw() {
    drawGrid();
    const pulse = reduced ? 0.5 : (Math.sin(frame * 0.025) + 1) / 2;
    nodes.forEach((node, index) => {
      axes.forEach((axis) => {
        const x1 = node.x * width;
        const y1 = node.y * height;
        const x2 = axis.x * width;
        const y2 = axis.y * height;
        const distance = Math.hypot(x1 - x2, y1 - y2);
        if (distance < width * 0.58) {
          ctx.strokeStyle = `rgba(255,255,255,${Math.max(0.035, 0.14 - distance / 2200)})`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      });
      const x = node.x * width;
      const y = node.y * height;
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(x, y, node.size + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.82)";
      ctx.font = "800 12px Pretendard, Inter, sans-serif";
      ctx.fillText(node.label, x + 12, y + 4 + (index % 2) * 14);
    });
  }

  function tick() {
    frame += 1;
    if (active) {
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0.16 || node.x > 0.82) node.vx *= -1;
        if (node.y < 0.18 || node.y > 0.82) node.vy *= -1;
      });
      draw();
    }
    if (!reduced) requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      active = entries.some((entry) => entry.isIntersecting);
      if (active) draw();
    }, { rootMargin: "180px 0px", threshold: 0.01 });
    observer.observe(canvas);
  }
  window.addEventListener("resize", resize);
  resize();
  if (!reduced) requestAnimationFrame(tick);
}

function applyRadarLens(inferredType, options = {}) {
  activeRadarLens = inferredType || activeRadarLens;
  document.querySelectorAll("[data-radar-lens]").forEach((button) => {
    button.classList.toggle("active", button.dataset.radarLens === activeRadarLens);
  });
  renderCaseGrid(allCases.length ? allCases : defaultProofs, activeRadarLens);
  renderRadarStats(allCases.length ? allCases : defaultProofs, activeRadarLens);
  if (caseUniverseGraph) initCaseUniverse(allCases.length ? allCases : defaultProofs, activeRadarLens);
  setInquiryContext({
    source: "case_radar",
    route: "case_radar",
    sourceTitle: radarLensLabels[activeRadarLens] || activeRadarLens,
    sourceId: activeRadarLens,
    inferredType: activeRadarLens,
  });
  updateDiagnosisDock({ label: "Proof Lens", title: radarLensBriefs[activeRadarLens] || radarLensLabels[activeRadarLens], inferredType: activeRadarLens, route: "case_radar" });
  if (options.scroll) {
    document.getElementById("caseGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function observeProofVisibility() {
  const proofElements = document.querySelectorAll("[id^='proof-']");
  if (!("IntersectionObserver" in window) || !proofElements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const proofId = entry.target.getAttribute("id");
      if (observedProofs.has(proofId)) return;
      observedProofs.add(proofId);
      track("proof_view", { source_section: "flagship_case", target_id: proofId, target_title: entry.target.querySelector("h3")?.textContent || "" });
    });
  }, { rootMargin: "-10% 0px -52% 0px", threshold: 0.12 });
  proofElements.forEach((item) => observer.observe(item));
}

function renderTrackRecords() {
  const filtered = activeTheme === "all" ? projectRecords : projectRecords.filter((item) => String(item.theme || "").includes(activeTheme));
  const groups = new Map();
  if (!filtered.length) {
    $("#trackList").innerHTML = `<section class="track-group"><h3>기록</h3><div class="track-items"><div class="track-item"><b>실적 데이터 로딩 중</b><p>관리자에서 실적을 등록해두면 실시간으로 확인됩니다.</p></div></div></section>`;
    return;
  }
  filtered.forEach((item) => {
    const key = `${item.theme} / ${item.sector}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  $("#trackList").innerHTML = [...groups.entries()].map(([group, items]) => `<section class="track-group"><h3>${group}</h3><div class="track-items">${items.map((item, index) => {
    const title = publicProjectTitle(item, index + 1);
    const category = clientCategory(item);
    return `<div class="track-item"><b>${category}</b><p>${title}</p></div>`;
  }).join("")}</div></section>`).join("");
}

async function loadCaseUniverseContent() {
  const response = await fetch("/case-universe.json", { cache: "no-store" }).then((res) => {
    if (!res.ok) return null;
    return res.json();
  }).catch(() => null);
  if (!response || typeof response !== "object") return caseUniverseContent;
  caseUniverseContent = {
    items: Array.isArray(response.items) ? response.items : [],
    nodes: Array.isArray(response.nodes) ? response.nodes : [],
    links: Array.isArray(response.links) ? response.links : [],
  };
  return caseUniverseContent;
}

async function loadContent() {
  const response = await fetch("/api/content").then((res) => res.json()).catch(() => ({ cases: [], slides: [], project_records: [] }));
  await loadStrategyV10Data();
  const v10Cases = strategyV10State.records.filter(v10AllowedForPublic).map(v10RecordToCaseItem);
  const cases = Array.isArray(response.cases) && response.cases.length ? response.cases : v10Cases;
  projectRecords = Array.isArray(response.project_records) && response.project_records.length ? response.project_records : v10Cases;
  await loadCaseUniverseContent();
  const flagshipCases = pickFlagshipCases(cases, 6);
  renderFlagshipProof(flagshipCases);
  initCaseRadar(flagshipCases);
  allCases = cases.length ? cases : defaultProofs;
  renderConversionEngine(allCases);
  renderCaseGrid(allCases, activeRadarLens);
  renderRadarStats(allCases, activeRadarLens);
  const slides = Array.isArray(response.slides) ? response.slides : [];
  $("#slideGrid").innerHTML = slides.map((item) => `<article><b>${toText(item.title)}</b><p>${toText(item.summary)}</p>${toText(item.link_url) ? `<p><a href="${item.link_url}" target="_blank" rel="noreferrer">자료 보기</a></p>` : ""}</article>`).join("");
  renderTrackRecords();
  observeProofVisibility();
}
$("#signupForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formPayload(event.currentTarget); data.consent = event.currentTarget.elements.consent.checked;
  const submitButton = event.currentTarget.querySelector("button[type='submit']");
  const form = event.currentTarget;
  setFormBusy(form, true);
  const response = await postJSON("/api/signup", data);
  if (response.user_id) {
    state.userId = response.user_id; localStorage.setItem("strat_user_id", response.user_id);
    track("contact_start", { source_section: "signup" });
    $("#signupNote").textContent = "회원 등록이 완료되었습니다. 다음 단계에 맞춰 빠르게 안내드리겠습니다.";
  } else {
    $("#signupNote").textContent = response.error || "회원 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  }
  setFormBusy(form, false);
});

$("#inquiryForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formPayload(event.currentTarget);
  data.user_id = state.userId;
  data.inferred_type = state.inferredType;
  data.inquiry_source = state.inquiryContext.source;
  data.inquiry_case_title = state.inquiryContext.sourceTitle;
  data.inquiry_route = state.inquiryContext.route;
  data.inquiry_inferred_type = state.inquiryContext.inferredType;
  data.inquiry_case_context = state.inquiryContext.caseContext;
  data.message = enrichInquiryMessage(data);

  track("contact_start", { source_section: "contact_submit", source: state.inquiryContext.source || "direct", route: state.inquiryContext.route || "direct", route_id: state.inquiryContext.sourceId || "", has_inferred_type: !!state.inferredType });
  const form = event.currentTarget;
  setFormBusy(form, true);
  const response = await postJSON("/api/inquiry", data);
  if (response.ok) {
    track("inquiry_submit", {
      source_section: "contact",
      source: state.inquiryContext.source || "direct",
      route: state.inquiryContext.route || "direct",
      route_id: state.inquiryContext.sourceId || "",
      has_inferred_type: !!state.inferredType,
      case_context: state.inquiryContext.caseContext || "",
    });
    $("#inquiryNote").textContent = "문의가 정상적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.";
  } else {
    $("#inquiryNote").textContent = response.error || "문의 전송이 실패했습니다. 잠시 후 다시 시도해 주세요.";
  }
  setFormBusy(form, false);
});

$("#qaForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formPayload(event.currentTarget); data.user_id = state.userId;
  const form = event.currentTarget;
  setFormBusy(form, true);
  const response = await postJSON("/api/qa", data);
  if (response.ok) {
    track("qa_submit", { source_section: "qa" });
    $("#qaNote").textContent = "질문이 접수되었습니다.";
  } else {
    $("#qaNote").textContent = response.error || "질문 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  }
  setFormBusy(form, false);
});

document.querySelectorAll("[data-theme-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeTheme = button.dataset.themeFilter;
    document.querySelectorAll("[data-theme-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderTrackRecords();
  });
});

function initStrategyCanvas() {
  const canvas = document.getElementById("strategyCanvas");
  if (!canvas) return;
  const hero = canvas.closest(".hero");
  const ctx = canvas.getContext("2d");
  const labels = ["Sein", "Sollen", "KPI", "R&R", "AI", "ESG", "Execution", "Fermat"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0; let height = 0; let nodes = []; let frame = 0;

  function resize() {
    const box = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(320, Math.floor(box.width));
    height = Math.max(520, Math.floor(box.height));
    canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes = labels.map((label, index) => ({ label, x: width * (0.12 + (index % 4) * 0.22) + (Math.floor(index / 4) ? 26 : 0), y: height * (0.18 + Math.floor(index / 4) * 0.42) + ((index % 2) * 34), vx: index % 2 ? 0.16 : -0.12, vy: index % 3 ? 0.1 : -0.14, size: index === 1 || index === 7 ? 4.4 : 3.2 }));
    draw();
  }
  function drawGrid() {
    ctx.strokeStyle = "rgba(21,23,26,.055)"; ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    const pulse = reduceMotion ? 0.5 : (Math.sin(frame * 0.018) + 1) / 2;
    nodes.forEach((node, index) => {
      for (let j = index + 1; j < nodes.length; j += 1) {
        const other = nodes[j];
        const distance = Math.hypot(node.x - other.x, node.y - other.y);
        if (distance < width * 0.36) {
          ctx.strokeStyle = `rgba(15,118,110,${Math.max(0.045, 0.18 - distance / 1400)})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y); ctx.stroke();
        }
      }
    });
    nodes.forEach((node, index) => {
      const radius = node.size + (index % 2 ? pulse : 1 - pulse) * 1.4;
      ctx.fillStyle = index === 7 ? "rgba(183,121,31,.92)" : "rgba(15,118,110,.92)";
      ctx.beginPath(); ctx.arc(node.x, node.y, radius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(21,23,26,.62)"; ctx.font = "800 12px Inter, sans-serif"; ctx.fillText(node.label, node.x + 10, node.y - 9);
    });
  }
  function tick() {
    frame += 1;
    nodes.forEach((node) => {
      node.x += node.vx; node.y += node.vy;
      if (node.x < 38 || node.x > width - 38) node.vx *= -1;
      if (node.y < 44 || node.y > height - 44) node.vy *= -1;
    });
    draw();
    if (!reduceMotion) requestAnimationFrame(tick);
  }
  window.addEventListener("resize", resize);
  resize();
  if (!reduceMotion) requestAnimationFrame(tick);
}

function initMagneticControls() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;
  const controls = document.querySelectorAll(".btn, .options button, .cards button, .decision-grid button");
  controls.forEach((control) => {
    if (magneticBound.has(control)) return;
    magneticBound.add(control);
    control.addEventListener("pointermove", (event) => {
      const rect = control.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) - 0.5;
      const y = ((event.clientY - rect.top) / rect.height) - 0.5;
      control.style.setProperty("--mag-x", `${(x * 8).toFixed(2)}px`);
      control.style.setProperty("--mag-y", `${(y * 7).toFixed(2)}px`);
    });
    control.addEventListener("pointerleave", () => {
      control.style.setProperty("--mag-x", "0px");
      control.style.setProperty("--mag-y", "0px");
    });
  });
}

function initProofDepth() {
  const panels = [...document.querySelectorAll(".proof-panel")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!panels.length || reduced) return;
  let ticking = false;
  const update = () => {
    const focusLine = window.innerHeight * 0.48;
    panels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const distance = Math.min(1, Math.abs(center - focusLine) / Math.max(1, window.innerHeight * 0.7));
      const depth = Math.max(0, 1 - distance);
      panel.style.setProperty("--depth", depth.toFixed(3));
      panel.style.setProperty("--tilt", `${((0.5 - depth) * 2.4).toFixed(2)}deg`);
    });
    ticking = false;
  };
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
}

function initLenisScroll() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !window.Lenis) return null;
  const lenis = new window.Lenis({
    duration: 1.08,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.88,
    touchMultiplier: 1.2,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  if (window.ScrollTrigger) {
    lenis.on("scroll", window.ScrollTrigger.update);
  }
  document.documentElement.classList.add("lenis-ready");
  return lenis;
}

function initAwardMotion() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap-ready");

  gsap.set(".hero-copy > *", { y: 28, autoAlpha: 0 });
  gsap.set(".finder", { y: 34, rotateX: 3, autoAlpha: 0, transformOrigin: "50% 50%" });
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to(".hero-copy > *", { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.075 })
    .to(".finder", { y: 0, rotateX: 0, autoAlpha: 1, duration: 0.95 }, "-=0.55");

  gsap.to(".strategy-canvas", {
    yPercent: 8,
    scale: 1.08,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
  });
  gsap.to(".impact-frame", {
    yPercent: -7,
    opacity: 0.38,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
  });

  gsap.utils.toArray(".route-stage .journey-step, .hero-signals div, .command-deck div, .radar-lens button, .radar-stats div").forEach((item, index) => {
    gsap.fromTo(item,
      { y: 26, autoAlpha: 0, scale: 0.96 },
      {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.72,
        delay: index * 0.035,
        ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 88%", once: true },
      });
  });

  gsap.fromTo(".case-radar",
    { y: 44, autoAlpha: 0, scale: 0.96 },
    { y: 0, autoAlpha: 1, scale: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".case-radar", start: "top 82%", once: true } });
  gsap.to(".case-universe-graph, .case-universe-fallback",
    { yPercent: -7, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".case-radar", start: "top bottom", end: "bottom top", scrub: 1 } });

  gsap.utils.toArray(".proof-panel").forEach((panel) => {
    const copy = panel.querySelector(".proof-copy");
    const visual = panel.querySelector(".proof-visual");
    gsap.fromTo(panel,
      { scale: 0.96, autoAlpha: 0.72 },
      {
        scale: 1,
        autoAlpha: 1,
        ease: "none",
        scrollTrigger: { trigger: panel, start: "top 82%", end: "top 24%", scrub: 0.65 },
      });
    if (copy) {
      gsap.fromTo(copy,
        { y: 52, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, ease: "power3.out", scrollTrigger: { trigger: panel, start: "top 72%", end: "top 42%", scrub: 0.9 } });
    }
    if (visual) {
      gsap.to(visual,
        { yPercent: -8, scale: 1.06, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 } });
    }
  });

  gsap.utils.toArray(".section-head, .case-card, article, .track-group").forEach((item) => {
    gsap.fromTo(item,
      { y: 34, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.72, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 88%", once: true } });
  });
}

function initConversionJourney() {
  const journeyLinks = [...document.querySelectorAll("[data-journey-step]")];
  if (!journeyLinks.length) return;
  journeyLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const journeyId = toText(link.dataset.journeyStep);
      const stepLabel = (link.textContent || "").trim();
      const target = toText(link.getAttribute("href") || "");
      const targetId = target.replace(/^#/, "");
      const isContactStep = journeyId === "journey_contact" || targetId === "contact";
      setInquiryContext({
        source: "journey",
        route: journeyId || "journey",
        sourceTitle: stepLabel || `${targetId} 이동`,
        sourceId: targetId || journeyId || "journey",
      });
      if (isContactStep) {
        track("contact_start", {
          source_section: "journey_strip",
          source: "journey",
          route: journeyId || "journey_contact",
          route_id: targetId,
          target_id: targetId,
          target_title: stepLabel,
        });
        return;
      }
      track("case_cta_click", {
        source_section: "journey_strip",
        source: "journey",
        route: journeyId || "journey",
        route_id: targetId,
        target_id: targetId,
        target_title: stepLabel,
      });
    });
  });

  if (!("IntersectionObserver" in window)) return;
  const journeyTargets = journeyLinks
    .map((link) => document.querySelector(toText(link.getAttribute("href") || "")))
    .filter(Boolean);
  const onJourneyIntersect = (entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const visibleId = visible.target.id || "";
    journeyLinks.forEach((link) => {
      const id = toText(link.getAttribute("href") || "").replace(/^#/, "");
      link.classList.toggle("active", id === visibleId);
    });
  };
  const journeyObserver = new IntersectionObserver(onJourneyIntersect, {
    rootMargin: "-34% 0px -48% 0px",
    threshold: [0.08, 0.2, 0.42],
  });
  journeyTargets.forEach((target) => journeyObserver.observe(target));
}

function initPublishingLayer() {
  const progress = document.getElementById("scrollProgress");
  const hero = document.querySelector(".hero");
  const railLinks = [...document.querySelectorAll("[data-rail-target]")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const updateProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress); updateProgress();
  if (hero && !reduced) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--mx", `${x.toFixed(2)}%`);
      hero.style.setProperty("--my", `${y.toFixed(2)}%`);
      const shiftX = (x - 50) * 0.18;
      const shiftY = (y - 50) * 0.12;
      hero.style.setProperty("--shift-x", `${shiftX.toFixed(2)}px`);
      hero.style.setProperty("--shift-y", `${shiftY.toFixed(2)}px`);
      hero.style.setProperty("--shift-x-reverse", `${(-shiftX * 0.75).toFixed(2)}px`);
      hero.style.setProperty("--shift-y-reverse", `${(-shiftY * 0.75).toFixed(2)}px`);
    });
  }

  if ("IntersectionObserver" in window && railLinks.length) {
    const railTargets = railLinks.map((link) => document.getElementById(link.dataset.railTarget)).filter(Boolean);
    const railObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      railLinks.forEach((link) => link.classList.toggle("active", link.dataset.railTarget === visible.target.id));
    }, { rootMargin: "-32% 0px -48% 0px", threshold: [0.08, 0.2, 0.42] });
    railTargets.forEach((target) => railObserver.observe(target));
  }

  const revealTargets = document.querySelectorAll(".section-head, .case-card, article, .track-group, .proof-panel, .finder");
  revealTargets.forEach((target) => target.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in"); observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("in"));
  }
  initMagneticControls();
  initConversionJourney();
  initProofDepth();
  initLenisScroll();
  initAwardMotion();
}

document.addEventListener("click", (event) => {
  const radarLens = event.target.closest("[data-radar-lens]");
  if (radarLens) {
    const selectedLens = radarLens.dataset.radarLens;
    setInquiryContext({
      source: "case_radar",
      route: "case_radar",
      sourceTitle: radarLensLabels[selectedLens] || radarLens.textContent.trim(),
      sourceId: selectedLens || "case_radar",
      inferredType: selectedLens || "",
    });
    applyRadarLens(radarLens.dataset.radarLens, { scroll: true });
    track("case_cta_click", {
      source_section: "case_radar",
      target_id: selectedLens,
      target_title: radarLens.textContent.trim(),
      source: "case_radar",
      route: "case_radar",
    });
    return;
  }

  const railLink = event.target.closest("[data-rail-target]");
  if (railLink) {
    const targetId = railLink.dataset.railTarget || "";
    const targetLabel = railLink.textContent.trim();
    setInquiryContext({
      source: "conversion_rail",
      route: "conversion_rail",
      sourceTitle: targetId === "contact" ? "전환 레일 문의" : targetLabel,
      sourceId: `rail-${targetId}`,
      inferredType: state.inferredType || state.inquiryContext.inferredType || "",
    });
    if (targetId === "contact") {
      const route = "conversion_rail";
      track("contact_start", {
        source_section: "conversion_rail",
        source: "conversion_rail",
        route,
        route_id: targetId,
      });
      return;
    }
    track("case_cta_click", {
      source_section: "conversion_rail",
      target_id: targetId,
      target_title: targetLabel,
      source: "conversion_rail",
      route: targetId === "contact" ? "conversion_rail" : targetId,
    });
  }

  const prefillButton = event.target.closest("[data-prefill-problem]");
  if (prefillButton) {
    state.selectedProblem = prefillButton.dataset.prefillProblem || "";
    document.querySelectorAll("[data-prefill-problem]").forEach((button) => button.classList.toggle("active", button === prefillButton));
    const prioritySelect = document.querySelector("#inquiryForm select[name='priority_context']");
    const inquiryMessage = document.querySelector("#inquiryForm textarea[name='message']");
    const shortLabel = prefillButton.textContent.trim();
    if (prioritySelect) prioritySelect.value = shortLabel;
    setInquiryContextFromElement(prefillButton, {
      source: "decision_brief",
      route: "decision_brief",
      sourceTitle: shortLabel,
      sourceId: "decision_brief",
      inferredType: state.inferredType,
      caseContext: `의심 징후: ${shortLabel}`,
    });
    if (inquiryMessage && !inquiryMessage.value.trim()) {
      inquiryMessage.value = `현재 의심되는 문제: ${state.selectedProblem}\n관련 실적과 해결 접근을 기준으로 진단 상담을 요청합니다.`;
    }
    track("case_cta_click", { source_section: "decision_brief", target_title: shortLabel, target_id: "decision_brief", source: "decision_brief", route: "decision_brief" });
    $("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const target = event.target.closest("a[href='#contact'], [data-inquiry-cta], [data-case-cta], [data-event='hero_cta_click']");
  if (target && target.getAttribute("href") === "#contact" && (target.closest("[data-journey-step]") || target.closest("[data-rail-target]"))) {
    return;
  }
  if (target && target.getAttribute("href") === "#contact" && target.hasAttribute("data-inquiry-cta")) {
    const contactTarget = target.dataset.inquiryCaseId || target.dataset.caseId || "contact";
    setInquiryContextFromElement(target, { source: target.dataset.inquirySource || "contact", route: target.dataset.inquiryRoute || "contact", sourceId: contactTarget });
    track("contact_start", {
      source_section: "contact_entry",
      source: target.dataset.inquirySource || state.inquiryContext.source,
      route: target.dataset.inquiryRoute || "contact",
      route_id: contactTarget,
      target_id: contactTarget,
      target_title: target.dataset.inquiryCaseTitle || target.textContent.trim(),
    });
    return;
  }
  if (target && target.getAttribute("href") === "#contact" && !target.hasAttribute("data-case-cta") && !target.hasAttribute("data-inquiry-cta") && target.dataset.event !== "hero_cta_click") {
    setInquiryContextFromElement(target, { source: "contact_nav", route: target.dataset.inquiryRoute || "direct" });
    track("contact_start", {
      source_section: "contact_nav",
      source: target.dataset.inquirySource || "direct",
      route: target.dataset.inquiryRoute || "contact_nav",
      route_id: target.dataset.inquiryCaseId || "",
    });
    return;
  }

  const targetHref = event.target.closest("a[href]");
  const isContactTarget = targetHref && targetHref.getAttribute("href") === "#contact";

  const proofJump = event.target.closest("[data-proof-jump]");
  if (proofJump) {
    track("proof_jump_click", { source_section: "issue_result", target_id: proofJump.dataset.proofJump, target_title: proofJump.closest(".proof-jump")?.querySelector("b")?.textContent || "" });
    return;
  }

  const caseCta = event.target.closest("[data-case-cta]");
  if (caseCta) {
    setInquiryContextFromElement(caseCta);
    const sourceSection = caseCta.dataset.caseSource === "case_grid" ? "case_grid" : caseCta.dataset.caseSource === "case_study_lab" ? "case_study_lab" : caseCta.dataset.caseSource || "flagship_proof";
    track("case_cta_click", {
      source_section: sourceSection,
      target_title: caseCta.dataset.caseCta || caseCta.dataset.inquiryCaseTitle || "",
      target_id: caseCta.dataset.caseId || caseCta.closest(".proof-panel")?.getAttribute("id") || "",
      source: caseCta.dataset.inquirySource || state.inquiryContext.source,
      route: caseCta.dataset.inquiryRoute || state.inquiryContext.route,
      case_context: caseCta.dataset.inquiryCaseContext || "",
    });
    if (isContactTarget) {
      track("contact_start", {
        source_section: "case_cta",
        source: caseCta.dataset.inquirySource || state.inquiryContext.source,
        route: caseCta.dataset.inquiryRoute || "issue_result",
        route_id: caseCta.dataset.inquiryCaseId || "",
        target_id: caseCta.dataset.caseId || caseCta.dataset.inquiryCaseId || "",
        target_title: caseCta.dataset.caseCta || caseCta.dataset.inquiryCaseTitle || "",
      });
    }
    return;
  }

  const inquiryCta = event.target.closest("[data-inquiry-cta]");
  if (inquiryCta) {
    setInquiryContextFromElement(inquiryCta);
    track("case_cta_click", {
      source_section: inquiryCta.dataset.sourceSection || inquiryCta.dataset.inquirySource || "issue_result",
      source: inquiryCta.dataset.inquirySource || state.inquiryContext.source,
      route: inquiryCta.dataset.inquiryRoute || state.inquiryContext.route,
      route_id: inquiryCta.dataset.inquiryCaseId || "",
      target_id: inquiryCta.dataset.inquiryCaseId || "",
      target_title: inquiryCta.dataset.inquiryCaseTitle || "result_inquiry",
      case_context: inquiryCta.dataset.inquiryCaseContext || "",
    });
    if (isContactTarget) {
      track("contact_start", {
        source_section: "issue_inquiry_cta",
        source: inquiryCta.dataset.inquirySource || state.inquiryContext.source,
        route: inquiryCta.dataset.inquiryRoute || state.inquiryContext.route,
        route_id: inquiryCta.dataset.inquiryCaseId || "",
        target_id: inquiryCta.dataset.inquiryCaseId || "",
        target_title: inquiryCta.dataset.inquiryCaseTitle || "result_inquiry",
      });
    }
    return;
  }

  const heroCta = event.target.closest("[data-event='hero_cta_click']");
  if (heroCta && heroCta instanceof HTMLAnchorElement) {
    setInquiryContextFromElement(heroCta, { source: "hero", route: "hero" });
    track("hero_cta_click", { source_section: "hero_or_mobile_cta", metadata: { text: heroCta.textContent.trim() } });
  }
});

let contactStarted = false;
$("#inquiryForm")?.addEventListener("focusin", () => {
  if (contactStarted) return;
  contactStarted = true;
  track("contact_start", { source_section: "contact_form", source: state.inquiryContext.source || "direct", route: state.inquiryContext.route || "direct" });
});

$("#finder")?.addEventListener("click", () => {
  track("issue_start", { source_section: "hero_finder_container", metadata: { step: state.step } });
}, { once: true });

renderStep();
bindFormButtonLabels();
initCaseStudyLab();
initStrategyCanvas();
renderConversionEngine(defaultProofs);
(async () => {
  try {
    await loadContent();
  } catch (error) {
    await loadCaseUniverseContent();
    await loadStrategyV10Data().catch(() => null);
    const v10Cases = strategyV10State.records.filter(v10AllowedForPublic).map(v10RecordToCaseItem);
    allCases = defaultProofs;
    if (v10Cases.length) allCases = v10Cases;
    renderConversionEngine(defaultProofs);
    projectRecords = v10Cases;
    renderTrackRecords();
    renderFlagshipProof(allCases);
    initCaseRadar(allCases);
    observeProofVisibility();
  } finally {
    renderConversionEngine(allCases);
    await initV10EvidenceOS().catch(() => null);
    initPublishingLayer();
  }
})();
setInquiryContext({ source: "direct", route: "direct", sourceTitle: "홈페이지 진입", sourceId: "homepage", inferredType: state.inferredType || "" });

