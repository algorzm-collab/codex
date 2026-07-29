import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from '../functions/api/contact.js';

let requestNumber = 0;

function validBody(overrides = {}) {
    return {
        name: '홍길동',
        phone: '010-1234-5678',
        organization: '테스트 기관',
        email: 'visitor@example.com',
        service: '전략수립',
        message: '상담을 요청합니다.',
        privacyConsent: 'agreed',
        formStartedAt: String(Date.now() - 5000),
        ...overrides
    };
}

async function invoke({
    method = 'POST',
    body = validBody(),
    origin = 'https://strat.kr',
    env = {},
    rawBody,
    contentType = 'application/json',
    clientIp
} = {}) {
    requestNumber += 1;
    const headers = {
        'CF-Connecting-IP': clientIp || `192.0.2.${requestNumber}`
    };
    if (origin !== null) headers.Origin = origin;
    const init = { method, headers };

    if (method !== 'GET' && method !== 'HEAD') {
        headers['Content-Type'] = contentType;
        init.body = rawBody ?? JSON.stringify(body);
    }

    const request = new Request('https://strat.kr/api/contact', init);
    const response = await onRequest({ request, env });
    const responseBody = await response.json();
    return { response, body: responseBody };
}

test('POST가 아닌 요청은 거부한다', async () => {
    const { response } = await invoke({ method: 'GET' });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('Allow'), 'POST');
});

test('잘못된 JSON 요청은 400을 반환한다', async () => {
    const { response } = await invoke({ rawBody: '{' });
    assert.equal(response.status, 400);
});

test('JSON이 아닌 요청은 415를 반환한다', async () => {
    const { response } = await invoke({ contentType: 'text/plain' });
    assert.equal(response.status, 415);
});

test('20KB를 넘는 요청은 413을 반환한다', async () => {
    const { response } = await invoke({ rawBody: 'x'.repeat(20_001) });
    assert.equal(response.status, 413);
});

test('필수값이 빠진 요청은 400을 반환한다', async () => {
    const { response } = await invoke({ body: { name: '홍길동' } });
    assert.equal(response.status, 400);
});

test('개인정보 동의가 없으면 400을 반환한다', async () => {
    const { response } = await invoke({
        body: validBody({ privacyConsent: undefined })
    });
    assert.equal(response.status, 400);
});

test('비정상적으로 빠른 봇 요청은 400을 반환한다', async () => {
    const { response } = await invoke({
        body: validBody({ formStartedAt: String(Date.now()) })
    });
    assert.equal(response.status, 400);
});

test('다른 출처의 요청은 403을 반환한다', async () => {
    const { response } = await invoke({ origin: 'https://attacker.example' });
    assert.equal(response.status, 403);
});

test('Origin이 없는 요청은 403을 반환한다', async () => {
    const { response } = await invoke({ origin: null });
    assert.equal(response.status, 403);
});

test('허니팟을 채운 봇 요청은 메일을 보내지 않는다', async () => {
    const previousFetch = global.fetch;
    let called = false;
    global.fetch = async () => {
        called = true;
        return new Response();
    };

    try {
        const { response } = await invoke({
            body: { website: 'https://spam.example' }
        });
        assert.equal(response.status, 200);
        assert.equal(called, false);
    } finally {
        global.fetch = previousFetch;
    }
});

test('메일 환경변수 셋 중 하나라도 없으면 503을 반환한다', async () => {
    const configurations = [
        {},
        { RESEND_API_KEY: 're_test_key' },
        {
            RESEND_API_KEY: 're_test_key',
            CONTACT_TO_EMAIL: 'inbox@example.com'
        }
    ];

    for (const env of configurations) {
        const { response } = await invoke({ env });
        assert.equal(response.status, 503);
    }
});

test('정상 상담 신청을 지정 Gmail로 전송한다', async () => {
    const previousFetch = global.fetch;
    let outbound;
    global.fetch = async (url, options) => {
        outbound = { url, options, body: JSON.parse(options.body) };
        return {
            ok: true,
            status: 200,
            async json() {
                return { id: 'email_test' };
            }
        };
    };

    try {
        const { response } = await invoke({
            body: validBody({ message: '<script>alert(1)</script>' }),
            env: {
                RESEND_API_KEY: 're_test_key',
                CONTACT_TO_EMAIL: 'private-inbox@example.com',
                CONTACT_FROM_EMAIL: 'STRATEGY 웹사이트 <website@strat.kr>'
            }
        });

        assert.equal(response.status, 200);
        assert.equal(outbound.url, 'https://api.resend.com/emails');
        assert.deepEqual(outbound.body.to, ['private-inbox@example.com']);
        assert.equal(outbound.body.reply_to, 'visitor@example.com');
        assert.match(outbound.body.html, /&lt;script&gt;/);
        assert.doesNotMatch(outbound.body.html, /<script>/);
    } finally {
        global.fetch = previousFetch;
    }
});

test('메일 제공자 연결 오류는 502를 반환한다', async () => {
    const previousFetch = global.fetch;
    global.fetch = async () => {
        throw new Error('network unavailable');
    };

    try {
        const { response } = await invoke({
            env: {
                RESEND_API_KEY: 're_test_key',
                CONTACT_TO_EMAIL: 'private-inbox@example.com',
                CONTACT_FROM_EMAIL: 'STRATEGY 웹사이트 <website@strat.kr>'
            }
        });
        assert.equal(response.status, 502);
    } finally {
        global.fetch = previousFetch;
    }
});
