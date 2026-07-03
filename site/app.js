const fallback = {
  brief: {
    headline: "Dashboard viability review",
    progress: 72,
    current_owner: "codex_implementer",
    next_action: "Keep the dashboard static and evidence-backed before attempting live orchestration.",
    attention_needed: "Avoid live automation until GitHub queue and handoff comments are reliable.",
    decision: "continue, but simplify",
    critique: "The dashboard is useful as a cockpit if it stays small. A live remote-control dashboard is not justified until the GitHub queue loop is stable."
  },
  failure_lessons: [
    "Do not treat a dashboard as the source of truth; GitHub issues and commits must remain the durable state.",
    "A dashboard fails when it needs manual data entry in multiple places.",
    "Live approval/control features should wait until static status, queue, and handoff flows are dependable."
  ],
  next_prompts: [
    "Update site/data.json from the latest GitHub queue evidence. Scope: site/data.json only.",
    "If adding live sync, first prove one read-only sync path before adding approval controls."
  ]
};

async function fetchJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("missing data");
  return await res.json();
}

async function loadData() {
  try {
    return await fetchJson("data.json");
  } catch (err) {
    try {
      return await fetchJson("../.alos/ceo_view.json");
    } catch (inner) {
      return fallback;
    }
  }
}

function setText(id, value) {
  document.getElementById(id).textContent = value || "-";
}

function setList(id, values) {
  const node = document.getElementById(id);
  node.replaceChildren();
  (values || []).forEach((value) => {
    const item = document.createElement("li");
    item.textContent = value;
    node.appendChild(item);
  });
  if (!node.children.length) {
    const item = document.createElement("li");
    item.textContent = "-";
    node.appendChild(item);
  }
}

loadData().then((data) => {
  const brief = data.brief || fallback.brief;
  setText("score", brief.progress ?? "--");
  setText("headline", brief.headline);
  setText("next", brief.next_action);
  setText("owner", brief.current_owner);
  setText("attention", brief.attention_needed);
  setText("decision", brief.decision || fallback.brief.decision);
  setText("critique", brief.critique);
  setList("lessons", data.failure_lessons || fallback.failure_lessons);
  setText("prompts", (data.next_prompts || []).join("\n\n---\n\n") || "-");
});
