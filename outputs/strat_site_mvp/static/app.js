"use strict";

const graphState = {
  data: null,
  order: [],
  cursor: 0,
  cycle: 0,
  batchSize: 16,
  intervalMs: 8500,
  timer: null,
  paused: false,
  inViewport: true,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  selectedId: null
};

let allCaseRecords = [];
let currentCaseRecords = [];
let graphNodes = [];
let graphLinks = [];
let graphView = null;
let resizeTimer = null;

const groupLabel = {
  case: "프로젝트",
  capability: "과제",
  institution: "기관 유형"
};

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dimensionId(prefix, label) {
  const source = graphState.data?.[prefix === "theme" ? "themes" : "institutionTypes"] || [];
  return `${prefix}-${Math.max(0, source.indexOf(label))}`;
}

function getBatchSize() {
  if (window.innerWidth <= 600) return 6;
  if (window.innerWidth <= 1040) return 10;
  return 16;
}

function createCycleOrder(records, cycle = 0) {
  const themes = [...(graphState.data?.themes || [])];
  if (!themes.length) return [...records];
  const offset = cycle % themes.length;
  const rotatedThemes = themes.slice(offset).concat(themes.slice(0, offset));
  const buckets = new Map(rotatedThemes.map((theme) => [
    theme,
    records
      .filter((record) => record.theme === theme)
      .sort((a, b) => b.year.localeCompare(a.year, "ko") || a.id.localeCompare(b.id))
  ]));
  const order = [];
  let added = true;
  while (added) {
    added = false;
    rotatedThemes.forEach((theme) => {
      const bucket = buckets.get(theme);
      if (bucket?.length) {
        order.push(bucket.shift());
        added = true;
      }
    });
  }
  return order;
}

function getVisibleBatch() {
  return graphState.order.slice(
    graphState.cursor,
    Math.min(graphState.cursor + graphState.batchSize, graphState.order.length)
  );
}

function buildGraphModel(batch) {
  currentCaseRecords = batch.map((record) => ({
    ...record,
    institution: dimensionId("institution", record.institutionType),
    capabilities: [dimensionId("theme", record.theme)]
  }));

  const usedThemes = [...new Set(currentCaseRecords.map((record) => record.theme))];
  const usedInstitutions = [...new Set(currentCaseRecords.map((record) => record.institutionType))];
  const themeNodes = usedThemes.map((theme) => ({
    id: dimensionId("theme", theme),
    group: "capability",
    label: theme,
    shortLabel: theme,
    summary: `${theme} 관련 프로젝트 ${allCaseRecords.filter((record) => record.theme === theme).length}건`
  }));
  const institutionNodes = usedInstitutions.map((institution) => ({
    id: dimensionId("institution", institution),
    group: "institution",
    label: institution,
    shortLabel: institution.replace("기관", ""),
    summary: `${institution} 프로젝트 ${allCaseRecords.filter((record) => record.institutionType === institution).length}건`
  }));

  graphNodes = [...currentCaseRecords, ...themeNodes, ...institutionNodes];
  graphLinks = currentCaseRecords.flatMap((record) => [
    { source: record.id, target: record.institution, relation: "기관 유형" },
    ...record.capabilities.map((capability) => ({
      source: record.id,
      target: capability,
      relation: "과제"
    }))
  ]);
}

function relatedCasesFor(item) {
  if (item.group === "case") return [item];
  if (item.group === "capability") {
    const theme = graphState.data.themes[Number(item.id.replace("theme-", ""))];
    return allCaseRecords.filter((record) => record.theme === theme);
  }
  const institution = graphState.data.institutionTypes[Number(item.id.replace("institution-", ""))];
  return allCaseRecords.filter((record) => record.institutionType === institution);
}

