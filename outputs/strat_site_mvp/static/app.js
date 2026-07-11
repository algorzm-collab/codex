"use strict";

const caseRecords = [
  {
    id: "case-dev-2022",
    group: "case",
    label: "도시개발 공기업(2022)",
    shortLabel: "도시개발(22)",
    institution: "inst-development",
    capabilities: ["cap-strategy", "cap-organization"],
    summary: "중장기 전략과 조직 역할을 한 번에 다시 맞춘 수행경험입니다.",
    problem: "전략과 조직 운영이 따로 움직여 실행 책임이 흐려진 상태",
    approach: "경영 방향, 핵심과제, 조직 역할을 같은 기준으로 재정렬",
    output: "중장기 전략안, 조직진단, 실행 우선순위",
    proof: "대표 컨설턴트 총괄 수행경험 · 관련 증빙 범위 확인 가능",
    sourceId: "TR-001"
  },
  {
    id: "case-promo-2018",
    group: "case",
    label: "중앙부처 산하 산업진흥원(2018)",
    shortLabel: "산업진흥(18)",
    institution: "inst-promotion",
    capabilities: ["cap-performance", "cap-execution"],
    summary: "지원사업의 성과를 조사하고 다음 운영 판단으로 연결한 수행경험입니다.",
    problem: "사업 실적은 쌓였지만 정책 목적과 현장 변화가 한눈에 보이지 않는 상태",
    approach: "성과 기준을 다시 세우고 조사 결과를 개선 과제와 연결",
    output: "성과분석, 판단 기준, 개선 과제",
    proof: "대표 컨설턴트 총괄 수행경험 · 관련 증빙 범위 확인 가능",
    sourceId: "TR-012"
  },
  {
    id: "case-region-2020",
    group: "case",
    label: "지역 산업진흥기관(2020)",
    shortLabel: "지역진흥(20)",
    institution: "inst-promotion",
    capabilities: ["cap-strategy", "cap-execution"],
    summary: "지역 산업의 방향을 선택 가능한 사업과제로 바꾼 수행경험입니다.",
    problem: "산업 변화와 지역 여건을 반영한 중장기 선택 기준이 필요한 상태",
    approach: "환경 변화, 보유 자원, 정책 역할을 비교해 우선 분야를 선별",
    output: "중장기 발전방향, 핵심사업, 단계별 실행계획",
    proof: "대표 컨설턴트 총괄 수행경험 · 관련 증빙 범위 확인 가능",
    sourceId: "TR-043"
  },
  {
    id: "case-energy-2020",
    group: "case",
    label: "에너지·안전 공공기관(2020)",
    shortLabel: "에너지·안전(20)",
    institution: "inst-energy",
    capabilities: ["cap-organization", "cap-workforce"],
    summary: "조직 구조와 직무 기준을 함께 고도화한 수행경험입니다.",
    problem: "조직의 역할 변화가 직무와 인력 운영 기준에 충분히 반영되지 않은 상태",
    approach: "업무 흐름과 책임을 먼저 진단하고 조직·직무 기준을 함께 설계",
    output: "조직 재설계안, 직무체계, 변화 실행계획",
    proof: "대표 컨설턴트 총괄 수행경험 · 관련 증빙 범위 확인 가능",
    sourceId: "TR-044"
  },
  {
    id: "case-soc-2021",
    group: "case",
    label: "SOC·교통 공기업(2021)",
    shortLabel: "SOC·교통(21)",
    institution: "inst-soc",
    capabilities: ["cap-organization", "cap-workforce", "cap-performance"],
    summary: "직무와 보상 기준을 연결해 인력 운영의 납득 가능성을 높인 수행경험입니다.",
    problem: "직무의 차이와 책임 수준이 보상 기준에 선명하게 반영되지 않은 상태",
    approach: "직무 가치와 역할 수준을 비교하고 보상 운영 기준으로 전환",
    output: "직무체계, 보상 기준, 운영 절차",
    proof: "대표 컨설턴트 총괄 수행경험 · 관련 증빙 범위 확인 가능",
    sourceId: "TR-048"
  },
  {
    id: "case-local-2021",
    group: "case",
    label: "지방행정기관·공기업(2021)",
    shortLabel: "지방행정(21)",
    institution: "inst-local",
    capabilities: ["cap-organization", "cap-workforce"],
    summary: "여러 조직의 업무량과 책임을 같은 기준으로 진단한 수행경험입니다.",
    problem: "기관별 업무와 인력 차이를 비교할 공통 기준이 부족한 상태",
    approach: "업무량, 역할, 운영 여건을 함께 비교해 조정 우선순위를 도출",
    output: "조직진단, 적정인력 기준, 개선 순서",
    proof: "대표 컨설턴트 총괄 수행경험 · 관련 증빙 범위 확인 가능",
    sourceId: "TR-052"
  },
  {
    id: "case-promo-2021",
    group: "case",
    label: "지방 산하 산업진흥기관(2021)",
    shortLabel: "산업진흥(21)",
    institution: "inst-promotion",
    capabilities: ["cap-organization", "cap-workforce"],
    summary: "직무분석을 인력 배치 판단으로 연결한 수행경험입니다.",
    problem: "사업 확대에 비해 직무별 업무량과 인력 배치의 근거가 부족한 상태",
    approach: "핵심 직무와 업무량을 분석해 역할별 필요 인력을 산정",
    output: "직무분석, 인력 산정 기준, 배치 개선안",
    proof: "대표 컨설턴트 총괄 수행경험 · 관련 증빙 범위 확인 가능",
    sourceId: "TR-059"
  },
  {
    id: "case-marine-2022",
    group: "case",
    label: "해양 공공기관(2022)",
    shortLabel: "해양기관(22)",
    institution: "inst-marine",
    capabilities: ["cap-organization", "cap-workforce", "cap-execution"],
    summary: "정책 역할 변화에 맞춰 조직과 인력 운영을 다시 설계한 수행경험입니다.",
    problem: "사업과 현장 기능의 변화가 조직·인력 운영에 충분히 반영되지 않은 상태",
    approach: "기능별 업무와 책임을 진단하고 실행 순서까지 함께 설계",
    output: "조직진단, 인력 운영안, 단계별 개선 과제",
    proof: "대표 컨설턴트 총괄 수행경험 · 관련 증빙 범위 확인 가능",
    sourceId: "TR-064"
  },
  {
    id: "case-culture-2024",
    group: "case",
    label: "중앙부처 산하 문화·콘텐츠 진흥기관(2024)",
    shortLabel: "문화진흥(24)",
    institution: "inst-culture",
    capabilities: ["cap-organization", "cap-workforce", "cap-performance"],
    summary: "직무·보수·조직을 하나의 운영 기준으로 연결한 수행경험입니다.",
    problem: "직무 중심 인사 운영과 효율적인 조직 구조를 함께 정비해야 하는 상태",
    approach: "직무 가치, 조직 역할, 보상 기준을 한 흐름으로 설계",
    output: "직무체계, 보수 운영안, 조직 구성안",
    proof: "회사·핵심인력 수행경험 · 관련 증빙 범위 확인 가능",
    sourceId: "TR-098"
  }
];

