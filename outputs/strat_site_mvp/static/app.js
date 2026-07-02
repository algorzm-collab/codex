const TRACKED_EVENTS = new Set([
  "issue_finder_start",
  "issue_result_view",
  "proof_jump_click",
  "case_contact_cta_click",
  "contact_form_start",
  "contact_form_submit",
]);

const EVENT_ALIAS = {
  hero_cta_click: "contact_form_start",
  issue_start: "issue_finder_start",
  issue_complete: "issue_result_view",
  proof_view: "proof_jump_click",
  case_cta_click: "case_contact_cta_click",
  contact_start: "contact_form_start",
  inquiry_submit: "contact_form_submit",
  qa_submit: "contact_form_submit",
  issue_finder_start: "issue_finder_start",
  issue_result_view: "issue_result_view",
  proof_jump_click: "proof_jump_click",
  case_contact_cta_click: "case_contact_cta_click",
  contact_form_start: "contact_form_start",
  contact_form_submit: "contact_form_submit",
};

const state = {
  userId: localStorage.getItem("strat_user_id") || null,
  sessionId: localStorage.getItem("strat_session_id") || crypto.randomUUID(),
  step: 0,
  answers: {},
  inferredType: "",
  inquiryContext: {
    source: "direct",
    route: "",
    sourceTitle: "",
    sourceId: "",
    inferredType: "",
  },
};
localStorage.setItem("strat_session_id", state.sessionId);

function setInquiryContext(next = {}) {
  state.inquiryContext = {
    ...state.inquiryContext,
    ...next,
    inferredType: next.inferredType || state.inferredType || state.inquiryContext.inferredType || "",
    source: next.source || state.inquiryContext.source || "direct",
  };

  const route = state.inquiryContext.route || "";
  const source = state.inquiryContext.source || "";
  const sourceTitle = state.inquiryContext.sourceTitle || "";
  const sourceId = state.inquiryContext.sourceId || "";
  const inferredType = state.inquiryContext.inferredType || "";

  const inquirySource = $("#inquirySource");
  const inquiryCaseTitle = $("#inquiryCaseTitle");
  const inquiryRoute = $("#inquiryRoute");
  const inquiryInferredType = $("#inquiryInferredType");
  const notice = $("#inquiryIntentNotice");

  if (inquirySource) inquirySource.value = source;
  if (inquiryCaseTitle) inquiryCaseTitle.value = sourceTitle;
  if (inquiryRoute) inquiryRoute.value = route;
  if (inquiryInferredType) inquiryInferredType.value = inferredType;

  if (notice) {
    if (!route || route === "direct") {
      notice.hidden = true;
      notice.textContent = "";
      return;
    }
    const labels = {
      issue_result: "진단 결과 기반 문의 유도",
      flagship_case: "대표 실적 기반 문의 유도",
      nav_contact: "상단 메뉴에서 유입된 문의",
      contact_nav: "상단 메뉴에서 유입된 문의",
      case_grid: "사례 카드에서 유입된 문의",
      direct: "문의 유도",
      hero: "히어로 문진 유도",
      contact_form: "문의 폼 시작",
    };
    notice.hidden = false;
    notice.textContent = `${labels[route] || "문의 유도"} (${sourceId || sourceTitle || "입력 컨텍스트"} · ${inferredType || "진단 전"})`;
  }
}

function setInquiryContextFromElement(element = null, fallback = {}) {
  if (!element) return;
  setInquiryContext({
    source: element.dataset.inquirySource || element.dataset.source || fallback.source || "direct",
    route: element.dataset.inquiryRoute || element.dataset.route || fallback.route || "direct",
    sourceTitle: element.dataset.inquiryCaseTitle || element.textContent?.trim() || "",
    sourceId: element.dataset.inquiryCaseId || element.dataset.caseId || "",
    inferredType: state.inquiryContext.inferredType || state.inferredType || "",
  });
}

