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
  const html = items.map(renderItem).join("") || "<p>기록이 없습니다.</p>";
  $("#records").innerHTML = html;
}

function renderItem(item) {
  if (activeTab === "cases") {
    return `<div class="record"><b>#${item.id} ${item.title}</b><p>${item.customer_type} · ${item.solution_cluster}</p><p>${item.problem}</p><p>정렬 ${item.display_order} · 공개 ${item.is_published}</p><button class="btn secondary" data-delete-table="cases" data-delete-id="${item.id}">비공개</button></div>`;
  }
  if (activeTab === "slides") {
    return `<div class="record"><b>#${item.id} ${item.title}</b><p>${item.summary}</p><p>정렬 ${item.display_order} · 공개 ${item.is_published}</p><button class="btn secondary" data-delete-table="key_slides" data-delete-id="${item.id}">비공개</button></div>`;
  }
  if (activeTab === "users") {
    return `<div class="record"><b>#${item.id} ${item.name}</b><p>${item.organization}</p><p>${item.phone || ""} ${item.email || ""}</p><p>${item.created_at}</p></div>`;
  }
  if (activeTab === "mailing") {
    return `<div class="record"><b>#${item.id} ${item.email}</b><p>${item.name} · ${item.organization || ""}</p><p>${item.phone || ""} · source: ${item.source} · active: ${item.is_active}</p><p>${item.created_at}</p></div>`;
  }
  if (activeTab === "project_records") {
    return `<div class="record"><b>#${item.id} ${item.client}</b><p>${item.theme} · ${item.sector}</p><p>${item.project_title}${item.year_note ? ` · ${item.year_note}` : ""}</p><p>정렬 ${item.display_order} · 공개 ${item.is_published}</p><button class="btn secondary" data-delete-table="project_records" data-delete-id="${item.id}">비공개</button></div>`;
  }
  if (activeTab === "issues") {
    return `<div class="record"><b>#${item.id} ${item.inferred_type}</b><p>symptom: ${item.symptom || "-"}</p><p>scene: ${item.scene || "-"} / need: ${item.need || "-"}</p><p>${item.created_at}</p></div>`;
  }
  if (activeTab === "events") {
    return `<div class="record"><b>#${item.id} ${item.event_name}</b><p>${item.source_section || "-"} · ${item.inferred_type || "-"}</p><p>target: ${item.target_title || item.target_id || "-"}</p><p>session: ${item.session_id || "-"} · ${item.created_at}</p></div>`;
  }
  if (activeTab === "inquiries") {
    return `<div class="record"><b>#${item.id} ${item.name}</b><p>${item.organization || ""} · ${item.email || ""} · ${item.phone || ""}</p><p>${item.message}</p><p>${item.created_at}</p></div>`;
  }
  if (activeTab === "qa") {
    return `<div class="record"><b>#${item.id} ${item.title}</b><p>${item.name} · ${item.organization || ""}</p><p>${item.question}</p><p>상태: ${item.status} · ${item.created_at}</p></div>`;
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
  const ok = confirm("이 항목을 비공개 처리할까요?");
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
  $("#caseNote").textContent = response.ok ? `실적이 저장되었습니다. ID ${response.id}` : (response.error || "저장 실패");
  if (response.ok) {
    event.currentTarget.reset();
    event.currentTarget.elements.is_published.checked = true;
    await loadRecords();
  }
});

$("#slideForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const response = await postJSON("/api/admin/slide", formPayload(event.currentTarget));
  $("#slideNote").textContent = response.ok ? `장표가 저장되었습니다. ID ${response.id}` : (response.error || "저장 실패");
  if (response.ok) {
    event.currentTarget.reset();
    event.currentTarget.elements.is_published.checked = true;
    await loadRecords();
  }
});

$("#projectForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const response = await postJSON("/api/admin/project-record", formPayload(event.currentTarget));
  $("#projectNote").textContent = response.ok ? `전체 실적이 저장되었습니다. ID ${response.id}` : (response.error || "저장 실패");
  if (response.ok) {
    event.currentTarget.reset();
    event.currentTarget.elements.is_published.checked = true;
    await loadRecords();
  }
});

loadRecords();