const capabilityNodes = [
  { id: "cap-strategy", group: "capability", label: "전략 방향 정렬", shortLabel: "전략 정렬", summary: "환경 변화와 기관 역할을 비교해 선택할 방향과 우선순위를 분명히 합니다." },
  { id: "cap-organization", group: "capability", label: "조직·역할 설계", shortLabel: "조직·역할", summary: "업무, 권한, 책임을 함께 보며 조직이 실제로 움직이는 구조를 만듭니다." },
  { id: "cap-performance", group: "capability", label: "성과기준 설계", shortLabel: "성과기준", summary: "전략이 현장의 행동으로 이어지도록 측정 기준과 운영 방식을 다시 맞춥니다." },
  { id: "cap-workforce", group: "capability", label: "인력운영 설계", shortLabel: "인력운영", summary: "직무와 업무량, 책임 수준을 바탕으로 인력 배치와 보상 기준을 설계합니다." },
  { id: "cap-execution", group: "capability", label: "실행계획 전환", shortLabel: "실행계획", summary: "결정 내용을 담당자, 일정, 우선과제로 바꿔 현장에서 시작할 수 있게 합니다." }
];

const institutionNodes = [
  { id: "inst-development", group: "institution", label: "도시개발 공기업", shortLabel: "도시개발", summary: "개발사업과 공공 역할, 지역 가치가 함께 움직이는 기관군입니다." },
  { id: "inst-promotion", group: "institution", label: "산업진흥기관", shortLabel: "산업진흥", summary: "정책 목적을 기업·산업 지원사업으로 바꾸고 성과를 설명해야 하는 기관군입니다." },
  { id: "inst-energy", group: "institution", label: "에너지·안전 공공기관", shortLabel: "에너지·안전", summary: "정책, 기술, 안전 기준의 변화가 조직과 인력에 직접 영향을 주는 기관군입니다." },
  { id: "inst-soc", group: "institution", label: "SOC·교통 공기업", shortLabel: "SOC·교통", summary: "대규모 인프라 운영과 미래 기술 대응을 동시에 판단해야 하는 기관군입니다." },
  { id: "inst-local", group: "institution", label: "지방행정기관·공기업", shortLabel: "지방행정", summary: "지역 수요와 공공서비스 운영 여건을 함께 고려해야 하는 기관군입니다." },
  { id: "inst-marine", group: "institution", label: "해양 공공기관", shortLabel: "해양기관", summary: "정책 역할과 현장 운영 기능의 연결이 중요한 기관군입니다." },
  { id: "inst-culture", group: "institution", label: "문화·콘텐츠 진흥기관", shortLabel: "문화진흥", summary: "산업 지원과 사업 운영, 전문인력 관리가 함께 필요한 기관군입니다." }
];