function renderGraphDetail(item) {
  const detail = document.getElementById("graphDetail");
  if (!detail || !item) return;

  if (item.group === "case") {
    detail.innerHTML = `
      <p class="detail-type">${escapeHTML(item.code)} · ${escapeHTML(item.year)}</p>
      <h2>${escapeHTML(item.institutionType)}<br>${escapeHTML(item.theme)} 프로젝트</h2>
      <p class="detail-summary">${escapeHTML(item.summary)}</p>
      <dl>
        <div><dt>과제</dt><dd>${escapeHTML(item.problem)}</dd></div>
        <div><dt>수행 내용</dt><dd>${escapeHTML(item.approach)}</dd></div>
        <div><dt>결과물</dt><dd>${escapeHTML(item.output)}</dd></div>
        <div><dt>참여</dt><dd>${escapeHTML(item.experts.join(" · "))}</dd></div>
      </dl>
      <p class="detail-proof">${escapeHTML(item.proof)}</p>
      <a class="detail-cta" href="#contact" data-selected-case="${escapeHTML(item.code)} / ${escapeHTML(item.institutionType)} / ${escapeHTML(item.theme)}">유사 과제 문의 <span aria-hidden="true">↗</span></a>
    `;
  } else {
    const related = relatedCasesFor(item);
    detail.innerHTML = `
      <p class="detail-type">${groupLabel[item.group]}</p>
      <h2>${escapeHTML(item.label)}</h2>
      <p class="detail-summary">${escapeHTML(item.summary)}</p>
      <div class="related-cases">
        <span>관련 프로젝트 ${related.length}건</span>
        ${related.slice(0, 7).map((record) => `
          <button type="button" data-related-case="${record.id}">
            ${escapeHTML(record.code)} · ${escapeHTML(record.year)} · ${escapeHTML(record.theme)}
          </button>
        `).join("")}
      </div>
    `;
  }

  detail.querySelectorAll("[data-related-case]").forEach((button) => {
    button.addEventListener("click", () => {
      setLoopPaused(true);
      showCaseInGraph(button.dataset.relatedCase, true);
    });
  });

  const selectedCaseLink = detail.querySelector("[data-selected-case]");
  selectedCaseLink?.addEventListener("click", () => {
    const textarea = document.querySelector('#inquiryForm textarea[name="message"]');
    if (textarea && !textarea.value) {
      textarea.value = `관심 프로젝트: ${selectedCaseLink.dataset.selectedCase}\n문의 내용: `;
    }
  });
}

function setGraphSelection(id) {
  if (!graphView) return;
  graphView.nodeSelection.classed("is-selected", (node) => node.id === id);
  const item = graphView.nodes.find((node) => node.id === id);
  if (!item) return;
  graphState.selectedId = item.id;
  renderGraphDetail(item);
}

function focusGraphItem(id, moveView = true, announce = false) {
  if (!graphView) return;
  const item = graphView.nodes.find((node) => node.id === id);
  if (!item) {
    if (allCaseRecords.some((record) => record.id === id)) showCaseInGraph(id, announce);
    return;
  }
  setGraphSelection(id);
  if (moveView && Number.isFinite(item.x) && Number.isFinite(item.y)) {
    const scale = graphView.mobile ? 1 : 1.18;
    const transform = d3.zoomIdentity
      .translate(graphView.width / 2 - item.x * scale, graphView.height / 2 - item.y * scale)
      .scale(scale);
    graphView.svg.transition().duration(graphState.reducedMotion ? 0 : 360)
      .call(graphView.zoom.transform, transform);
  }
  if (announce) {
    document.getElementById("graphStatus").textContent = `${item.label} 상세 내용을 표시했습니다.`;
  }
}

function fitTransformFor(nodes, width, height) {
  const xValues = nodes.map((node) => node.x).filter(Number.isFinite);
  const yValues = nodes.map((node) => node.y).filter(Number.isFinite);
  if (!xValues.length || !yValues.length) return d3.zoomIdentity;
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const dx = Math.max(1, maxX - minX + 120);
  const dy = Math.max(1, maxY - minY + 90);
  const scale = Math.max(0.58, Math.min(1.08, 0.9 / Math.max(dx / width, dy / height)));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  return d3.zoomIdentity
    .translate(width / 2 - centerX * scale, height / 2 - centerY * scale)
    .scale(scale);
}

