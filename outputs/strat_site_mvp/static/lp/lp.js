/* ------------------------------------------------------------------
   lp.js — 광고 랜딩 공용 스크립트 (site/lp/)

   [3단 확인] 만들기 전에 찾았다 (2026-09-21)
     · teams/web 전체 grep: dataLayer|utm_|gtag|event_id → 0건
     · output/homepage-v14-20260907/strategy-homepage-v14.html grep → 0건
     · site/assets/motion.js · motion-main.js 는 모션 전용, 측정·폼 처리 없음
     · site/v13/contact.html 의 폼은 inline onsubmit 한 줄뿐, 재사용할 구조 없음
     → 사내에 재사용할 랜딩 측정·폼 코드가 없어 새로 쓴다.
       외부 라이브러리는 붙이지 않는다(광고 유입 페이지, 의존성 0).

   하는 일 넷:
     1) 유입 경로(utm_*)를 주소에서 읽어 둔다. 개인정보처럼 보이는 값은 버린다
     2) window.dataLayer 에 네 가지 사건을 밀어 넣는다
        lp_view · checklist_request · inquiry_start · inquiry_submit
     3) 각 사건에 event_id(uuid)를 붙이고, 같은 값을 폼 숨은 칸에 적어 둔다
        (나중에 서버에서 Conversions API 로 같은 사건을 다시 보낼 때
         중복 제거 키로 쓴다)
     4) 폼은 어디로도 보내지 않는다 — 막고, 검사하고, 확인 화면을 보인다

   개인정보 취급 원칙 (2026-09-21 검수 지적 반영):
     · 이용자가 입력한 값은 dataLayer 에도, 콘솔에도, 주소에도 남기지 않는다.
       콘솔에는 사건 이름·event_id·테마·「칸 이름 목록」만 찍는다.
     · 측정 도구 식별자(픽셀 ID·측정 ID·토큰)는 이 파일에 하나도 없다.
------------------------------------------------------------------ */
(function () {
  'use strict';
  var RELAY_ENDPOINT = '/api/lp-inquiry'; // 코덱스 루나 중계기(2026-10-22), 빈 값이면 시안 모드

  window.dataLayer = window.dataLayer || [];

  /* ---------- 공용 도구 ---------- */

  function uuid() {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
      }
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        var b = new Uint8Array(16);
        window.crypto.getRandomValues(b);
        b[6] = (b[6] & 0x0f) | 0x40;
        b[8] = (b[8] & 0x3f) | 0x80;
        var h = [];
        for (var i = 0; i < 16; i++) h.push((b[i] + 0x100).toString(16).slice(1));
        return h.slice(0, 4).join('') + '-' + h.slice(4, 6).join('') + '-' +
               h.slice(6, 8).join('') + '-' + h.slice(8, 10).join('') + '-' +
               h.slice(10, 16).join('');
      }
    } catch (e) { /* 아래 대체 경로로 */ }
    // 최후 대체 — 암호학적 품질은 아니지만 중복 제거 키로는 충분하다
    var s = '';
    for (var j = 0; j < 32; j++) s += Math.floor(Math.random() * 16).toString(16);
    return s.slice(0, 8) + '-' + s.slice(8, 12) + '-4' + s.slice(13, 16) + '-a' +
           s.slice(17, 20) + '-' + s.slice(20, 32);
  }

  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  // 광고 주소에 개인정보가 섞여 들어오는 사고를 막는다.
  // 이메일 모양이거나, 숫자가 7자리 이상 이어지는(전화번호로 보이는) 값은 버린다.
  var LOOKS_EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]{2,}/;
  function looksPersonal(value) {
    if (LOOKS_EMAIL.test(value)) return true;
    var digits = value.replace(/\D/g, '');
    return digits.length >= 7;
  }

  function readUtm() {
    var out = {};
    var q;
    try { q = new URLSearchParams(window.location.search); }
    catch (e) { q = null; }
    UTM_KEYS.forEach(function (k) {
      var v = q ? q.get(k) : null;
      if (!v) { out[k] = null; return; }
      v = String(v).slice(0, 200);
      out[k] = looksPersonal(v) ? null : v;
    });
    return out;
  }

  var UTM = readUtm();
  var THEME = (document.body && document.body.getAttribute('data-lp-theme')) || 'unknown';

  function push(eventName, eventId, extra) {
    var payload = {
      event: eventName,
      event_id: eventId,
      theme: THEME,
      page_path: window.location.pathname,
      occurred_at: new Date().toISOString()
    };
    UTM_KEYS.forEach(function (k) { payload[k] = UTM[k]; });
    if (extra) {
      Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; });
    }
    window.dataLayer.push(payload);
    return payload;
  }

  /* ---------- 1. 페이지 조회 ---------- */
  push('lp_view', uuid());

  /* ---------- 2. 히어로 영상 ----------
     영상 파일이 확정되기 전에는 아무것도 요청하지 않는다.
     쓸 영상이 생기면 히어로 상자에 data-hero-src="assets/hero.mp4" 를 달아 준다.
     그때에만 <video> 를 만들어 붙인다. 지금은 비워 두었으므로 요청이 0건이다. */
  (function heroMedia() {
    var box = document.querySelector('[data-hero-media]');
    if (!box) return;

    var src = box.getAttribute('data-hero-src');
    if (!src) { box.setAttribute('data-media', 'fallback'); return; }

    var reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { /* 판단 불가 시 재생 시도 */ }
    if (reduce) { box.setAttribute('data-media', 'fallback'); return; }

    var video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.tabIndex = -1;
    video.preload = 'metadata';

    var failed = false;
    function fallback() {
      if (failed) return;
      failed = true;
      box.setAttribute('data-media', 'fallback');
      if (video.parentNode) video.parentNode.removeChild(video);
    }
    video.addEventListener('error', fallback);
    video.addEventListener('loadeddata', function () {
      box.setAttribute('data-media', 'ok');
    });

    video.src = src;
    box.insertBefore(video, box.firstChild);

    window.setTimeout(function () { if (video.readyState < 2) fallback(); }, 3000);
    try {
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () { /* 자동재생 차단은 정상 */ });
    } catch (e) { /* 무시 */ }
  }());

  /* ---------- 3. 폼 공통 처리 ---------- */

  function errorBoxFor(field) {
    // 칸과 안내문은 aria-describedby 로 묶여 있다. 그 상자를 먼저 찾는다.
    var id = field.getAttribute('aria-describedby');
    if (id) {
      var byId = document.getElementById(id.split(/\s+/)[0]);
      if (byId && byId.classList.contains('err')) return byId;
    }
    return field.parentNode.querySelector('.err');
  }

  function setError(field, message) {
    var box = errorBoxFor(field);
    if (box) box.textContent = message || '';
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function userFields(form) {
    // 이용자가 실제로 채우는 칸만. 숨은 칸과 벌꿀통은 뺀다.
    return Array.prototype.filter.call(
      form.querySelectorAll('input, textarea'),
      function (f) { return f.type !== 'hidden' && !f.classList.contains('hp'); }
    );
  }

  function validate(form) {
    var firstBad = null;
    userFields(form).forEach(function (f) {
      setError(f, '');
      var value = (f.type === 'checkbox') ? f.checked : String(f.value || '').trim();

      if (f.required && !value) {
        setError(f, f.type === 'checkbox'
          ? '수집·이용에 동의하셔야 다음으로 넘어갑니다.'
          : '필수 항목입니다.');
        if (!firstBad) firstBad = f;
        return;
      }
      if (f.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setError(f, '이메일 주소 형식을 확인해 주십시오.');
        if (!firstBad) firstBad = f;
      }
    });
    return firstBad;
  }

  // 값이 아니라 「칸 이름」만 모은다. 개인정보는 여기서 빠져나가지 않는다.
  function fieldNames(form) {
    return userFields(form)
      .map(function (f) { return f.name; })
      .filter(Boolean);
  }

  function wireForm(form, opts) {
    if (!form) return;

    // 사건 식별자를 미리 만들어 숨은 칸에 적어 둔다.
    // 서버 중계(Conversions API)가 같은 값을 그대로 실어 보내면
    // 브라우저에서 올라간 사건과 짝지어 중복을 지울 수 있다.
    var eventId = uuid();
    var hidden = form.querySelector('input[name="event_id"]');
    if (hidden) hidden.value = eventId;

    var started = false;
    if (opts.startEvent) {
      form.addEventListener('focusin', function (ev) {
        if (started) return;
        var t = ev.target;
        if (!t || !t.name) return;
        // 벌꿀통과 동의 체크는 「문의를 시작했다」로 보지 않는다.
        if (t.classList.contains('hp')) return;
        if (t.type === 'checkbox' || t.type === 'hidden') return;
        started = true;
        push(opts.startEvent, uuid(), { form: opts.formName });
      });
    }

    var host = opts.doneScope || form.parentNode;
    var done = host.querySelector('.form-done');

    var submitting = false;

    function formValue(name) {
      var field = form.elements.namedItem(name);
      if (!field || typeof field.value === 'undefined') return '';
      return String(field.value || '').trim();
    }

    function fetchWithTimeout(url, options, timeoutMs) {
      var controller = window.AbortController
        ? new window.AbortController()
        : null;

      if (controller) options.signal = controller.signal;

      return new Promise(function (resolve, reject) {
        var timer = window.setTimeout(function () {
          if (controller) controller.abort();
          reject(new Error('timeout'));
        }, timeoutMs);

        fetch(url, options).then(
          function (response) {
            window.clearTimeout(timer);
            resolve(response);
          },
          function (error) {
            window.clearTimeout(timer);
            reject(error);
          }
        );
      });
    }

    form.addEventListener('submit', async function (ev) {
      ev.preventDefault();

      var hp = form.querySelector('.hp');
      if (hp && String(hp.value || '').trim()) return;

      var bad = validate(form);
      if (bad) {
        try { bad.focus(); } catch (e) {}
        return;
      }

      if (submitting) return;
      submitting = true;

      var submitButton = form.querySelector('[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      var consent = form.querySelector('input[name="consent"]');
      var sendBody = {
        form: opts.formName,
        event_id: eventId,
        theme: THEME,
        email: formValue('email'),
        consent: consent && consent.checked ? 'agreed' : '',
        honeypot: hp ? String(hp.value || '') : '',
        utm_source: UTM.utm_source,
        utm_medium: UTM.utm_medium,
        utm_campaign: UTM.utm_campaign,
        utm_content: UTM.utm_content,
        utm_term: UTM.utm_term,
        page_path: window.location.pathname,
        occurred_at: new Date().toISOString()
      };

      if (opts.formName === 'inquiry') {
        sendBody.name = formValue('name');
        sendBody.organization = formValue('organization');
        sendBody.job_title = formValue('job_title');
        sendBody.phone = formValue('phone');
        sendBody.message = formValue('message');
      }

      var succeeded = false;
      var errorNotice = form.querySelector('[data-submit-error]');

      try {
        var response = await fetchWithTimeout(RELAY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sendBody),
          credentials: 'same-origin'
        }, 10000);

        var result = await response.json();
        if (!response.ok || !result || result.ok !== true) {
          throw new Error('submission_failed');
        }

        succeeded = true;

        if (errorNotice) errorNotice.textContent = '';

        if (done) {
          var heading = done.querySelector('h3');
          var description = done.querySelector('p');

          if (heading) {
            heading.textContent =
              opts.formName === 'checklist'
                ? '신청이 접수되었습니다.'
                : '상담 문의가 접수되었습니다.';
          }

          if (description) {
            description.textContent = '접수 내용 확인 후 회신드리겠습니다.';
          }
        }

        /*
         * 브라우저 dataLayer 이벤트는 서버가 ok:true를 반환한 뒤에만 기록한다.
         * 전송 필드의 개인정보는 이 이벤트에 넣지 않는다.
         */
        var payload = push(opts.submitEvent, eventId, { form: opts.formName });

        // 콘솔에는 입력값 대신 칸 이름과 사건 정보만 남긴다.
        // eslint-disable-next-line no-console
        console.log('[lp] 접수 완료', {
          event: payload.event,
          event_id: payload.event_id,
          theme: payload.theme,
          fields: fieldNames(form)
        });

        host.classList.add('is-done');
        if (done) {
          done.setAttribute('tabindex', '-1');
          try { done.focus(); } catch (e) {}
        }
      } catch (error) {
        if (!errorNotice) {
          errorNotice = document.createElement('p');
          errorNotice.className = 'form-note';
          errorNotice.setAttribute('data-submit-error', '');
          errorNotice.setAttribute('role', 'alert');
          form.appendChild(errorNotice);
        }

        errorNotice.textContent =
          '접수에 실패했습니다. 잠시 후 다시 시도하거나 ceo@strat.kr로 문의해 주세요.';
      } finally {
        if (!succeeded) {
          submitting = false;
          if (submitButton) submitButton.disabled = false;
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireForm(document.getElementById('checklistForm'), {
      formName: 'checklist',
      submitEvent: 'checklist_request',
      startEvent: null,
      doneScope: document.getElementById('checklistBlock')
    });
    wireForm(document.getElementById('inquiryForm'), {
      formName: 'inquiry',
      submitEvent: 'inquiry_submit',
      startEvent: 'inquiry_start',
      doneScope: document.getElementById('inquiryBlock')
    });

    /* ---------- 4. 얕은 진입 모션 ---------- */
    var targets = document.querySelectorAll('.reveal');
    var reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) {}
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (t) { t.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(targets, function (t) { io.observe(t); });
  });
}());