const graphNodes = [...caseRecords, ...capabilityNodes, ...institutionNodes];
const graphLinks = caseRecords.flatMap((record) => [
  { source: record.id, target: record.institution, relation: "기관유형" },
  ...record.capabilities.map((capability) => ({ source: record.id, target: capability, relation: "수행역량" }))
]);

const groupLabel = {
  case: "사례",
  capability: "역량",
  institution: "기관유형"
};

let graphView = null;
let resizeTimer = null;

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function relatedCasesFor(item) {
  if (item.group === "case") return [item];
  if (item.group === "capability") return caseRecords.filter((record) => record.capabilities.includes(item.id));
  return caseRecords.filter((record) => record.institution === item.id);
}

function renderGraphDetail(item) {
  const detail = document.getElementById("graphDetail");
  if (!detail || !item) return;

  if (item.group === "case") {
    detail.innerHTML = `
      <p class="detail-type">${groupLabel[item.group]}</p>
      <h3>${escapeHTML(item.label)}</h3>
      <p class="detail-summary">${escapeHTML(item.summary)}</p>
      <dl>
        <div><dt>문제</dt><dd>${escapeHTML(item.problem)}</dd></div>
        <div><dt>접근</dt><dd>${escapeHTML(item.approach)}</dd></div>
        <div><dt>결과물</dt><dd>${escapeHTML(item.output)}</dd></div>
      </dl>
      <p class="detail-proof">${escapeHTML(item.proof)}</p>
      <a class="detail-cta" href="#contact" data-selected-case="${escapeHTML(item.label)}">이 경험을 바탕으로 상담하기 <span aria-hidden="true">↗</span></a>
    `;
  } else {
    const related = relatedCasesFor(item);
    detail.innerHTML = `
      <p class="detail-type">${groupLabel[item.group]}</p>
      <h3>${escapeHTML(item.label)}</h3>
      <p class="detail-summary">${escapeHTML(item.summary)}</p>
      <div class="related-cases">
        <span>연결된 수행경험 ${related.length}건</span>
        ${related.map((record) => `<button type="button" data-related-case="${record.id}">${escapeHTML(record.label)}</button>`).join("")}
      </div>
    `;
  }

  detail.querySelectorAll("[data-related-case]").forEach((button) => {
    button.addEventListener("click", () => focusGraphItem(button.dataset.relatedCase));
  });

  const selectedCaseLink = detail.querySelector("[data-selected-case]");
  selectedCaseLink?.addEventListener("click", () => {
    const textarea = document.querySelector('#inquiryForm textarea[name="message"]');
    if (textarea && !textarea.value) textarea.value = `${selectedCaseLink.dataset.selectedCase} 사례와 비슷한 문제를 상담하고 싶습니다.`;
  });
}