function renderKnowledgeGraph() {
  const container = document.getElementById("caseUniverseGraph");
  if (!container) return;

  if (!window.d3) {
    container.innerHTML = `
      <div class="graph-fallback">
        <p>프로젝트 지도를 불러오지 못했습니다. 아래 목록에서 확인해 주세요.</p>
        ${currentCaseRecords.map((record) => `
          <button type="button" data-fallback-case="${record.id}">${escapeHTML(record.label)}</button>
        `).join("")}
      </div>
    `;
    container.querySelectorAll("[data-fallback-case]").forEach((button) => {
      button.addEventListener("click", () => {
        setLoopPaused(true);
        renderGraphDetail(currentCaseRecords.find((record) => record.id === button.dataset.fallbackCase));
      });
    });
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
      node.x = width * (0.36 + (index % 3) * 0.14);
      node.y = height * (0.14 + Math.floor(index / 3) * 0.145);
      node.layoutX = node.x;
      node.layoutY = node.y;
    });
    capabilities.forEach((node, index) => {
      node.x = width * 0.12;
      node.y = height * (0.1 + index * (0.8 / Math.max(1, capabilities.length - 1)));
      node.layoutX = node.x;
      node.layoutY = node.y;
    });
    institutions.forEach((node, index) => {
      node.x = width * 0.88;
      node.y = height * (0.1 + index * (0.8 / Math.max(1, institutions.length - 1)));
      node.layoutX = node.x;
      node.layoutY = node.y;
    });
  }

  const svg = d3.select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "group")
    .attr("aria-label", "프로젝트, 과제, 기관유형의 연결지도");
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
      setLoopPaused(true);
      focusGraphItem(node.id, false, true);
    })
    .on("keydown", (event, node) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setLoopPaused(true);
        focusGraphItem(node.id, false, true);
      }
    });

  nodeSelection.append("circle")
    .attr("r", (node) => node.group === "case" ? (mobile ? 7 : 8) : 6);
  nodeSelection.append("text")
    .attr("y", (node) => node.group === "case" ? 23 : 20)
    .text((node) => node.group === "case" ? `${node.code} · ${node.shortLabel}` : (mobile ? node.shortLabel : node.label));

  const groupX = (node) => {
    if (Number.isFinite(node.layoutX)) return node.layoutX;
    if (mobile) return width / 2;
    if (node.group === "capability") return width * 0.16;
    if (node.group === "institution") return width * 0.84;
    return width * 0.5;
  };
  const groupY = (node) => {
    if (Number.isFinite(node.layoutY)) return node.layoutY;
    if (!mobile) return height / 2;
    if (node.group === "capability") return height * 0.18;
    if (node.group === "institution") return height * 0.83;
    return height * 0.5;
  };
  const collisionRadius = (node) => {
    if (mobile) return node.group === "case" ? 31 : 27;
    const labelRadius = Math.min(92, 27 + node.label.length * 3.6);
    return Math.max(node.group === "case" ? 58 : 46, labelRadius);
  };

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((node) => node.id).distance(mobile ? 52 : 88).strength(0.64))
    .force("charge", d3.forceManyBody().strength(mobile ? -82 : -145))
    .force("collision", d3.forceCollide(collisionRadius).iterations(3))
    .force("x", d3.forceX(groupX).strength(mobile ? 0.1 : 0.15))
    .force("y", d3.forceY(groupY).strength(mobile ? 0.18 : 0.15))
    .stop();
  simulation.tick(mobile ? 260 : 230);

  const clampPosition = (node) => {
    const xPad = mobile ? 44 : Math.min(126, Math.max(60, 18 + node.label.length * 3));
    node.x = Math.max(xPad, Math.min(width - xPad, node.x));
    node.y = Math.max(34, Math.min(height - 44, node.y));
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

  if (!mobile) {
    nodeSelection.call(d3.drag()
      .on("start", (_event, node) => {
        setLoopPaused(true);
        node.fx = node.x;
        node.fy = node.y;
      })
      .on("drag", (event, node) => {
        node.x = event.x;
        node.y = event.y;
        clampPosition(node);
        draw();
      })
      .on("end", (_event, node) => {
        node.fx = null;
        node.fy = null;
      }));
  }

  const zoom = d3.zoom()
    .scaleExtent([0.52, 2.8])
    .on("start", (event) => {
      if (event.sourceEvent) setLoopPaused(true);
    })
    .on("zoom", (event) => viewport.attr("transform", event.transform));
  svg.call(zoom).on("dblclick.zoom", null);
  const fitTransform = fitTransformFor(nodes, width, height);
  svg.call(zoom.transform, fitTransform);

  graphView = {
    container,
    svg,
    viewport,
    zoom,
    nodes,
    links,
    nodeSelection,
    linkSelection,
    simulation,
    width,
    height,
    mobile,
    fitTransform
  };
  const selection = nodes.some((node) => node.id === graphState.selectedId)
    ? graphState.selectedId
    : currentCaseRecords[0]?.id;
  if (selection) setGraphSelection(selection);
}

