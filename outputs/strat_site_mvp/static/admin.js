let adminData = {};
let activeTab = "cases";

const $ = (selector) => document.querySelector(selector);

function postJSON(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

function formPayload(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  data.is_published = form.elements.is_published?.checked ?? true;
  if (!data.id) delete data.id;
  return data;
}

async function loadRecords() {
  const response = await fetch("/api/admin/records");
  if (response.status === 401) {
    location.href = "/login";
    return;
  }
  adminData = await response.json();
  renderRecords();
}

function renderRecords() {
  const items = adminData[activeTab] || [];
  if (activeTab === "events") {
    const html = items.map(renderItem).join("") || "<p>No records.</p>";
    const journeyHtml = renderJourneyView(buildJourneyGroups(items));
    $("#records").innerHTML = `${renderEventSummary()}${journeyHtml}${html}`;
    return;
  }

  const html = items.map(renderItem).join("") || "<p>기록이 없습니다.</p>";
  $("#records").innerHTML = html;
}

function buildJourneyGroups(events = []) {
  const bySession = {};
  events.forEach((event) => {
    const sessionId = event.session_id || "no_session_id";
    if (!bySession[sessionId]) bySession[sessionId] = [];
    bySession[sessionId].push(event);
  });

  return Object.entries(bySession)
    .map(([sessionId, history]) => {
      const sorted = history.slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const converted = sorted.some((item) => {
        const eventName = String(item.event_name || "").toLowerCase();
        return eventName.includes("inquiry") || eventName.includes("contact") || eventName.includes("submit");
      });
      return {
        sessionId,
        count: sorted.length,
        converted,
        startAt: first?.created_at || "-",
        endAt: last?.created_at || "-",
        lastEvent: last?.event_name || "-",
        lastTarget: last?.target_title || last?.target_id || "-",
        path: sorted.map((item) => item.event_name || "unknown"),
      };
    })
    .sort((a, b) => new Date(b.endAt) - new Date(a.endAt));
}

function renderJourneyView(journeys = []) {
  const converted = journeys.filter((item) => item.converted).length;
  const items = journeys
    .map(
      (journey) => `
        <li class="journey-item">
          <div class="journey-head">
            <b>${journey.sessionId}</b>
            <span>${journey.count} steps • ${journey.converted ? "Converted" : "In progress"}</span>
          </div>
          <p>start ${journey.startAt} → end ${journey.endAt}</p>
          <p>last: ${journey.lastEvent} / ${journey.lastTarget}</p>
          <p class="journey-path">${journey.path.join(" → ") || "-"}</p>
        </li>
      `
    )
    .join("");

  return `
    <section class="journey-summary">
      <div class="analytics-total">
        <span>Conversion Journeys</span>
        <b>${journeys.length}</b>
        <small>Converted ${converted}</small>
      </div>
      <ol class="journey-list">${items || "<li class='journey-item'>No events yet.</li>"}</ol>
    </section>
  `;
}

function renderRank(title, items = []) {
  const rows = items.length
    ? items.map((item) => `<li><span>${item.name}</span><b>${item.count}</b></li>`).join("")
    : "<li><span>none</span><b>0</b></li>";
  return `<div class="analytics-rank"><h3>${title}</h3><ol>${rows}</ol></div>`;
}

function renderEventSummary() {
  const summary = adminData.event_summary || { total: 0, by_event: [], by_inferred_type: [], by_target: [] };
  return `
    <section class="analytics-summary">
      <div class="analytics-total">
        <span>Total Events</span>
        <b>${summary.total || 0}</b>
      </div>
      ${renderRank("By Event", summary.by_event)}
      ${renderRank("By Problem Type", summary.by_inferred_type)}
      ${renderRank("By Target", summary.by_target)}
    </section>
  `;
}

function renderItem(item) {
  if (activeTab === "cases") {
    return `<div class="record"><b>#${item.id} ${item.title}</b><p>${item.customer_type} | ${item.solution_cluster}</p><p>${item.problem}</p><p>order ${item.display_order} | published ${item.is_published}</p><button class="btn secondary" data-delete-table="cases" data-delete-id="${item.id}">삭제</button></div>`;
  }
  if (activeTab === "slides") {
    return `<div class="record"><b>#${item.id} ${item.title}</b><p>${item.summary}</p><p>order ${item.display_order} | published ${item.is_published}</p><button class="btn secondary" data-delete-table="key_slides" data-delete-id="${item.id}">삭제</button></div>`;
  }
  if (activeTab === "users") {
    return `<div class="record"><b>#${item.id} ${item.name}</b><p>${item.organization}</p><p>${item.phone || ""} ${item.email || ""}</p><p>${item.created_at}</p></div>`;
  }
  if (activeTab === "mailing") {
    return `<div class="record"><b>#${item.id} ${item.email}</b><p>${item.name} | ${item.organization || ""}</p><p>${item.phone || ""} | source: ${item.source} | active: ${item.is_active}</p><p>${item.created_at}</p></div>`;
  }
  if (activeTab === "project_records") {
    return `<div class="record"><b>#${item.id} ${item.client}</b><p>${item.theme} | ${item.sector}</p><p>${item.project_title}${item.year_note ? ` | ${item.year_note}` : ""}</p><p>order ${item.display_order} | published ${item.is_published}</p><button class="btn secondary" data-delete-table="project_records" data-delete-id="${item.id}">삭제</button></div>`;
  }
  if (activeTab === "issues") {
    return `<div class="record"><b>#${item.id} ${item.inferred_type}</b><p>symptom: ${item.symptom || "-"}</p><p>scene: ${item.scene || "-"} / need: ${item.need || "-"}</p><p>${item.created_at}</p></div>`;
  }
  if (activeTab === "events") {
    return `<div class="record"><b>#${item.id} ${item.event_name}</b><p>${item.source_section || "-"} | ${item.inferred_type || "-"}</p><p>target: ${item.target_title || item.target_id || "-"}</p><p>session: ${item.session_id || "-"}</p><p>${item.created_at}</p></div>`;
  }
  if (activeTab === "inquiries") {
    return `<div class="record"><b>#${item.id} ${item.name}</b><p>${item.organization || ""} | ${item.email || ""} | ${item.phone || ""}</p><p>${item.message}</p><p>${item.created_at}</p></div>`;
  }
  if (activeTab === "qa") {
    return `<div class="record"><b>#${item.id} ${item.title}</b><p>${item.name} | ${item.organization || ""}</p><p>${item.question}</p><p>status: ${item.status} | ${item.created_at}</p></div>`;
  }
  return `<div class="record"><pre>${JSON.stringify(item, null, 2)}</pre></div>`;
}

$("#tabs").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-tab]");
  if (!button) return;
  activeTab = button.dataset.tab;
  document.querySelectorAll("#tabs button").forEach((item) => item.classList.toggle("active", item === button));
  renderRecords();
});

