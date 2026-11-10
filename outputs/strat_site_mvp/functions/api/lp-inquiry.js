const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_TRACKED_IPS = 1000;

const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term"
];

const ALLOWED_INPUT_KEYS = new Set([
  "form",
  "event_id",
  "theme",
  "name",
  "organization",
  "job_title",
  "email",
  "phone",
  "message",
  "consent",
  "honeypot",
  "website",
  "company_url",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "page_path",
  "occurred_at"
]);

const MAX_LENGTHS = {
  form: 20,
  event_id: 80,
  theme: 80,
  name: 100,
  organization: 150,
  job_title: 100,
  email: 254,
  phone: 40,
  message: 5000,
  consent: 20,
  honeypot: 200,
  website: 200,
  company_url: 200,
  utm_source: 200,
  utm_medium: 200,
  utm_campaign: 200,
  utm_content: 200,
  utm_term: 200,
  page_path: 500,
  occurred_at: 64
};

/*
 * KV가 없는 경우에는 이 Pages Function 인스턴스 안에서만 제한한다.
 * 인스턴스 재시작·분산 환경 전체에 걸친 강한 제한은 아니다.
 */
const localBuckets = new Map();

class PayloadTooLargeError extends Error {}

function clean(value) {
  return String(value ?? "").trim();
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders
    }
  });
}

function isSameOrigin(request) {
  const origin = request.headers.get("Origin");
  const fetchSite = request.headers.get("Sec-Fetch-Site");

  if (!origin) return false;

  try {
    const requestOrigin = new URL(request.url).origin;
    return (
      new URL(origin).origin === requestOrigin &&
      (!fetchSite || fetchSite === "same-origin")
    );
  } catch {
    return false;
  }
}

