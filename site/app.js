const fallback = {
  brief: {
    headline: "ALOS 구축",
    progress: 88,
    current_owner: "chatgpt_cto",
    next_action: "GitHub 상태를 정적 화면에 연결",
    attention_needed: "none",
    critique: "정적 화면은 생겼지만 자동 배포와 실시간 동기화는 아직 남아 있습니다."
  },
  next_prompts: [
    "Task type: MICRO TASK\nObjective: Connect ceo_view.json to the status page.\nScope: site/app.js only.\nStop after one focused commit."
  ]
};

async function loadData() {
  try {
    const res = await fetch("../.alos/ceo_view.json", { cache: "no-store" });
    if (!res.ok) throw new Error("missing data");
    return await res.json();
  } catch (err) {
    return fallback;
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
