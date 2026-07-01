const state = {
  userId: localStorage.getItem("strat_user_id") || null,
  sessionId: localStorage.getItem("strat_session_id") || crypto.randomUUID(),
  step: 0,
  answers: {},
  inferredType: "",
};
localStorage.setItem("strat_session_id", state.sessionId);

const steps = [
  {
    key: "symptom",
    label: "STEP 1 / 3",
    question: "요즘 조직에서 가장 자주 들리는 말은 무엇인가요?",
    options: [
      ["report_no_execution", "보고서는 있는데 실행이 안 된다."],
      ["unclear_owner", "이 일이 어느 부서 책임인지 애매하다."],
      ["too_many_kpi", "KPI는 많은데 무엇을 바꿔야 할지 모르겠다."],
      ["evaluation_not_accepted", "평가제도는 있는데 구성원들이 납득하지 못한다."],
      ["reorg_no_standard", "조직개편 이야기는 많은데 기준이 없다."],
      ["transformation_not_actionable", "AI/ESG 과제가 생겼는데 실행과제로 정리되지 않았다."],
    ],
  },
  {
    key: "scene",
    label: "STEP 2 / 3",
    question: "그 문제가 실제로 터지는 장면은 어디인가요?",
    options: [
      ["decision_meeting", "회의와 의사결정"],
      ["cross_team", "부서 간 협업"],
      ["kpi_evaluation", "KPI와 평가"],
      ["org_role", "조직구조와 역할"],
      ["hr_capability", "인사배치와 역량"],
      ["external_policy", "외부평가와 정책 대응"],
    ],
  },
  {
    key: "need",
    label: "STEP 3 / 3",
    question: "지금 필요한 것은 어느 쪽에 더 가깝나요?",
    options: [
      ["internal_logic", "문제를 정리해 내부 설득 논리로 만들기"],
      ["scope_before_project", "컨설팅/용역 발주 전 과업 범위 잡기"],
      ["strategy_to_execution", "기존 전략을 실행체계로 연결하기"],
      ["org_kpi_alignment", "조직과 KPI의 연결 상태 확인하기"],
      ["not_sure", "아직 문제인지부터 확인하기"],
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

const flagshipProofByType = {
  strategy_org_performance_gap: {
    id: "proof-1",
    title: "신용보증기금 뉴비전 수립",
    label: "전략-실행체계 정렬 대표실적",
  },
  rr_role_confusion: {
    id: "proof-4",
    title: "강원도개발공사 평창 올림픽 레거시 활용전략",
    label: "전략-조직 역할 재정렬 대표실적",
  },
  performance_system_failure: {
    id: "proof-3",
    title: "한국주택금융공사 부점성과평가 고도화",
    label: "성과관리체계 대표실적",
  },
  transformation_execution_gap: {
    id: "proof-6",
    title: "K-UAM 및 UAM Team Korea 대응전략",
    label: "미래전환 대응전략 대표실적",
  },
};

const $ = (selector) => document.querySelector(selector);
let projectRecords = [];
let activeTheme = "all";

function postJSON(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

function trackEvent(eventName, payload = {}) {
  return postJSON("/api/event", {
    event_name: eventName,
    session_id: state.sessionId,
    user_id: state.userId,
    path: location.pathname + location.hash,
    inferred_type: state.inferredType,
    ...payload,
  }).catch(() => null);
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
    });
    options.appendChild(button);
  });
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
  const result = response.result;
  const proof = flagshipProofByType[state.inferredType] || flagshipProofByType.strategy_org_performance_gap;
  trackEvent("issue_result_view", {
    source_section: "issue_finder",
    target_id: proof.id,
    target_title: proof.title,
    metadata: state.answers,
  });
  const chips = result.hypothesis_solution.map((item) => `<div class="chip">${item}</div>`).join("");
  const relatedProjects = (result.related_projects || []).map((item) => `
    <div class="chip">
      <b>${item.client}</b><br>
      <span>${item.project_title}${item.year_note ? ` · ${item.year_note}` : ""}</span>
    </div>
  `).join("");
  $("#result").hidden = false;
  $("#result").innerHTML = `
    <p class="kicker">Inference Result</p>
    <h3>${result.headline}</h3>
    <p>${result.interpretation}</p>
    <p><b>유사 실적 가설</b><br>${result.related_experience}</p>
    ${relatedProjects ? `<p><b>관련 수행 실적</b></p><div class="chips">${relatedProjects}</div>` : ""}
    <div class="proof-jump">
      <span>${proof.label}</span>
      <b>${proof.title}</b>
      <a class="btn secondary" href="#${proof.id}" data-proof-jump="${proof.id}">관련 대표실적 증거 보기</a>
    </div>
    <p><b>상담에서 먼저 확인할 가설적 접근</b></p>
    <div class="chips">${chips}</div>
    <div class="note">이 결과는 간단한 선택을 바탕으로 한 가설입니다. 실제 과제 범위와 접근 방식은 STRAT과의 상담에서 구체화합니다.</div>
    <a class="btn primary" href="#contact">${result.cta}</a>
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
  } else {
    await showResult();
  }
});

document.querySelectorAll("[data-symptom]").forEach((button) => {
  button.addEventListener("click", () => {
    state.answers.symptom = button.dataset.symptom;
    state.step = 1;
    trackEvent("issue_finder_start", {
      source_section: "problem_mirror",
      metadata: { symptom: button.dataset.symptom },
    });
    renderStep();
    $("#finder").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

function formPayload(form) {
  return Object.fromEntries(new FormData(form).entries());
}

$("#signupForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formPayload(event.currentTarget);
  data.consent = event.currentTarget.elements.consent.checked;
  const response = await postJSON("/api/signup", data);
  if (response.user_id) {
    state.userId = response.user_id;
    localStorage.setItem("strat_user_id", response.user_id);
    $("#signupNote").textContent = "회원 정보가 저장되었습니다. 이후 진단/문의/QA 기록과 연결됩니다.";
  } else {
    $("#signupNote").textContent = response.error || "저장 중 오류가 발생했습니다.";
  }
});

$("#inquiryForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formPayload(event.currentTarget);
  data.user_id = state.userId;
  data.inferred_type = state.inferredType;
  const response = await postJSON("/api/inquiry", data);
  if (response.ok) {
    trackEvent("contact_form_submit", {
      source_section: "contact",
      metadata: { has_inferred_type: !!state.inferredType },
    });
  }
  $("#inquiryNote").textContent = response.ok ? "문의가 저장되었습니다. STRAT에서 확인 후 연락드립니다." : (response.error || "저장 중 오류가 발생했습니다.");
});

$("#qaForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formPayload(event.currentTarget);
  data.user_id = state.userId;
  const response = await postJSON("/api/qa", data);
  $("#qaNote").textContent = response.ok ? "QA가 등록되었습니다." : (response.error || "저장 중 오류가 발생했습니다.");
});

async function loadContent() {
  const response = await fetch("/api/content").then((res) => res.json());
  renderFlagshipProof(response.cases.slice(0, 6));
  $("#caseGrid").innerHTML = response.cases.map((item) => `
    <article class="case-card">
      <span class="tag">${item.customer_type}</span>
      <b>${item.title}</b>
      <p><b>문제</b><br>${item.problem}</p>
      <p><b>접근</b><br>${item.approach}</p>
      <p><b>산출물</b><br>${item.deliverables}</p>
    </article>
  `).join("");
  $("#slideGrid").innerHTML = response.slides.map((item) => `
    <article>
      <b>${item.title}</b>
      <p>${item.summary}</p>
      ${item.link_url ? `<p><a href="${item.link_url}" target="_blank" rel="noreferrer">자료 보기</a></p>` : ""}
    </article>
  `).join("");
  projectRecords = response.project_records || [];
  renderTrackRecords();
}

function renderFlagshipProof(items) {
  const proof = $("#flagshipProof");
  if (!proof) return;
  const proofLines = [
    "정책금융기관의 미래 역할을 실행체계로 바꾼 프로젝트",
    "산업정책 변화와 기관 역할을 중장기 전략으로 연결한 프로젝트",
    "성과평가를 전략, KPI, 현장성과의 언어로 다시 정렬한 프로젝트",
    "올림픽 레거시를 지역개발과 조직전략의 과제로 전환한 프로젝트",
    "기술 변화 속 미래사업과 기관 역할을 재정의한 프로젝트",
    "UAM 정책 아젠다를 기관 대응전략과 실행 우선순위로 구조화한 프로젝트",
  ];
  proof.innerHTML = items.map((item, index) => `
    <article class="proof-panel" id="proof-${index + 1}" data-proof-index="${index + 1}" data-proof-title="${item.title}">
      <div class="proof-number">${String(index + 1).padStart(2, "0")}</div>
      <div class="proof-copy">
        <span class="tag">${item.customer_type}</span>
        <h3>${item.title}</h3>
        <p class="proof-line">${proofLines[index] || item.problem}</p>
        <dl>
          <div>
            <dt>문제</dt>
            <dd>${item.problem}</dd>
          </div>
          <div>
            <dt>접근</dt>
            <dd>${item.approach}</dd>
          </div>
          <div>
            <dt>산출물</dt>
            <dd>${item.deliverables}</dd>
          </div>
        </dl>
        <a class="btn secondary" href="#contact" data-case-cta="${item.title}">유사 과제 상담하기</a>
      </div>
      <div class="proof-visual" aria-hidden="true">
        <span>${item.solution_cluster || "Strategy"}</span>
        <i></i><i></i><i></i>
      </div>
    </article>
  `).join("");
}

function renderTrackRecords() {
  const filtered = activeTheme === "all"
    ? projectRecords
    : projectRecords.filter((item) => item.theme === activeTheme);
  const groups = new Map();
  filtered.forEach((item) => {
    const key = `${item.theme} · ${item.sector}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  $("#trackList").innerHTML = [...groups.entries()].map(([group, items]) => `
    <section class="track-group">
      <h3>${group}</h3>
      <div class="track-items">
        ${items.map((item) => `
          <div class="track-item">
            <b>${item.client}</b>
            <p>${item.project_title}${item.year_note ? ` · ${item.year_note}` : ""}</p>
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
  const proofJump = event.target.closest("[data-proof-jump]");
  if (proofJump) {
    trackEvent("proof_jump_click", {
      source_section: "issue_result",
      target_id: proofJump.dataset.proofJump,
      target_title: proofJump.closest(".proof-jump")?.querySelector("b")?.textContent || "",
    });
    return;
  }
  const caseCta = event.target.closest("[data-case-cta]");
  if (caseCta) {
    trackEvent("case_contact_cta_click", {
      source_section: "flagship_proof",
      target_title: caseCta.dataset.caseCta,
    });
  }
});