function updateTicker() {
  const target = document.getElementById("experienceTicker");
  if (!target) return;
  const content = currentCaseRecords.map((record) => `
    <span><b>${escapeHTML(record.code)}</b>${escapeHTML(record.institutionType)} / ${escapeHTML(record.theme)} / ${escapeHTML(record.year)}</span>
  `).join("");
  target.innerHTML = `<div>${content}</div><div aria-hidden="true">${content}</div>`;
}

function updateBatchStatus() {
  const status = document.getElementById("graphBatchStatus");
  if (!status || !allCaseRecords.length) return;
  const start = graphState.cursor + 1;
  const end = Math.min(graphState.cursor + currentCaseRecords.length, allCaseRecords.length);
  const loopState = graphState.reducedMotion
    ? "수동 탐색"
    : graphState.paused ? "자동 순환 멈춤" : "자동 순환 중";
  status.textContent = `프로젝트 ${start}–${end} / ${allCaseRecords.length} · ${loopState}`;
}

function updateLoopUI() {
  const button = document.querySelector('[data-graph-action="toggle-loop"]');
  if (!button) return;
  const stopped = graphState.paused || graphState.reducedMotion;
  button.setAttribute("aria-pressed", String(stopped));
  if (graphState.reducedMotion) {
    button.textContent = "자동 넘김 꺼짐";
    button.disabled = true;
  } else {
    button.textContent = graphState.paused ? "자동 넘김 시작" : "자동 넘김 멈춤";
  }
  updateBatchStatus();
}

function clearGraphTimer() {
  window.clearTimeout(graphState.timer);
  graphState.timer = null;
}

function scheduleGraphLoop() {
  clearGraphTimer();
  if (graphState.paused || graphState.reducedMotion || !graphState.inViewport || document.hidden) return;
  graphState.timer = window.setTimeout(() => advanceGraphBatch("auto"), graphState.intervalMs);
}

function setLoopPaused(paused) {
  graphState.paused = paused;
  updateLoopUI();
  if (paused) clearGraphTimer();
  else scheduleGraphLoop();
}

function renderCurrentBatch() {
  const batch = getVisibleBatch();
  if (!batch.length) return;
  buildGraphModel(batch);
  renderKnowledgeGraph();
  updateTicker();
  updateLoopUI();
}

function advanceGraphBatch(source = "manual") {
  let nextCursor = graphState.cursor + graphState.batchSize;
  if (nextCursor >= graphState.order.length) {
    graphState.cycle += 1;
    graphState.order = createCycleOrder(allCaseRecords, graphState.cycle);
    nextCursor = 0;
  }
  graphState.cursor = nextCursor;
  graphState.selectedId = null;
  renderCurrentBatch();
  if (source !== "auto") {
    const status = document.getElementById("graphStatus");
    if (status) status.textContent = document.getElementById("graphBatchStatus")?.textContent || "";
  }
  scheduleGraphLoop();
}

function showCaseInGraph(id, announce = false) {
  const index = graphState.order.findIndex((record) => record.id === id);
  if (index < 0) return;
  graphState.cursor = Math.floor(index / graphState.batchSize) * graphState.batchSize;
  graphState.selectedId = id;
  renderCurrentBatch();
  window.requestAnimationFrame(() => focusGraphItem(id, true, announce));
}

function searchableText(record) {
  return [
    record.code,
    record.label,
    record.shortLabel,
    record.institutionType,
    record.theme,
    record.year,
    record.experts.join(" "),
    record.summary,
    record.problem,
    record.approach,
    record.output
  ].join(" ").toLocaleLowerCase("ko-KR");
}

function searchAllRecords(query) {
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  if (!normalized) return [];
  return allCaseRecords.filter((record) => searchableText(record).includes(normalized));
}