const steps = [
  {
    key: "symptom",
    label: "STEP 1 / 3",
    question: "현재 조직에서 가장 먼저 느끼는 병목은 무엇인가요?",
    options: [
      ["report_no_execution", "보고가 있어도 실행이 지연되고 있다"],
      ["unclear_owner", "의사결정권자와 책임자가 분명하지 않다"],
      ["too_many_kpi", "KPI가 너무 많아 우선순위를 정하기 어렵다"],
      ["evaluation_not_accepted", "성과 결과가 부서 간 합의 없이 내려온다"],
      ["reorg_no_standard", "조직변경만 반복되고 운영 기준은 없다"],
      ["transformation_not_actionable", "AI/ESG 전략은 있는데 실행 가설이 없다"],
    ],
  },
  {
    key: "scene",
    label: "STEP 2 / 3",
    question: "이 문제를 해결하려면 가장 먼저 바꿔야 할 장면은 무엇인가요?",
    options: [
      ["decision_meeting", "전략회의와 집행회의의 연결이 느슨하다"],
      ["cross_team", "부서 협업이 단기 이슈 중심으로만 흘러간다"],
      ["kpi_evaluation", "KPI와 평가 주기가 서로 맞물리지 않는다"],
      ["org_role", "조직 구조와 직무 체계가 중복/누락된다"],
      ["hr_capability", "인사 제도와 역량 지도가 연동되지 않는다"],
      ["external_policy", "외부 규제와 정책 변화가 판단을 흔들어준다"],
    ],
  },
  {
    key: "need",
    label: "STEP 3 / 3",
    question: "최종적으로 원하는 결과는 어디인가요?",
    options: [
      ["internal_logic", "전략-실행 연결 논리를 먼저 정리하고 싶다"],
      ["scope_before_project", "프로젝트 전에 범위를 정확히 고정하고 싶다"],
      ["strategy_to_execution", "실행 가능한 전략 산출물을 원한다"],
      ["org_kpi_alignment", "조직 목표와 KPI 정렬이 필요하다"],
      ["not_sure", "정확히 모르니 진단을 통해 정하고 싶다"],
    ],
  },
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
  hr_capability: { rr_role_confusion: 1 },
  external_policy: { strategy_org_performance_gap: 2, transformation_execution_gap: 1 },
};

const inferenceNarrative = {
  strategy_org_performance_gap: {
    title: "전략-실행 불일치형 문제",
    why: "전략 수립과 집행 체계가 분리되어, 기획은 좋지만 성과가 현장으로 전달되지 못합니다.",
    hypothesis: [
      "우선 의사결정→전략→실행의 연결을 하나의 지도에서 설계합니다.",
      "KPI와 평가를 실행 동선별로 재정렬해 성과 수용성을 끌어올립니다.",
    ],
    proofHint: "대규모 공기업·공공기관 전략 수립 프로젝트의 증거 기반 운영 방식으로 해결했습니다.",
    outcomeHint: "우선순위가 분명해지고 실행 지연이 줄어드는지 1회 점검 주기로 확인됩니다.",
    cta: "이 유형 기준, 진단 후 미팅 신청",
  },
  rr_role_confusion: {
    title: "조직 R&R 혼선형 문제",
    why: "책임과 권한이 중복·누락되어 빠른 의사결정이 어려운 상태입니다.",
    hypothesis: [
      "조직 재설계와 R&R 매핑을 함께 설계해 의사결정권을 단일화합니다.",
      "성과·보상과 연동해 역할 수행 유인을 정렬합니다.",
    ],
    proofHint: "국민체육진흥공단·국방 연구기관 등 조직재설계 사례에서 반복 검증된 방식입니다.",
    outcomeHint: "누가 결정을 내려야 하는지 명확해져 지연이 줄고 실행 오너십이 생깁니다.",
    cta: "이 유형의 조직설계 가설을 확인하고 싶으면 문의",
  },
  performance_system_failure: {
    title: "성과관리 미연결형 문제",
    why: "KPI와 평가가 단기 성과 지표만 따라가고 전략 성과로 회귀되지 않습니다.",
    hypothesis: [
      "성과체계와 보상구조를 함께 재설계해 결과 해석의 일관성을 확보합니다.",
      "사업성과·부서성과를 같은 언어로 묶어 수용 가능한 기준으로 정리합니다.",
    ],
    proofHint: "해양진흥공사, 주택도시보증공사 등의 성과관리 고도화 경험을 반영했습니다.",
    outcomeHint: "평가 수용성 증가로 운영팀-임원회의 간 이견이 줄고 성과 점검 주기가 짧아집니다.",
    cta: "성과 관리 체계 개선부터 논의하기",
  },
  transformation_execution_gap: {
    title: "변화 실행 고착형 문제",
    why: "AI/ESG 전략은 있으나 운영 프로세스가 준비되지 않아 실무 적용이 약합니다.",
    hypothesis: [
      "비전/정책 문장을 현장 실행 시나리오로 바로 변환합니다.",
      "우선순위-책임-자원 배치까지 함께 바꿔 실행 실패 가능성을 낮춥니다.",
    ],
    proofHint: "AI·ESG 연계 운영전략화와 UAM, 원전 등 변환 과제에서 실무형 프레임으로 연결해온 사례가 있습니다.",
    outcomeHint: "도입·학습·운영이 한 흐름으로 합쳐져 과업의 실행 마찰을 낮춥니다.",
    cta: "변환 실행 진단 요청하기",
  },
};

