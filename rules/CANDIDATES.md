# Candidate Principles

Per governance/GOVERNANCE.md: ideas must be validated through real work before becoming rules.

---

## 1. Checkpoint over Threshold

**Description:** Replace "80%/90% limit risk" shift triggers with continuous checkpointing: update the handoff file after every completed unit of work.

**Why it matters:** No agent can measure its own remaining quota as a percentage. An unmeasurable rule is unenforceable. Continuous checkpoints make ANY interruption safe without prediction.

**Evidence:** 2026-07-09 — Codex session ended mid-mission; recovery depended on its voluntary final report, not on a threshold trigger (which never fired because it cannot be measured).

**Status:** Candidate

---

## 2. Per-Mission Handoff Files

**Description:** Use `.handoff/<mission>.yml` instead of a single `.handoff/latest.yml`.

**Why it matters:** The OS encourages parallel lanes; a singleton file gets clobbered when two agents work simultaneously.

**Evidence:** 2026-07-09 — CTO (slide-forge core) and Lead Developer (comparison engine) worked the same repo in parallel; a single latest.yml would have collided.

**Status:** Candidate

---

## 3. Project Context Lives in the Repo (PROJECT.md)

**Description:** Each project's business context, status, and constraints live in a PROJECT.md file in that project's repo. ChatGPT Projects keep conversation only.

**Why it matters:** portfolio/project_prompting.md assigns project context to ChatGPT Projects, which contradicts CROSS_AGENT_HANDOFF's golden rule ("never trap mission-critical context inside one agent's private conversation"). ChatGPT Project context is unreadable by Claude Code, Codex, and future agents.

**Evidence:** Internal contradiction between two governance documents, found in CTO audit 2026-07-09.

**Status:** Candidate

---

## 4. Knowledge Garbage Collection

**Description:** Quarterly consolidation ritual for rules/, playbooks/, memory/: merge duplicates, expire stale entries, enforce a size budget per layer.

**Why it matters:** "Knowledge Compounds" with no pruning grows context without bound, which contradicts Token-Minimal Maximum Performance. Research indicates bloated LLM-generated context files degrade task success.

**Evidence:** Not yet validated — needs one quarter of accumulation to test.

**Status:** Candidate

---

## 5. Reversibility-Weighted Rigor

**Description:** Reversible decisions get speed; irreversible decisions get rigor. Applies as a tie-breaker inside the Decision Priority stack.

**Why it matters:** For a solo-CEO firm, time-to-value is often the leverage; the current stack (Implementation Speed last) can justify gold-plating trivially reversible work.

**Evidence:** Not yet validated.

**Status:** Candidate