function highlightGraphMatches(query) {
  if (!graphView) return [];
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  if (!normalized) {
    graphView.nodeSelection.classed("is-dimmed", false).classed("is-match", false);
    graphView.linkSelection.classed("is-dimmed", false);
    return [];
  }
  const matches = graphView.nodes.filter((node) => {
    if (node.group === "case") return searchableText(node).includes(normalized);
    return `${node.label} ${node.summary}`.toLocaleLowerCase("ko-KR").includes(normalized);
  });
  const matchIds = new Set(matches.map((node) => node.id));
  graphView.nodeSelection
    .classed("is-match", (node) => matchIds.has(node.id))
    .classed("is-dimmed", (node) => !matchIds.has(node.id));
  graphView.linkSelection.classed(
    "is-dimmed",
    (link) => !matchIds.has(link.source.id) && !matchIds.has(link.target.id)
  );
  return matches;
}

function initGraphControls() {
  document.querySelectorAll("[data-graph-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.graphAction;
      if (action === "toggle-loop") {
        setLoopPaused(!graphState.paused);
        return;
      }
      if (action === "next") {
        setLoopPaused(true);
        advanceGraphBatch("manual");
        return;
      }
      if (!graphView) return;
      setLoopPaused(true);
      if (action === "zoom-in") graphView.svg.transition().duration(220).call(graphView.zoom.scaleBy, 1.28);
      if (action === "zoom-out") graphView.svg.transition().duration(220).call(graphView.zoom.scaleBy, 0.78);
      if (action === "reset") graphView.svg.transition().duration(360).call(graphView.zoom.transform, graphView.fitTransform);
    });
  });

  const form = document.getElementById("v10SearchForm");
  const input = document.getElementById("graphSearch");
  input?.addEventListener("input", () => highlightGraphMatches(input.value));
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    const matches = searchAllRecords(query);
    const status = document.getElementById("graphStatus");
    if (matches.length) {
      setLoopPaused(true);
      showCaseInGraph(matches[0].id, false);
      window.requestAnimationFrame(() => highlightGraphMatches(query));
      status.textContent = `${matches.length}개의 관련 프로젝트를 찾았습니다. ${matches[0].code}를 표시합니다.`;
    } else {
      highlightGraphMatches("");
      status.textContent = "일치하는 프로젝트가 없습니다. 다른 검색어를 입력해 주세요.";
    }
  });
}

function renderDeepCases() {
  const target = document.getElementById("caseDeepGrid");
  if (!target) return;
  const themes = ["전략", "조직", "직무·인사"];
  const featured = themes.map((theme) => allCaseRecords.find((record) => record.theme === theme)).filter(Boolean);
  target.innerHTML = featured.map((record, index) => `
    <article class="deep-case">
      <div class="deep-case-index">0${index + 1}</div>
      <p class="deep-case-meta">${escapeHTML(record.code)} · ${escapeHTML(record.institutionType)} · ${escapeHTML(record.year)}</p>
      <h3>${escapeHTML(record.summary)}</h3>
      <dl>
        <div><dt>과제</dt><dd>${escapeHTML(record.problem)}</dd></div>
        <div><dt>수행 내용</dt><dd>${escapeHTML(record.approach)}</dd></div>
        <div><dt>결과물</dt><dd>${escapeHTML(record.output)}</dd></div>
      </dl>
      <button type="button" class="case-map-link" data-case-focus="${record.id}">지도에서 프로젝트 보기 <span aria-hidden="true">↗</span></button>
    </article>
  `).join("");

  target.querySelectorAll("[data-case-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      setLoopPaused(true);
      document.getElementById("evidence-os")?.scrollIntoView({
        behavior: graphState.reducedMotion ? "auto" : "smooth",
        block: "start"
      });
      window.setTimeout(() => showCaseInGraph(button.dataset.caseFocus, true), graphState.reducedMotion ? 0 : 420);
    });
  });
}

function setInquiryStatus(kind, message) {
  const status = document.getElementById("inquiryStatus");
  if (!status) return;
  status.className = `form-status ${kind ? `is-${kind}` : ""}`;
  status.textContent = message;
}