const flagshipProofByType = {
  strategy_org_performance_gap: {
    id: "proof-1",
    title: "신용보증기금 - NEW 비전 수립",
    label: "전략-실행 정렬 사례",
  },
  rr_role_confusion: {
    id: "proof-4",
    title: "서울디자인재단 - 조직성과평가 및 성과연동 설계",
    label: "조직·성과 통합 사례",
  },
  performance_system_failure: {
    id: "proof-3",
    title: "주택도시보증공사/해양진흥공사 - 성과관리 고도화",
    label: "성과체계 설계 사례",
  },
  transformation_execution_gap: {
    id: "proof-6",
    title: "UAM Team Korea - 전략-실행 프레임 구축",
    label: "AI/ESG 연계 실행사례",
  },
};

const defaultProofs = [
  {
    title: "신용보증기금 - NEW 비전 수립",
    client_type: "금융",
    problem: "조직 미션 변화와 조직구조 재설계 요구가 겹치며 전략 우선순위가 흔들렸습니다.",
    solution_cluster: "비전 정렬·조직·성과 프레임 구축",
    approach: "현상진단으로 핵심 제약을 추출하고, 실행 우선순위와 KPI 계열을 재정렬했습니다.",
    deliverables: "비전 실행체계, 핵심 KPI 세트, 조직 커뮤니케이션 아키텍처",
    customer_type: "신용보증기금",
    year_note: "2023",
    id: 1002,
  },
  {
    title: "해양진흥공사 - 중장기 경영 전략 수립",
    client_type: "공공/국책",
    problem: "중장기 성장전략과 부처 간 실행 동선이 불일치했습니다.",
    solution_cluster: "전략재정렬·사업포트폴리오 구조화",
    approach: "시나리오 기반으로 전략 축과 과제 우선순위를 재조정하고, 실행 가이드와 성과체계를 묶었습니다.",
    deliverables: "중장기 전략안, 사업체계 지도, 실행 가이드라인",
    customer_type: "해양진흥공사",
    year_note: "2020/2023",
    id: 1003,
  },
  {
    title: "주택도시보증공사 - 부서성과평가 간소화",
    client_type: "성과관리",
    problem: "평가 지표는 있었지만 현장 실행과 보상 연계가 약했습니다.",
    solution_cluster: "성과·보상 연계형 평가 설계",
    approach: "업무 산출단위와 보상 기준을 정렬해 조직 공통 언어로 수용성을 높였습니다.",
    deliverables: "성과평가 운영안, 보상 연동 규정, 합의 프레임",
    customer_type: "주택도시보증공사",
    year_note: "2023",
    id: 1004,
  },
  {
    title: "강원도개발공사 - 평창 올림픽 레거시 활용방안",
    client_type: "인프라/지역개발",
    problem: "대형 레거시 자산을 지역경제와 조직 미션으로 전환하지 못한 상태였습니다.",
    solution_cluster: "레거시-성장 포트폴리오 재설계",
    approach: "자산·조직·사업을 묶어 단계별 실행과 KPI로 재정의했습니다.",
    deliverables: "활용 전략, 기관 조직안, 실행계획",
    customer_type: "강원도개발공사",
    year_note: "2021/2022",
    id: 1005,
  },
  {
    title: "한국도로공사 - 미래전략 및 UAM 대응 전략",
    client_type: "인프라/교통",
    problem: "기술 규제·산업 변동이 빠른 환경에서 실행 중심의 장기안이 필요했습니다.",
    solution_cluster: "시나리오+실행로드맵 결합 설계",
    approach: "향후 6~10년의 도로·교통 전략 가설을 정리해 과제맵과 우선순위를 설계했습니다.",
    deliverables: "전략 아키텍처, 실행 체크리스트, 의사결정 기준표",
    customer_type: "한국도로공사",
    year_note: "2023/2024",
    id: 1006,
  },
  {
    title: "UAM Team Korea - 전략·조직·성과 정합 과제",
    client_type: "모빌리티/AI·ESG",
    problem: "비전·규제 변화 속에서 수행조직과 정책 실행이 분리되어 있었습니다.",
    solution_cluster: "AI·ESG 연계 실행전략",
    approach: "정책·산업·조직 체계를 연결해 단계별 실행 시나리오와 지표를 수립했습니다.",
    deliverables: "실행전략안, KPI 설계, 운영 체계",
    customer_type: "UAM Team Korea",
    year_note: "2024",
    id: 1007,
  },
];