async function readJsonBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing request body");

  const chunks = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new PayloadTooLargeError("Request body is too large");
    }
    chunks.push(value);
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(combined));
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function validateSubmission(body) {
  const submission = {
    form: clean(body.form),
    event_id: clean(body.event_id),
    theme: clean(body.theme),
    name: clean(body.name),
    organization: clean(body.organization),
    job_title: clean(body.job_title),
    email: clean(body.email),
    phone: clean(body.phone),
    message: clean(body.message),
    consent: clean(body.consent),
    honeypot: "",
    utm_source: clean(body.utm_source),
    utm_medium: clean(body.utm_medium),
    utm_campaign: clean(body.utm_campaign),
    utm_content: clean(body.utm_content),
    utm_term: clean(body.utm_term),
    page_path: clean(body.page_path),
    occurred_at: clean(body.occurred_at)
  };

  for (const [key, maxLength] of Object.entries(MAX_LENGTHS)) {
    if (clean(body[key]).length > maxLength) {
      return { error: "입력 가능한 글자 수를 초과했습니다." };
    }
  }

  if (!["inquiry", "checklist"].includes(submission.form)) {
    return { error: "폼 유형을 확인해 주세요." };
  }

  if (!/^[A-Za-z0-9-]{8,80}$/.test(submission.event_id)) {
    return { error: "접수 식별값을 확인해 주세요." };
  }

  if (!/^[A-Za-z0-9_-]{1,80}$/.test(submission.theme)) {
    return { error: "테마 값을 확인해 주세요." };
  }

  if (!isEmail(submission.email)) {
    return { error: "이메일 주소를 확인해 주세요." };
  }

  if (submission.consent !== "agreed") {
    return { error: "개인정보 수집·이용 동의가 필요합니다." };
  }

  if (submission.form === "inquiry") {
    if (
      !submission.name ||
      !submission.organization ||
      !submission.job_title ||
      !submission.message
    ) {
      return { error: "필수 입력값을 확인해 주세요." };
    }
  }

  if (submission.page_path && !submission.page_path.startsWith("/")) {
    return { error: "페이지 경로를 확인해 주세요." };
  }

  if (
    submission.occurred_at &&
    !Number.isFinite(Date.parse(submission.occurred_at))
  ) {
    return { error: "발생 시각을 확인해 주세요." };
  }

  return { submission };
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function checkLocalRateLimit(key, now) {
  const bucket = localBuckets.get(key);

  if (!bucket || now - bucket.startedAt >= RATE_LIMIT_WINDOW_MS) {
    if (localBuckets.size >= MAX_TRACKED_IPS) {
      localBuckets.delete(localBuckets.keys().next().value);
    }
    localBuckets.set(key, { startedAt: now, count: 1 });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

async function isRateLimited(env, ip) {
  const now = Date.now();
  const windowId = Math.floor(now / RATE_LIMIT_WINDOW_MS);
  const ipHash = await sha256Hex(ip);
  const localKey = `${windowId}:${ipHash}`;

  if (checkLocalRateLimit(localKey, now)) return true;

  const kv = env.INQUIRY_RATE_LIMIT;
  if (!kv) return false;

  /*
   * KV는 선택 사항이다. KV 오류가 나면 인스턴스 메모리 제한만 적용한다.
   * KV의 읽기-쓰기 증가는 원자적이지 않아 강한 분산 제한은 아니다.
   */
  try {
    const kvKey = `inquiry:${localKey}`;
    const current = Number((await kv.get(kvKey)) || "0");

    if (current >= RATE_LIMIT_MAX) return true;

    await kv.put(kvKey, String(current + 1), { expirationTtl: 120 });
  } catch {
    // KV가 없거나 쓸 수 없으면 메모리 제한만 남긴다.
  }

  return false;
}

function getAppsScriptUrl(value) {
  try {
    const url = new URL(value);
    const validPath = /^\/macros\/s\/[^/]+\/exec$/.test(url.pathname);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "script.google.com" ||
      !validPath
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export async function onRequest({ request }) {
  const url = new URL(request.url);

  if (url.pathname !== "/api/lp-inquiry") {
    return jsonResponse({ ok: false, message: "요청 경로를 확인해 주세요." }, 404);
  }

  return jsonResponse(
    { ok: false, message: "POST 요청만 허용됩니다." },
    405,
    { Allow: "POST" }
  );
}

export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);

  if (url.pathname !== "/api/lp-inquiry") {
    return jsonResponse({ ok: false, message: "요청 경로를 확인해 주세요." }, 404);
  }

  if (!isSameOrigin(request)) {
    return jsonResponse({ ok: false, message: "허용되지 않은 요청입니다." }, 403);
  }

  const contentType = request.headers
    .get("Content-Type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return jsonResponse({ ok: false, message: "JSON 요청만 허용됩니다." }, 415);
  }

  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, message: "요청 크기가 너무 큽니다." }, 413);
  }

  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return jsonResponse({ ok: false, message: "요청 크기가 너무 큽니다." }, 413);
    }
    return jsonResponse({ ok: false, message: "요청 형식이 올바르지 않습니다." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse({ ok: false, message: "요청 형식이 올바르지 않습니다." }, 400);
  }

  if (Object.keys(body).some((key) => !ALLOWED_INPUT_KEYS.has(key))) {
    return jsonResponse({ ok: false, message: "입력 항목을 확인해 주세요." }, 400);
  }

  for (const [key, value] of Object.entries(body)) {
    if (value !== null && typeof value !== "string") {
      return jsonResponse({ ok: false, message: "입력값 형식을 확인해 주세요." }, 400);
    }
    if (value === null && !UTM_FIELDS.includes(key)) {
      return jsonResponse({ ok: false, message: "입력값 형식을 확인해 주세요." }, 400);
    }
  }

  if (
    clean(body.honeypot) ||
    clean(body.website) ||
    clean(body.company_url)
  ) {
    return jsonResponse({ ok: true, ignored: true });
  }

  const validation = validateSubmission(body);
  if (!validation.submission) {
    return jsonResponse({ ok: false, message: validation.error }, 400);
  }

  const clientIp = request.headers.get("CF-Connecting-IP")?.trim();
  if (clientIp && (await isRateLimited(env, clientIp))) {
    const secondsIntoMinute = Math.floor((Date.now() / 1000) % 60);
    const retryAfter = Math.max(1, 60 - secondsIntoMinute);

    return jsonResponse(
      { ok: false, message: "요청이 많습니다. 잠시 후 다시 시도해 주세요." },
      429,
      { "Retry-After": String(retryAfter) }
    );
  }

  const relayUrl = getAppsScriptUrl(env.RELAY_GAS_URL || "");
  const relayToken =
    typeof env.RELAY_TOKEN === "string" ? env.RELAY_TOKEN.trim() : "";

  if (!relayUrl || !relayToken) {
    return jsonResponse(
      { ok: false, message: "접수 서비스 설정이 아직 완료되지 않았습니다." },
      503
    );
  }

  const relayPayload = Object.assign({}, validation.submission, {
    /*
     * Pages에서 요청 헤더도 전달한다. Apps Script가 헤더를 읽을 수 없으므로
     * Apps Script 검증용 토큰은 서버 간 JSON 본문에도 넣는다.
     */
    relay_token: relayToken
  });

  let gasResponse;
  try {
    gasResponse = await fetch(relayUrl, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-Relay-Token": relayToken
      },
      body: JSON.stringify(relayPayload)
    });
  } catch {
    return jsonResponse(
      { ok: false, message: "접수 서비스에 연결하지 못했습니다." },
      502
    );
  }

  const responseText = await gasResponse.text();

  try {
    JSON.parse(responseText);
  } catch {
    return jsonResponse(
      { ok: false, message: "접수 서비스 응답을 확인할 수 없습니다." },
      502
    );
  }

  // Apps Script가 반환한 JSON 본문을 다시 가공하지 않고 전달한다.
  return new Response(responseText, {
    status: gasResponse.status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