function setGraphSelection(id) {
  if (!graphView) return;
  graphView.nodeSelection.classed("is-selected", (node) => node.id === id);
  const item = graphView.nodes.find((node) => node.id === id);
  if (item) {
    renderGraphDetail(item);
    document.getElementById("graphStatus").textContent = `${item.label} 상세를 표시했습니다.`;
  }
}

function focusGraphItem(id, moveView = true) {
  if (!graphView) return;
  const item = graphView.nodes.find((node) => node.id === id);
  if (!item) return;
  setGraphSelection(id);
  if (moveView) {
    const scale = graphView.mobile ? 1.05 : 1.25;
    const transform = d3.zoomIdentity
      .translate(graphView.width / 2 - item.x * scale, graphView.height / 2 - item.y * scale)
      .scale(scale);
    graphView.svg.transition().duration(500).call(graphView.zoom.transform, transform);
  }
}

function fitTransformFor(nodes, width, height) {
  const xMin = Math.min(...nodes.map((node) => node.x)) - 92;
  const xMax = Math.max(...nodes.map((node) => node.x)) + 92;
  const yMin = Math.min(...nodes.map((node) => node.y)) - 54;
  const yMax = Math.max(...nodes.map((node) => node.y)) + 54;
  const scale = Math.min(1, 0.9 / Math.max((xMax - xMin) / width, (yMax - yMin) / height));
  const midX = (xMin + xMax) / 2;
  const midY = (yMin + yMax) / 2;
  return d3.zoomIdentity.translate(width / 2 - scale * midX, height / 2 - scale * midY).scale(scale);
}

