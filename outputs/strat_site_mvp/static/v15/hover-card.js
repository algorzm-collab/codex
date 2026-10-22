(() => {
  "use strict";

  const INTERNAL_VALUE =
    /(?:미확인|미대조|증빙 대조|원본 연결|확인 전|확인 중|미분류|내부 검수)/;

  let card = null;
  let records = new Map();
  let activeTrigger = null;
  let hideTimer = 0;

  function usable(value) {
    if (value === undefined || value === null) return false;
    const text = String(value).trim();
    if (!text || INTERNAL_VALUE.test(text)) return false;
    if (/^(?:익명|비공개|기관 확인 중|분야 확인 중|분류 확인 중)$/i.test(text)) {
      return false;
    }
    return true;
  }

  async function loadData() {
    const embedded = document.querySelector("#experience-data");
    if (embedded) {
      try {
        return JSON.parse(embedded.textContent || "{}");
      } catch {
        return null;
      }
    }

    try {
      const response = await fetch(
        new URL("data/public-experience.json", document.baseURI),
        { credentials: "same-origin" }
      );
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  function ensureCard() {
    if (card && card.isConnected) return card;
    if (!document.body) return null;

    card = document.createElement("aside");
    card.id = "experience-hover-card";
    card.className = "experience-hover-card";
    card.setAttribute("role", "tooltip");
    card.hidden = true;
    document.body.append(card);
    return card;
  }

  function makeRow(label, value) {
    if (!usable(value)) return null;

    const row = document.createElement("div");
    row.className = "experience-hover-card__row";

    const name = document.createElement("span");
    name.className = "experience-hover-card__label";
    name.textContent = label;

    const content = document.createElement("strong");
    content.className = "experience-hover-card__value";
    content.textContent = String(value);

    row.append(name, content);
    return row;
  }

  function recordIdFrom(trigger) {
    if (!trigger) return "";

    return (
      trigger.dataset.recordId ||
      trigger.dataset.experienceId ||
      trigger.dataset.select ||
      trigger.__data__?.id ||
      trigger.closest(".node.record")?.__data__?.id ||
      ""
    );
  }

  function triggerFrom(target) {
    if (!(target instanceof Element)) return null;
    return target.closest(
      "[data-record-id], [data-experience-id], [data-select], .node.record"
    );
  }

  function positionCard(node, x, y, trigger) {
    const rect = trigger?.getBoundingClientRect();
    const pointerIsValid = Number.isFinite(x) && Number.isFinite(y);
    const leftAt = pointerIsValid
      ? x + 14
      : rect
        ? rect.left + Math.min(rect.width, 24)
        : 10;
    const topAt = pointerIsValid
      ? y + 14
      : rect
        ? rect.bottom + 8
        : 10;
    const width = node.offsetWidth || 260;
    const height = node.offsetHeight || 130;

    node.style.left = `${Math.max(10, Math.min(leftAt, window.innerWidth - width - 10))}px`;
    node.style.top = `${Math.max(10, Math.min(topAt, window.innerHeight - height - 10))}px`;
  }

  function addDescription(trigger) {
    if (!trigger.dataset.hoverCardDescription) {
      trigger.dataset.hoverCardDescription =
        trigger.getAttribute("aria-describedby") || "";
    }

    const previous = trigger.dataset.hoverCardDescription
      .split(/\s+/)
      .filter(Boolean);

    if (!previous.includes("experience-hover-card")) {
      previous.push("experience-hover-card");
    }

    trigger.setAttribute("aria-describedby", previous.join(" "));
  }

  function restoreDescription(trigger) {
    if (!trigger) return;

    const original = trigger.dataset.hoverCardDescription || "";
    if (original) {
      trigger.setAttribute("aria-describedby", original);
    } else {
      trigger.removeAttribute("aria-describedby");
    }
    delete trigger.dataset.hoverCardDescription;
  }

  function hide() {
    window.clearTimeout(hideTimer);
    if (card) card.hidden = true;
    restoreDescription(activeTrigger);
    activeTrigger = null;
  }

  function showRecord(input, x, y, trigger = null) {
    const node = ensureCard();
    if (!node || !input) return;

    const source =
      typeof input === "object"
        ? records.get(String(input.id || "")) || {}
        : records.get(String(input)) || null;

    if (!source && typeof input !== "object") {
      hide();
      return;
    }

    const supplied =
      typeof input === "object"
        ? Object.fromEntries(
            Object.entries(input).filter(([, value]) => value !== undefined && value !== null)
          )
        : {};
    const record = { ...(source || {}), ...supplied };
    const isTheme = record.type === "theme" || record.kind === "theme";
    let rows;

    if (isTheme) {
      const countValue = record.count ?? record.items?.length ?? record.records?.length;
      const count = Number(countValue);
      rows = [
        makeRow("주제", record.title || record.theme || "기타"),
        makeRow(
          "프로젝트",
          Number.isFinite(count) ? `${count}개` : "주제 묶음"
        ),
      ].filter(Boolean);
    } else {
      rows = [
        makeRow(
          "프로젝트",
          record.title || record.projectTitle || record.originalProjectText || record.name
        ),
        makeRow("기관명", record.institution),
        makeRow("주제", record.theme || record.practice || "기타"),
        makeRow("핵심성공요인", record.successFactor),
      ].filter(Boolean);
    }

    if (!rows.length) {
      hide();
      return;
    }

    window.clearTimeout(hideTimer);
    node.replaceChildren(...rows);

    if (!isTheme && usable(record.successFactor)) {
      const note = document.createElement("p");
      note.className = "experience-hover-card__note";
      note.textContent = record.successFactorBasis === "case"
        ? "제안 당시 접근 방식이며 수행 성과를 뜻하지 않습니다."
        : "주제 분류 안내이며 해당 기관의 성과 사실을 뜻하지 않습니다.";
      node.append(note);
    }

    if (activeTrigger && activeTrigger !== trigger) {
      restoreDescription(activeTrigger);
    }

    activeTrigger = trigger;
    if (trigger) addDescription(trigger);
    node.hidden = false;
    positionCard(node, x, y, trigger);
  }

  function showFromTrigger(trigger, pointer) {
    const id = recordIdFrom(trigger);
    const record = records.get(String(id));
    if (!record) {
      hide();
      return;
    }

    showRecord(record, pointer?.clientX, pointer?.clientY, trigger);
  }

  window.experienceHoverCard = {
    show(record, x, y) {
      showRecord(record, x, y);
    },
    hide,
  };

  async function start() {
    const data = await loadData();
    if (!data || !Array.isArray(data.records)) return;

    records = new Map(
      data.records
        .filter((record) => record && record.id)
        .map((record) => [String(record.id), record])
    );

    document.addEventListener(
      "pointerover",
      (event) => {
        if (event.pointerType === "touch") return;
        const trigger = triggerFrom(event.target);
        if (trigger) showFromTrigger(trigger, event);
      },
      true
    );

    document.addEventListener(
      "pointermove",
      (event) => {
        if (!card?.hidden && activeTrigger) {
          positionCard(card, event.clientX, event.clientY, activeTrigger);
        }
      },
      true
    );

    document.addEventListener(
      "pointerout",
      (event) => {
        if (!activeTrigger) return;
        const fromTrigger = triggerFrom(event.target);
        if (fromTrigger !== activeTrigger) return;

        const toTrigger = triggerFrom(event.relatedTarget);
        if (toTrigger === activeTrigger) return;

        hideTimer = window.setTimeout(hide, 90);
      },
      true
    );

    document.addEventListener(
      "focusin",
      (event) => {
        const trigger = triggerFrom(event.target);
        if (trigger) showFromTrigger(trigger, null);
      },
      true
    );

    document.addEventListener(
      "focusout",
      (event) => {
        if (!activeTrigger) return;
        const next = triggerFrom(event.relatedTarget);
        if (next === activeTrigger) return;
        hideTimer = window.setTimeout(hide, 90);
      },
      true
    );

    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
