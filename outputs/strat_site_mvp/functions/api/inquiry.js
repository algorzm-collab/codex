const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_BODY_BYTES = 20_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_TRACKED_IPS = 1000;
const MAX_LENGTHS = {
  name: 80,
  phone: 40,
  organization: 120,
  email: 254,
  service: 100,
  message: 5000
};
const INPUT_KEYS = [
  "name",
  "phone",
  "organization",
  "email",
  "service",
  "message",
  "privacyConsent",
  "formStartedAt",
  "website"
];
const requestBuckets = new Map();

class PayloadTooLargeError extends Error {}

function clean(value) {
  return String(value ?? "").trim();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sanitizeSubject(value) {
  return value.replace(/[\r\n]+/g, " ");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value) {
  if (!/^[0-9+\-().\s]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function isOverLimit(body) {
  return Object.entries(MAX_LENGTHS).some(
    ([key, maxLength]) => String(body[key] ?? "").length > maxLength
  );
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

function getClientIp(request) {
  return request.headers.get("CF-Connecting-IP")?.trim() || null;
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = requestBuckets.get(ip);
  if (!bucket || now - bucket.startedAt > RATE_LIMIT_WINDOW_MS) {
    if (requestBuckets.size >= MAX_TRACKED_IPS) {
      requestBuckets.delete(requestBuckets.keys().next().value);
    }
    requestBuckets.set(ip, { startedAt: now, count: 1 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
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
  chunks.forEach((chunk) => {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  });
  return JSON.parse(new TextDecoder().decode(combined));
}

function validateOrigin(request) {
  const origin = request.headers.get("Origin");
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  try {
    return Boolean(
      origin &&
      new URL(origin).origin === new URL(request.url).origin &&
      (!fetchSite || fetchSite === "same-origin")
    );
  } catch {
    return false;
  }
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return jsonResponse({ message: "POST 요청만 허용됩니다." }, 405, { Allow: "POST" });
  }

  const contentType = request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return jsonResponse({ message: "JSON 요청만 허용됩니다." }, 415);
  }

  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ message: "요청 크기가 너무 큽니다." }, 413);
  }

  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return jsonResponse({ message: "요청 크기가 너무 큽니다." }, 413);
    }
    return jsonResponse({ message: "요청 형식이 올바르지 않습니다." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse({ message: "요청 형식이 올바르지 않습니다." }, 400);
  }
  if (INPUT_KEYS.some((key) => body[key] !== undefined && typeof body[key] !== "string")) {
    return jsonResponse({ message: "입력값 형식이 올바르지 않습니다." }, 400);
  }

  if (clean(body.website)) return jsonResponse({ ok: true });
  if (isOverLimit(body)) {
    return jsonResponse({ message: "입력 가능한 글자 수를 초과했습니다." }, 400);
  }

  const submission = {
    name: clean(body.name),
    phone: clean(body.phone),
    organization: clean(body.organization),
    email: clean(body.email),
    service: clean(body.service) || "홈페이지 상담 문의",
    message: clean(body.message)
  };
  if (
    !submission.name ||
    !submission.phone ||
    !submission.email ||
    !submission.message ||
    !isPhone(submission.phone) ||
    !isEmail(submission.email) ||
    body.privacyConsent !== "agreed"
  ) {
    return jsonResponse({ message: "필수 입력값을 확인해 주세요." }, 400);
  }

  const startedAt = Number(body.formStartedAt);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < 2500 || elapsed > 24 * 60 * 60 * 1000) {
    return jsonResponse({ message: "양식을 새로고침한 뒤 다시 작성해 주세요." }, 400);
  }
  if (!validateOrigin(request)) {
    return jsonResponse({ message: "허용되지 않은 요청입니다." }, 403);
  }

  const clientIp = getClientIp(request);
  if (clientIp && isRateLimited(clientIp)) {
    return jsonResponse(
      { message: "요청이 많습니다. 잠시 후 다시 시도해 주세요." },
      429,
      { "Retry-After": "600" }
    );
  }

  const apiKey = env.RESEND_API_KEY?.trim();
  const recipient = env.CONTACT_TO_EMAIL?.trim();
  const sender = env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !recipient || !sender || /[\r\n]/.test(recipient + sender)) {
    console.error("Inquiry email environment is not fully configured.");
    return jsonResponse({ message: "메일 서비스 설정이 아직 완료되지 않았습니다." }, 503);
  }

  const organization = submission.organization || "소속 미입력";
  const safe = Object.fromEntries(
    Object.entries({ ...submission, organization }).map(([key, value]) => [key, escapeHtml(value)])
  );

  let emailResponse;
  try {
    emailResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: submission.email,
        subject: `[STRATEGY 문의] ${sanitizeSubject(organization)} · ${sanitizeSubject(submission.name)}`,
        text: [
          "STRATEGY 홈페이지 상담 문의",
          "",
          `성함: ${submission.name}`,
          `소속: ${organization}`,
          `연락처: ${submission.phone}`,
          `이메일: ${submission.email}`,
          `문의 경로: ${submission.service}`,
          "",
          "문의 내용",
          submission.message
        ].join("\n"),
        html: `
          <h2>STRATEGY 홈페이지 상담 문의</h2>
          <table style="border-collapse:collapse">
            <tr><th style="text-align:left;padding:6px 12px 6px 0">성함</th><td>${safe.name}</td></tr>
            <tr><th style="text-align:left;padding:6px 12px 6px 0">소속</th><td>${safe.organization}</td></tr>
            <tr><th style="text-align:left;padding:6px 12px 6px 0">연락처</th><td>${safe.phone}</td></tr>
            <tr><th style="text-align:left;padding:6px 12px 6px 0">이메일</th><td>${safe.email}</td></tr>
            <tr><th style="text-align:left;padding:6px 12px 6px 0">문의 경로</th><td>${safe.service}</td></tr>
          </table>
          <h3>문의 내용</h3>
          <p style="white-space:pre-wrap">${safe.message}</p>
        `
      })
    });
  } catch (error) {
    console.error("Resend network error:", error);
    return jsonResponse({ message: "메일 발송 서비스에 연결하지 못했습니다." }, 502);
  }

  const result = await emailResponse.json().catch(() => ({}));
  if (!emailResponse.ok) {
    const requestId = emailResponse.headers?.get?.("Request-Id") ||
      emailResponse.headers?.get?.("X-Request-Id") ||
      result?.request_id ||
      "unavailable";
    console.error("Resend error:", emailResponse.status, requestId);
    return jsonResponse({ message: "메일 발송 서비스가 요청을 처리하지 못했습니다." }, 502);
  }

  return jsonResponse({ ok: true });
}