$("#records").addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-delete-table]");
  if (!button) return;
  const ok = confirm("삭제할까요?");
  if (!ok) return;
  const response = await postJSON("/api/admin/delete", {
    table: button.dataset.deleteTable,
    id: button.dataset.deleteId,
  });
  if (response.ok) await loadRecords();
});

$("#reloadBtn").addEventListener("click", loadRecords);

$("#logoutBtn").addEventListener("click", async () => {
  await fetch("/api/admin/logout", { method: "POST" });
  location.href = "/login";
});

$("#caseForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const response = await postJSON("/api/admin/case", formPayload(event.currentTarget));
  $("#caseNote").textContent = response.ok ? `성공적으로 저장됐습니다. ID ${response.id}` : (response.error || "저장 실패");
  if (response.ok) {
    event.currentTarget.reset();
    event.currentTarget.elements.is_published.checked = true;
    await loadRecords();
  }
});

$("#slideForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const response = await postJSON("/api/admin/slide", formPayload(event.currentTarget));
  $("#slideNote").textContent = response.ok ? `슬라이드가 저장됐습니다. ID ${response.id}` : (response.error || "저장 실패");
  if (response.ok) {
    event.currentTarget.reset();
    event.currentTarget.elements.is_published.checked = true;
    await loadRecords();
  }
});

$("#projectForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const response = await postJSON("/api/admin/project-record", formPayload(event.currentTarget));
  $("#projectNote").textContent = response.ok ? `프로젝트가 저장됐습니다. ID ${response.id}` : (response.error || "저장 실패");
  if (response.ok) {
    event.currentTarget.reset();
    event.currentTarget.elements.is_published.checked = true;
    await loadRecords();
  }
});

loadRecords();
