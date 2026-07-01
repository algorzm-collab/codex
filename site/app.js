const fallback = {
  brief: {
    headline: "ALOS build",
    progress: 94,
    current_owner: "chatgpt_cto",
    next_action: "Connect short execution tasks",
    attention_needed: "none",
    critique: "Static view is ready. Live deployment and Telegram bridge remain."
  },
  next_prompts: [
    "Improve site/app.js to load generated status when available. Scope: site/app.js only."
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

loadData().then((data) => {
  const brief = data.brief || fallback.brief;
  setText("score", brief.progress ?? "--");
  setText("headline", brief.headline);
  setText("next", brief.next_action);
  setText("owner", brief.current_owner);
  setText("attention", brief.attention_needed);
  setText("critique", brief.critique);
  setText("prompts", (data.next_prompts || []).join("\n\n---\n\n") || "-");
});