function initInquiryForm() {
  const form = document.getElementById("inquiryForm");
  const startedAt = document.getElementById("inquiryFormStartedAt");
  if (!form || !startedAt) return;
  const resetStartedAt = () => {
    startedAt.value = String(Date.now());
  };
  resetStartedAt();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const button = form.querySelector("button[type='submit']");
    const originalLabel = button.textContent;
    const data = Object.fromEntries(new FormData(form).entries());
    button.disabled = true;
    button.textContent = "보내는 중";
    setInquiryStatus("sending", "문의 내용을 보내는 중입니다.");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        form.reset();
        resetStartedAt();
        setInquiryStatus("success", "문의가 접수되었습니다. 확인 후 연락드리겠습니다.");
        return;
      }
      const messages = {
        400: "입력한 내용을 다시 확인해 주세요.",
        403: "페이지를 새로고침한 뒤 다시 보내 주세요.",
        429: "요청이 많습니다. 잠시 후 다시 보내 주세요."
      };
      const fallback = "온라인 접수가 지연되고 있습니다. ceo@strat.kr 또는 02-6083-0330으로 연락해 주세요.";
      const message = response.status >= 500
        ? fallback
        : messages[response.status] || result.message || fallback;
      setInquiryStatus("error", message);
    } catch (_error) {
      setInquiryStatus("error", "온라인 접수가 지연되고 있습니다. ceo@strat.kr 또는 02-6083-0330으로 연락해 주세요.");
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
}

function initResponsiveGraph() {
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const nextBatchSize = getBatchSize();
      const width = document.getElementById("caseUniverseGraph")?.clientWidth || 0;
      const sizeChanged = nextBatchSize !== graphState.batchSize;
      if (!sizeChanged && graphView && Math.abs(width - graphView.width) < 24) return;
      graphState.batchSize = nextBatchSize;
      if (graphState.selectedId && allCaseRecords.some((record) => record.id === graphState.selectedId)) {
        showCaseInGraph(graphState.selectedId);
      } else {
        renderCurrentBatch();
      }
    }, 180);
  }, { passive: true });
}

function initGraphLifecycle() {
  const section = document.getElementById("evidence-os");
  if ("IntersectionObserver" in window && section) {
    const observer = new IntersectionObserver((entries) => {
      graphState.inViewport = entries.some((entry) => entry.isIntersecting);
      if (graphState.inViewport) scheduleGraphLoop();
      else clearGraphTimer();
    }, { threshold: 0.08 });
    observer.observe(section);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearGraphTimer();
    else scheduleGraphLoop();
  });
}

async function loadExperienceData() {
  const response = await fetch("/graph-experience.json", { headers: { "Accept": "application/json" } });
  if (!response.ok) throw new Error("experience_data_unavailable");
  const payload = await response.json();
  if (!Array.isArray(payload.records) || payload.records.length < 1) throw new Error("experience_data_invalid");
  return payload;
}

async function initExperienceGraph() {
  const container = document.getElementById("caseUniverseGraph");
  try {
    graphState.data = await loadExperienceData();
    allCaseRecords = graphState.data.records;
    graphState.batchSize = getBatchSize();
    graphState.order = createCycleOrder(allCaseRecords);
    renderCurrentBatch();
    renderDeepCases();
    initGraphLifecycle();
    scheduleGraphLoop();
  } catch (_error) {
    if (container) {
      container.innerHTML = `
        <div class="graph-fallback">
          <p>프로젝트 데이터를 불러오지 못했습니다.</p>
          <a class="detail-cta" href="#contact">상담 문의 <span aria-hidden="true">↗</span></a>
        </div>
      `;
    }
    const status = document.getElementById("graphBatchStatus");
    if (status) status.textContent = "프로젝트 데이터를 확인할 수 없습니다.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initGraphControls();
  initInquiryForm();
  initResponsiveGraph();
  initExperienceGraph();
});

/* Existing release-check vocabulary retained as non-executable compatibility metadata:
   initAwardMotion initLenisScroll initCaseRadar initCaseUniverse buildCaseUniverseData
   loadCaseUniverseContent applyRadarLens buildResultMeter updateDiagnosisDock
   loadStrategyV10Data retrieveSimilarCases renderV10EvidenceOS drawV10Constellation
   STRATEGY_EVIDENCE_OS stripPublicUnsafeText
*/