let contactStarted = false;
$("#inquiryForm").addEventListener("focusin", () => {
  if (contactStarted) return;
  contactStarted = true;
  trackEvent("contact_form_start", {
    source_section: "contact",
    metadata: { inferred_type: state.inferredType || "" },
  });
});

$("#finder").addEventListener("click", () => {
  trackEvent("issue_finder_start", {
    source_section: "hero_finder",
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
        x: width * (.12 + column * .22) + (row ? 26 : 0),
        y: height * (.18 + row * .42) + ((index % 2) * 34),
        vx: (index % 2 ? .16 : -.12),
        vy: (index % 3 ? .1 : -.14),
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
    const pulse = reduceMotion ? .5 : (Math.sin(frame * .018) + 1) / 2;
    nodes.forEach((node, index) => {
      for (let j = index + 1; j < nodes.length; j += 1) {
        const other = nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance < width * .36) {
          ctx.strokeStyle = `rgba(15,118,110,${Math.max(.045, .18 - distance / 1400)})`;
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

  const revealTargets = document.querySelectorAll(".section-head, .case-card, article, .track-group");
  revealTargets.forEach((target) => target.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: .08 });
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("in"));
  }

  if (!reduced) {
    document.addEventListener("pointermove", (event) => {
      const card = event.target.closest(".case-card, .service-grid article, .people-grid article, .slide-grid article");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const dx = ((event.clientX - rect.left) / rect.width) - .5;
      const dy = ((event.clientY - rect.top) / rect.height) - .5;
      card.style.transform = `translateY(-3px) rotateX(${(-dy * 2).toFixed(2)}deg) rotateY(${(dx * 2).toFixed(2)}deg)`;
    }, { passive: true });
    document.addEventListener("pointerout", (event) => {
      const card = event.target.closest(".case-card, .service-grid article, .people-grid article, .slide-grid article");
      if (card) card.style.transform = "";
    });
  }
}

renderStep();
initStrategyCanvas();
loadContent().then(initPublishingLayer).catch(() => {
  initPublishingLayer();
});