const $ = (selector) => document.querySelector(selector);
let projectRecords = [];
let activeTheme = "all";
const observedProofs = new Set();

function postJSON(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .catch(() => ({ ok: false, error: "network" }));
}

function track(eventName, payload = {}) {
  const targetEvent = EVENT_ALIAS[eventName] || eventName;
  const event = TRACKED_EVENTS.has(targetEvent) ? targetEvent : EVENT_ALIAS[eventName] || eventName;
  if (!TRACKED_EVENTS.has(event)) {
    return Promise.resolve({ ok: true });
  }
  return postJSON("/api/event", {
    event_name: event,
    event_alias: eventName,
    session_id: state.sessionId,
    user_id: state.userId,
    path: location.pathname + location.hash,
    inferred_type: state.inferredType,
    ...payload,
    metadata: {
      ...(payload.metadata || {}),
      event_alias: eventName,
    },
  }).catch(() => null);
}

function formPayload(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function inferType() {
  const scores = {};
  const primary = routeBySymptom[state.answers.symptom] || "strategy_org_performance_gap";
  scores[primary] = 3;
  const weights = sceneWeights[state.answers.scene] || {};
  Object.entries(weights).forEach(([key, value]) => {
    scores[key] = (scores[key] || 0) + value;
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
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
    button.type = "button";
    button.textContent = label;
    if (state.answers[step.key] === value) button.classList.add("active");
    button.addEventListener("click", () => {
      state.answers[step.key] = value;
      [...options.children].forEach((child) => child.classList.remove("active"));
      button.classList.add("active");
      if (state.step === 0) {
        track("issue_start", {
          source_section: "issue_finder",
          step: state.step + 1,
          symptom: value,
          metadata: { source: "finder_step_option" },
        });
      }
    });
    options.appendChild(button);
  });
}

function buildRelatedProjects(items) {
  if (!items?.length) return "";
  return `
    <div class="diagnosis-block">
      <p><b>관련 실적</b></p>
      <div class="chips">
        ${items.map((item) => `
          <a class="chip" href="#${item.id || "proof-1"}">
            <b>${item.client}</b>
            <span>${item.project_title}${item.year_note ? ` / ${item.year_note}` : ""}</span>
          </a>
        `).join("")}
      </div>
    </div>
  `;
}

function buildChips(items) {
  if (!items?.length) return "";
  return `
    <div class="diagnosis-block">
      <p><b>진단 가설</b></p>
      <div class="chips">
        ${items.map((item) => `<div class=\"chip\">${item}</div>`).join("")}
      </div>
    </div>
  `;
}

async function showResult() {
  state.inferredType = inferType();
  const payload = {
    user_id: state.userId,
    session_id: state.sessionId,
    symptom: state.answers.symptom,
    scene: state.answers.scene,
    need: state.answers.need,
    inferred_type: state.inferredType,
  };

  const response = await postJSON("/api/issue", payload);
  if (response.session_id) {
    state.sessionId = response.session_id;
    localStorage.setItem("strat_session_id", state.sessionId);
  }

  const result = response.result || {};
  const diagnosis = inferenceNarrative[state.inferredType] || inferenceNarrative.strategy_org_performance_gap;
  const proof = flagshipProofByType[state.inferredType] || flagshipProofByType.strategy_org_performance_gap;

  track("issue_complete", {
    source_section: "issue_finder",
    target_id: proof.id,
    target_title: proof.title,
    inferred_type: state.inferredType,
  });
  setInquiryContext({
    source: "issue_result",
    route: "issue_result",
    sourceTitle: proof.title,
    sourceId: proof.id,
    inferredType: state.inferredType,
  });

  const headline = result.headline || `${diagnosis.title} 진단`;
  const why = result.interpretation || diagnosis.why;
  const hypothesis = result.hypothesis || diagnosis.hypothesis || [];
  const relatedProblem = result.problem_name || diagnosis.title;
  const outcome = result.outcome_hint || diagnosis.outcomeHint || "해당 진단 기준으로 다음 단계에서 우선순위를 압축해 제안할 수 있습니다.";
  const nextAction = result.next_action || diagnosis.cta || "진단 후 미팅 신청";
  const relatedProjects = buildRelatedProjects(result.related_projects || []);
  const proofHint = result.proof_hint || diagnosis.proofHint || "유사 조직에서 검증된 방식으로 실천해온 레퍼런스를 사용했습니다.";
  const visitorMatch = result.matching_context || "현재 체크인한 항목의 속성이 가장 강하게 드러난 유형입니다.";

  const hypothesisList = (hypothesis.length ? hypothesis : ["운영·지표·조직 중 한 축이 약화되면 실행 리스크가 커집니다."]).map((item) => `<li>${item}</li>`).join("");

  $("#result").hidden = false;
  $("#result").innerHTML = `
    <div class="diagnosis-block">
      <p class="kicker">Diagnosis Report</p>
      <p class="result-meta">
        <span>추정 문제 유형: ${state.inferredType}</span>
        <span>현재 단계: Step 3/3</span>
      </p>
      <h3>${headline}</h3>
      <p>${why}</p>
    </div>
    <div class="diagnosis-block">
      <p><b>현재 진단 문제</b></p>
      <p>${relatedProblem}</p>
    </div>
    <div class="diagnosis-grid">
      <div class="diagnosis-sub">
        <p><b>왜 이런지 추론</b></p>
        <ul>${hypothesisList}</ul>
      </div>
      <div class="diagnosis-sub">
        <p><b>실적 근거 연결</b></p>
        <p>${proofHint}</p>
      </div>
    </div>
    <div class="proof-jump">
      <span>${proof.label}</span>
      <b>${proof.title}</b>
      <p>${visitorMatch}</p>
      <a class="btn secondary" href="#${proof.id}" data-proof-jump="${proof.id}">이 실적에서 관련 맥락 보기</a>
    </div>
    ${relatedProjects}
    <div class="diagnosis-block">
      <p><b>예상 다음 액션</b></p>
      <p>${outcome}</p>
    </div>
    <p class="note">진단은 즉시 제안의 출발점입니다. 다음 단계로 1회 진단형 미팅을 제안합니다.</p>
    <a class="btn primary" href="#contact" data-inquiry-cta="result" data-inquiry-source="issue_result" data-inquiry-route="issue_result" data-inquiry-case-title="${proof.title}" data-inquiry-case-id="${proof.id}" data-event="hero_cta_click">${nextAction}</a>
  `;
  $("#result").scrollIntoView({ behavior: "smooth", block: "nearest" });
}


$("#nextBtn").addEventListener("click", async () => {
  const step = steps[state.step];
  if (!state.answers[step.key]) {
    $("#options button")?.focus();
    return;
  }
  if (state.step < steps.length - 1) {
    state.step += 1;
    renderStep();
    return;
  }
  await showResult();
});

function startFromMirror(symptom) {
  state.answers.symptom = symptom;
  state.step = 1;
  renderStep();
  track("issue_start", {
    source_section: "problem_mirror",
    symptom,
    metadata: { channel: "problem_mirror" },
  });
  $("#finder").scrollIntoView({ behavior: "smooth", block: "center" });
}

document.querySelectorAll("[data-symptom]").forEach((button) => {
  button.addEventListener("click", () => startFromMirror(button.dataset.symptom));
});

$("#signupForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formPayload(event.currentTarget);
  data.consent = event.currentTarget.elements.consent.checked;
  const response = await postJSON("/api/signup", data);
  if (response.user_id) {
    state.userId = response.user_id;
    localStorage.setItem("strat_user_id", response.user_id);
    track("contact_start", { source_section: "signup" });
    $("#signupNote").textContent = "회원 등록이 완료됐습니다. 이후 문의 시 더 정교한 맥락 반영이 가능합니다.";
  } else {
    $("#signupNote").textContent = response.error || "회원 등록 실패. 잠시 후 다시 시도해주세요.";
  }
});

$("#inquiryForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formPayload(event.currentTarget);
  data.user_id = state.userId;
  data.inferred_type = state.inferredType;
  data.inquiry_source = state.inquiryContext.source;
  data.inquiry_case_title = state.inquiryContext.sourceTitle;
  data.inquiry_route = state.inquiryContext.route;
  data.inquiry_inferred_type = state.inquiryContext.inferredType;
  track("contact_start", {
    source_section: "contact_submit",
    source: state.inquiryContext.source || "direct",
    route: state.inquiryContext.route || "direct",
    route_id: state.inquiryContext.sourceId || "",
    has_inferred_type: !!state.inferredType,
  });
  const response = await postJSON("/api/inquiry", data);
  if (response.ok) {
    track("inquiry_submit", {
      source_section: "contact",
      source: state.inquiryContext.source || "direct",
      route: state.inquiryContext.route || "direct",
      route_id: state.inquiryContext.sourceId || "",
      has_inferred_type: !!state.inferredType,
    });
    $("#inquiryNote").textContent = "문의가 접수됐습니다. 빠르게 답변드리겠습니다.";
  } else {
    $("#inquiryNote").textContent = response.error || "문의 접수 실패. 잠시 후 다시 시도해주세요.";
  }
});

$("#qaForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formPayload(event.currentTarget);
  data.user_id = state.userId;
  const response = await postJSON("/api/qa", data);
  if (response.ok) {
    track("qa_submit", { source_section: "qa" });
    $("#qaNote").textContent = "질문이 등록되었습니다.";
  } else {
    $("#qaNote").textContent = response.error || "질문 등록이 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
});

function toText(value) {
  return String(value || "").trim();
}

async function loadContent() {
  const response = await fetch("/api/content")
    .then((res) => res.json())
    .catch(() => ({
      cases: [],
      slides: [],
      project_records: [],
    }));
  renderFlagshipProof(response.cases.slice(0, 6));
  $("#caseGrid").innerHTML = response.cases.map((item, index) => `
    <article class=\"case-card\">
      <span class=\"tag\">${toText(item.customer_type) || "Strategy Case"}</span>
      <b>${toText(item.title)}</b>
      <p><b>문제</b><br>${toText(item.problem)}</p>
      <p><b>방식</b><br>${toText(item.approach)}</p>
      <p><b>성과</b><br>${toText(item.deliverables)}</p>
      <a
        class=\"btn secondary\"
        href=\"#contact\"
        data-case-cta=\"${toText(item.title)}\"
        data-case-id=\"case-grid-${index + 1}\"
        data-case-source=\"case_grid\"
        data-inquiry-source=\"case_grid\"
        data-inquiry-route=\"case_grid\"
        data-inquiry-case-title=\"${toText(item.title)}\"
        data-inquiry-case-id=\"case-grid-${index + 1}\"
        data-event=\"case_cta_click\"
      >이 사례로 진단 적용하기</a>
    </article>
  `).join("");
  $("#slideGrid").innerHTML = response.slides.map((item) => `
    <article>
      <b>${toText(item.title)}</b>
      <p>${toText(item.summary)}</p>
      ${toText(item.link_url) ? `<p><a href="${item.link_url}" target="_blank" rel="noreferrer">슬라이드 보기</a></p>` : ""}
    </article>
  `).join("");
  projectRecords = response.project_records || [];
  renderTrackRecords();
  observeProofVisibility();
}

function renderFlagshipProof(items) {
  const proof = $("#flagshipProof");
  if (!proof) return;
  const entries = items.length ? items.slice(0, 6) : defaultProofs;
  const proofLines = [
    "문제 가설을 빠르게 잡고, 전략-조직-성과를 동시에 연결했습니다.",
    "의사결정 구조와 실행 시나리오를 한 번에 정렬해 지연 비용을 줄였습니다.",
    "성과관리 체계와 운영 규범을 함께 설계해 실제 현장 적용을 강화했습니다.",
    "조직 재설계와 평가 연동으로 소유권 충돌을 줄이고 책임을 선명히 했습니다.",
    "디자인/성과 프레임을 반복 운용해 보고서가 아닌 실행체계로 정착했습니다.",
    "신규 과제의 규제·기술 변수까지 반영해 실행 가능한 경로를 제시했습니다.",
  ];

  proof.innerHTML = entries.map((item, index) => `
    <article class="proof-panel" id="proof-${index + 1}" data-proof-index="${index + 1}" data-proof-title="${toText(entries[index].title)}">
      <div class="proof-number">${String(index + 1).padStart(2, "0")}</div>
      <div class="proof-copy">
        <span class="tag">${toText(entries[index].customer_type) || "Flagship Case"}</span>
        <h3>${toText(entries[index].title)}</h3>
        <p class="proof-line">${proofLines[index] || "전략, 조직, 성과가 한 번에 수렴된 실적입니다."}</p>
        <dl>
          <div>
            <dt>문제</dt>
            <dd>${toText(entries[index].problem) || "조직 목표와 실행 간 간극이 컸던 과제입니다."}</dd>
          </div>
          <div>
            <dt>접근</dt>
            <dd>${toText(entries[index].approach) || "전략-조직-성과 체계를 동시에 정렬했습니다."}</dd>
          </div>
          <div>
            <dt>방법</dt>
            <dd>${toText(entries[index].solution_cluster) || "핵심 가설 수립 후 실행 프로토콜로 연결했습니다."}</dd>
          </div>
          <div>
            <dt>산출물</dt>
            <dd>${toText(entries[index].deliverables) || "전략 문서, 실행 지침, 운영체계."}</dd>
          </div>
          <div>
            <dt>실적 연계</dt>
            <dd>현재 입력한 문제 유형과 가장 가까운 유형의 실적입니다.</dd>
          </div>
        </dl>
        <a class="btn secondary" href="#contact" data-case-cta="${toText(entries[index].title)}" data-case-id="proof-${index + 1}" data-case-source="flagship_case" data-inquiry-source="flagship_case" data-inquiry-route="flagship_case" data-inquiry-case-title="${toText(entries[index].title)}" data-inquiry-case-id="proof-${index + 1}" data-event="case_cta_click">이 실적으로 진입 진단하기</a>
      </div>
      <div class="proof-visual" aria-hidden="true">
        <span>${toText(entries[index].solution_cluster) || "Strategy Map"}</span>
        <i></i><i></i><i></i>
      </div>
    </article>
  `).join("");
}

function observeProofVisibility() {
  const proofElements = document.querySelectorAll("[id^='proof-']");
  if (!("IntersectionObserver" in window) || !proofElements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const proofId = node.getAttribute("id");
      if (observedProofs.has(proofId)) return;
      observedProofs.add(proofId);
      const title = node.querySelector("h3")?.textContent || "";
      track("proof_view", {
        source_section: "flagship_case",
        target_id: proofId,
        target_title: title,
      });
    });
  }, { rootMargin: "-10% 0px -52% 0px", threshold: 0.12 });
  proofElements.forEach((item) => observer.observe(item));
}

function renderTrackRecords() {
  const filtered = activeTheme === "all"
    ? projectRecords
    : projectRecords.filter((item) => String(item.theme || "").includes(activeTheme));

  const groups = new Map();
  filtered.forEach((item) => {
    const key = `${item.theme} / ${item.sector}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  $("#trackList").innerHTML = [...groups.entries()].map(([group, items]) => `
    <section class=\"track-group\">
      <h3>${group}</h3>
      <div class=\"track-items\">
        ${items.map((item) => `
          <div class=\"track-item\">
            <b>${item.client}</b>
            <p>${item.project_title}${item.year_note ? ` / ${item.year_note}` : ""}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `).join("");
}

document.querySelectorAll("[data-theme-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeTheme = button.dataset.themeFilter;
    document.querySelectorAll("[data-theme-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderTrackRecords();
  });
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("a[href='#contact'], [data-inquiry-cta], [data-case-cta], [data-event='hero_cta_click']");
  if (target && target.getAttribute("href") === "#contact" && !target.hasAttribute("data-case-cta") && !target.hasAttribute("data-inquiry-cta") && target.dataset.event !== "hero_cta_click") {
    setInquiryContextFromElement(target, {
      source: "contact_nav",
      route: target.dataset.inquiryRoute || "direct",
    });
  }

  const proofJump = event.target.closest("[data-proof-jump]");
  if (proofJump) {
    track("proof_jump_click", {
      source_section: "issue_result",
      target_id: proofJump.dataset.proofJump,
      target_title: proofJump.closest(".proof-jump")?.querySelector("b")?.textContent || "",
    });
    return;
  }

  const caseCta = event.target.closest("[data-case-cta]");
  if (caseCta) {
    setInquiryContextFromElement(caseCta);
    const sourceSection = caseCta.dataset.caseSource === "case_grid" ? "case_grid" : "flagship_proof";
    track("case_cta_click", {
      source_section: sourceSection,
      target_title: caseCta.dataset.caseCta || caseCta.dataset.inquiryCaseTitle || "",
      target_id: caseCta.dataset.caseId || caseCta.closest(".proof-panel")?.getAttribute("id") || "",
    });
    return;
  }

  const inquiryCta = event.target.closest("[data-inquiry-cta]");
  if (inquiryCta) {
    setInquiryContextFromElement(inquiryCta);
    track("case_cta_click", {
      source_section: "issue_result",
      target_title: "result_inquiry",
    });
    return;
  }

  const heroCta = event.target.closest("[data-event='hero_cta_click']");
  if (heroCta && heroCta instanceof HTMLAnchorElement) {
    setInquiryContextFromElement(heroCta, { source: "hero", route: "direct" });
    track("hero_cta_click", {
      source_section: "hero_or_mobile_cta",
      metadata: { text: heroCta.textContent.trim() },
    });
  }
});

let contactStarted = false;
$("#inquiryForm").addEventListener("focusin", () => {
  if (contactStarted) return;
  contactStarted = true;
  track("contact_start", {
    source_section: "contact_form",
    source: state.inquiryContext.source || "direct",
    route: state.inquiryContext.route || "direct",
  });
});

$("#finder").addEventListener("click", () => {
  track("issue_start", {
    source_section: "hero_finder_container",
    metadata: { step: state.step },
  });
}, { once: true });

function initStrategyCanvas() {
  const canvas = document.getElementById("strategyCanvas");
  if (!canvas) return;
  const hero = canvas.closest(".hero");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const labels = ["Sein", "Sollen", "KPI", "R&R", "AI", "ESG", "Execution", "Fermat"];
  let width = 0;
  let height = 0;
  let nodes = [];
  let frame = 0;

  function resize() {
    const box = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(320, Math.floor(box.width));
    height = Math.max(520, Math.floor(box.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes = labels.map((label, index) => {
      const column = index % 4;
      const row = Math.floor(index / 4);
      return {
        label,
        x: width * (0.12 + column * 0.22) + (row ? 26 : 0),
        y: height * (0.18 + row * 0.42) + ((index % 2) * 34),
        vx: (index % 2 ? 0.16 : -0.12),
        vy: (index % 3 ? 0.1 : -0.14),
        size: index === 1 || index === 7 ? 4.4 : 3.2,
      };
    });
    draw();
  }

  function drawGrid() {
    ctx.strokeStyle = "rgba(21,23,26,.055)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    const pulse = reduceMotion ? 0.5 : (Math.sin(frame * 0.018) + 1) / 2;
    nodes.forEach((node, index) => {
      for (let j = index + 1; j < nodes.length; j += 1) {
        const other = nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance < width * 0.36) {
          ctx.strokeStyle = `rgba(15,118,110,${Math.max(0.045, 0.18 - distance / 1400)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    });
    nodes.forEach((node, index) => {
      const radius = node.size + (index % 2 ? pulse : 1 - pulse) * 1.4;
      ctx.fillStyle = index === 7 ? "rgba(183,121,31,.92)" : "rgba(15,118,110,.92)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(21,23,26,.62)";
      ctx.font = "800 12px Inter, sans-serif";
      ctx.fillText(node.label, node.x + 10, node.y - 9);
    });
  }

  function tick() {
    frame += 1;
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
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

function initPublishingLayer() {
  const progress = document.getElementById("scrollProgress");
  const hero = document.querySelector(".hero");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateProgress() {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  if (hero && !reduced) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--mx", `${x.toFixed(2)}%`);
      hero.style.setProperty("--my", `${y.toFixed(2)}%`);
    });
  }

  const revealTargets = document.querySelectorAll(
    ".section-head, .case-card, article, .track-group, .proof-panel, .finder",
  );
  revealTargets.forEach((target) => target.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("in"));
  }
}

renderStep();
initStrategyCanvas();
loadContent().then(initPublishingLayer).catch(() => initPublishingLayer());
setInquiryContext({
  source: "direct",
  route: "direct",
  sourceTitle: "직접 접촉",
  sourceId: "homepage",
  inferredType: state.inferredType || "",
});