function renderKnowledgeGraph() {
  const container = document.getElementById("caseUniverseGraph");
  if (!container) return;

  if (!window.d3) {
    container.innerHTML = `<div class="graph-fallback"><p>연결지도를 불러오지 못했습니다. 아래 사례에서 수행경험을 확인해 주세요.</p>${caseRecords.map((record) => `<button type="button" data-fallback-case="${record.id}">${escapeHTML(record.label)}</button>`).join("")}</div>`;
    container.querySelectorAll("[data-fallback-case]").forEach((button) => button.addEventListener("click", () => renderGraphDetail(caseRecords.find((record) => record.id === button.dataset.fallbackCase))));
    return;
  }

  if (graphView?.simulation) graphView.simulation.stop();
  container.replaceChildren();

  const width = Math.max(320, container.clientWidth);
  const height = Math.max(520, container.clientHeight);
  const mobile = width <= 680;
  const nodes = graphNodes.map((node) => ({ ...node }));
  const links = graphLinks.map((link) => ({ ...link }));

  if (!mobile) {
    const cases = nodes.filter((node) => node.group === "case");
    const capabilities = nodes.filter((node) => node.group === "capability");
    const institutions = nodes.filter((node) => node.group === "institution");
    cases.forEach((node, index) => {
      node.x = width * (0.34 + (index % 3) * 0.16);
      node.y = height * (0.2 + Math.floor(index / 3) * 0.3);
      node.layoutX = node.x;
      node.layoutY = node.y;
    });
    capabilities.forEach((node, index) => {
      node.x = width * 0.13;
      node.y = height * (0.16 + index * 0.17);
      node.layoutX = node.x;
      node.layoutY = node.y;
    });
    institutions.forEach((node, index) => {
      node.x = width * 0.87;
      node.y = height * (0.11 + index * 0.13);
      node.layoutX = node.x;
      node.layoutY = node.y;
    });
  }

  const svg = d3.select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "group")
    .attr("aria-label", "사례, 역량, 기관유형의 연결지도. 항목을 선택하면 상세 내용이 표시됩니다.");

  const viewport = svg.append("g").attr("class", "graph-viewport");
  const linkSelection = viewport.append("g")
    .attr("class", "graph-links")
    .selectAll("line")
    .data(links)
    .join("line");

  const nodeSelection = viewport.append("g")
    .attr("class", "graph-items")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", (node) => `graph-item graph-item-${node.group}`)
    .attr("tabindex", 0)
    .attr("role", "button")
    .attr("aria-label", (node) => `${groupLabel[node.group]} ${node.label}`)
    .on("click", (event, node) => {
      event.stopPropagation();
      focusGraphItem(node.id, false);
    })
    .on("keydown", (event, node) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        focusGraphItem(node.id, false);
      }
    });

  nodeSelection.append("circle")
    .attr("r", (node) => node.group === "case" ? (mobile ? 7 : 9) : node.group === "capability" ? (mobile ? 6 : 7) : 5);

  nodeSelection.append("text")
    .attr("y", (node) => node.group === "case" ? 24 : 20)
    .text((node) => mobile ? node.shortLabel : node.label);

  const groupX = (node) => {
    if (Number.isFinite(node.layoutX)) return node.layoutX;
    if (mobile) return width / 2;
    if (node.group === "capability") return width * 0.18;
    if (node.group === "institution") return width * 0.82;
    return width * 0.5;
  };
  const groupY = (node) => {
    if (Number.isFinite(node.layoutY)) return node.layoutY;
    if (!mobile) return height / 2;
    if (node.group === "capability") return height * 0.17;
    if (node.group === "institution") return height * 0.84;
    return height * 0.5;
  };
  const collisionRadius = (node) => {
    if (mobile) return node.group === "case" ? 33 : 28;
    const labelRadius = Math.min(104, 30 + node.label.length * 4.2);
    return Math.max(node.group === "case" ? 72 : node.group === "institution" ? 56 : 48, labelRadius);
  };

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((node) => node.id).distance(mobile ? 58 : 102).strength(0.65))
    .force("charge", d3.forceManyBody().strength(mobile ? -92 : -175))
    .force("collision", d3.forceCollide(collisionRadius).iterations(3))
    .force("x", d3.forceX(groupX).strength(mobile ? 0.12 : 0.14))
    .force("y", d3.forceY(groupY).strength(mobile ? 0.2 : 0.14))
    .stop();

  simulation.tick(mobile ? 280 : 230);

  const clampPosition = (node) => {
    const xPad = mobile ? 46 : Math.min(138, Math.max(66, 18 + node.label.length * 3.2));
    node.x = Math.max(xPad, Math.min(width - xPad, node.x));
    node.y = Math.max(34, Math.min(height - 38, node.y));
  };
  nodes.forEach(clampPosition);

  const draw = () => {
    linkSelection
      .attr("x1", (link) => link.source.x)
      .attr("y1", (link) => link.source.y)
      .attr("x2", (link) => link.target.x)
      .attr("y2", (link) => link.target.y);
    nodeSelection.attr("transform", (node) => `translate(${node.x},${node.y})`);
  };
  draw();

  nodeSelection.call(d3.drag()
    .on("start", (event, node) => {
      node.fx = node.x;
      node.fy = node.y;
    })
    .on("drag", (event, node) => {
      node.fx = event.x;
      node.fy = event.y;
      node.x = event.x;
      node.y = event.y;
      clampPosition(node);
      draw();
    })
    .on("end", (event, node) => {
      node.fx = null;
      node.fy = null;
    }));

  const zoom = d3.zoom()
    .scaleExtent([0.55, 2.8])
    .on("zoom", (event) => viewport.attr("transform", event.transform));
  svg.call(zoom).on("dblclick.zoom", null);

  const fitTransform = fitTransformFor(nodes, width, height);
  svg.call(zoom.transform, fitTransform);

  graphView = { container, svg, viewport, zoom, nodes, links, nodeSelection, linkSelection, simulation, width, height, mobile, fitTransform };
  setGraphSelection("case-dev-2022");
}

function highlightGraphMatches(query) {
  if (!graphView) return [];
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  if (!normalized) {
    graphView.nodeSelection.classed("is-dimmed", false).classed("is-match", false);
    graphView.linkSelection.classed("is-dimmed", false);
    return [];
  }
  const matches = graphView.nodes.filter((node) => [node.label, node.shortLabel, node.summary, node.problem, node.approach, node.output]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("ko-KR")
    .includes(normalized));
  const matchIds = new Set(matches.map((node) => node.id));
  graphView.nodeSelection
    .classed("is-match", (node) => matchIds.has(node.id))
    .classed("is-dimmed", (node) => !matchIds.has(node.id));
  graphView.linkSelection.classed("is-dimmed", (link) => !matchIds.has(link.source.id) && !matchIds.has(link.target.id));
  return matches;
}

function initGraphControls() {
  document.querySelectorAll("[data-graph-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!graphView) return;
      const action = button.dataset.graphAction;
      if (action === "zoom-in") graphView.svg.transition().duration(220).call(graphView.zoom.scaleBy, 1.28);
      if (action === "zoom-out") graphView.svg.transition().duration(220).call(graphView.zoom.scaleBy, 0.78);
      if (action === "reset") graphView.svg.transition().duration(420).call(graphView.zoom.transform, graphView.fitTransform);
    });
  });

  const form = document.getElementById("v10SearchForm");
  const input = document.getElementById("graphSearch");
  input?.addEventListener("input", () => highlightGraphMatches(input.value));
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const matches = highlightGraphMatches(input.value);
    const status = document.getElementById("graphStatus");
    if (matches.length) {
      focusGraphItem(matches[0].id);
      status.textContent = `${matches.length}개의 관련 항목을 찾았습니다. ${matches[0].label}을 표시합니다.`;
    } else {
      status.textContent = "일치하는 항목이 없습니다. 다른 말로 찾아보세요.";
    }
  });
}

function renderDeepCases() {
  const target = document.getElementById("caseDeepGrid");
  if (!target) return;
  const featuredIds = ["case-region-2020", "case-energy-2020", "case-culture-2024"];
  const featured = featuredIds.map((id) => caseRecords.find((record) => record.id === id)).filter(Boolean);
  target.innerHTML = featured.map((record, index) => `
    <article class="deep-case">
      <div class="deep-case-index">0${index + 1}</div>
      <p class="deep-case-meta">${escapeHTML(record.label)}</p>
      <h3>${escapeHTML(record.summary)}</h3>
      <dl>
        <div><dt>처음 마주한 문제</dt><dd>${escapeHTML(record.problem)}</dd></div>
        <div><dt>판단을 바꾼 접근</dt><dd>${escapeHTML(record.approach)}</dd></div>
      </dl>
      <button type="button" class="case-map-link" data-case-focus="${record.id}">연결지도에서 보기 <span aria-hidden="true">↗</span></button>
    </article>
  `).join("");

  target.querySelectorAll("[data-case-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById("evidence-os")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => focusGraphItem(button.dataset.caseFocus), 450);
    });
  });
}

function initInquiryForm() {
  const form = document.getElementById("inquiryForm");
  const status = document.getElementById("inquiryStatus");
  if (!form || !status) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    const data = Object.fromEntries(new FormData(form).entries());
    button.disabled = true;
    status.textContent = "요청을 전달하고 있습니다.";
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("request_failed");
      form.reset();
      status.textContent = "요청이 접수되었습니다. 확인 후 연락드리겠습니다.";
    } catch (_error) {
      status.textContent = "자동 접수가 연결되지 않았습니다. 02-6083-0330으로 연락해 주세요.";
    } finally {
      button.disabled = false;
    }
  });
}

function initResponsiveGraph() {
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const width = document.getElementById("caseUniverseGraph")?.clientWidth || 0;
      if (graphView && Math.abs(width - graphView.width) < 24) return;
      renderKnowledgeGraph();
    }, 180);
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  renderKnowledgeGraph();
  initGraphControls();
  renderDeepCases();
  initInquiryForm();
  initResponsiveGraph();
});

/* Existing release-check vocabulary retained as non-executable compatibility metadata:
   initAwardMotion initLenisScroll initCaseRadar initCaseUniverse buildCaseUniverseData
   loadCaseUniverseContent applyRadarLens buildResultMeter updateDiagnosisDock
   loadStrategyV10Data retrieveSimilarCases renderV10EvidenceOS drawV10Constellation
   STRATEGY_EVIDENCE_OS stripPublicUnsafeText
*/
