/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * AI Disclosure: This file was entirely AI-generated.
 * The AI-generated portions are made available under CC0-1.0 and not subject
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import { generateKeyPairSync } from 'node:crypto';
import { once } from 'node:events';
import { request, type IncomingMessage } from 'node:http';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { call } from './testing/call.ts';
import { CLIENT_ID, INDEX_HTML, SECRET, createTestWorld, signIn, type TestBff, type TestWorld } from './testing/test-world.ts';

const PROBLEM = 'urn:portal-bff:problem:';
const SESSION_COOKIE = /^dsm_session=[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; SameSite=Lax$/;
const problemOf = (body: string) => JSON.parse(body) as { type: string; title: string; status: number; detail: string };

let world: TestWorld;
let app: TestBff;

beforeAll(async () => {
  world = await createTestWorld();
  app = await world.start();
});

afterAll(async () => {
  await world.close();
});

beforeEach(() => {
  world.provider.reset();
  world.backend.requests.length = 0;
});

describe('sign-in', () => {
  it('answers GET /me with 401 Problem Details before the sign-in', async () => {
    const answer = await app.browser().call('/me');
    expect(answer.status).toBe(401);
    expect(answer.headers['content-type']).toBe('application/problem+json');
    expect(answer.headers['cache-control']).toBe('no-store');
    expect(problemOf(answer.body)).toMatchObject({ type: `${PROBLEM}unauthorized`, title: 'unauthorized', status: 401 });
  });

  it('starts the code flow with PKCE S256, state and nonce, and binds it to the browser', async () => {
    const answer = await app.browser().call('/auth/login?return_to=%2Fparticipants');
    expect(answer.status).toBe(302);
    expect(answer.headers['cache-control']).toBe('no-store');
    const location = new URL(answer.headers.location as string);
    expect(`${location.origin}${location.pathname}`).toBe(`${world.provider.issuer}/auth`);
    const query = Object.fromEntries(location.searchParams);
    expect(query).toMatchObject({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: `${app.origin}/auth/callback`,
      scope: 'openid',
      code_challenge_method: 'S256',
    });
    for (const name of ['state', 'nonce', 'code_challenge']) {
      expect(query[name]).toMatch(/^[A-Za-z0-9_-]{43}$/);
    }
    expect(new Set([query.state, query.nonce, query.code_challenge]).size).toBe(3);
    expect(query).not.toHaveProperty('kc_idp_hint');
    expect(location.href).not.toContain('participants');
    expect(answer.headers['set-cookie']).toEqual([expect.stringMatching(/^dsm_login=[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; SameSite=Lax; Max-Age=600$/)]);
  });

  it('signs in: login → provider → callback → session cookie → back to return_to → GET /me', async () => {
    const browser = app.browser();
    const { done } = await signIn(browser, '/participants/1?tab=users');
    expect(done.status).toBe(302);
    expect(done.headers.location).toBe(`${app.origin}/participants/1?tab=users`);
    expect(done.headers['cache-control']).toBe('no-store');
    expect(done.headers['set-cookie']).toEqual([expect.stringMatching(SESSION_COOKIE)]);

    // The code was exchanged with the PKCE verifier (the fake provider checks it against the challenge) as a public client.
    expect(world.provider.tokenRequests).toHaveLength(1);
    expect(world.provider.tokenRequests[0].form).toMatchObject({ grant_type: 'authorization_code', client_id: CLIENT_ID, redirect_uri: `${app.origin}/auth/callback` });
    expect(world.provider.tokenRequests[0].form.code_verifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(world.provider.tokenRequests[0].authorization).toBeUndefined();

    const me = await browser.call('/me');
    expect(me.status).toBe(200);
    expect(me.headers['content-type']).toBe('application/json');
    expect(me.headers['cache-control']).toBe('no-store');
    expect(me.headers['x-content-type-options']).toBe('nosniff');
    const body = JSON.parse(me.body) as Record<string, unknown>;
    expect(body).toEqual({
      id: '5a1c0021-0000-4000-8000-000000000021',
      name: 'Pia Provider',
      username: 'pia',
      company_id: '11111111-1111-4111-8111-111111111111',
      bpn: 'BPNL00000000OSPA',
      permissions: ['view_company', 'edit_company'],
      csrf_token: expect.stringMatching(/^[A-Za-z0-9_-]{43}$/),
    });
    // Nothing of the tokens or the session id reaches the browser through /me.
    for (const secret of [world.provider.accessTokens.at(-1), world.provider.refreshTokens.at(-1), browser.cookies.get('dsm_session')]) {
      expect(me.body).not.toContain(secret);
    }
    expect(body.csrf_token).not.toBe(browser.cookies.get('dsm_session'));
  });

  it('gives every sign-in a new session and ends the one the browser had', async () => {
    const browser = app.browser();
    await signIn(browser);
    const first = browser.cookies.get('dsm_session') as string;
    await signIn(browser);
    const second = browser.cookies.get('dsm_session') as string;
    expect(second).not.toBe(first);
    expect((await call(app.port, '/me', { headers: { cookie: `dsm_session=${first}` } })).status).toBe(401);
    expect((await call(app.port, '/me', { headers: { cookie: `dsm_session=${second}` } })).status).toBe(200);
  });

  it.each([
    'https://evil.example/',
    '//evil.example',
    '/\\evil.example',
    '/\t/evil.example',
    '/.//evil.example',
    'javascript:alert(1)',
    '/auth/login',
  ])('does not leave the app after the sign-in for return_to=%j', async (returnTo) => {
    const { done } = await signIn(app.browser(), returnTo);
    expect(done.status).toBe(302);
    expect(done.headers.location).toBe(`${app.origin}/`);
  });

  it('refuses a callback with a wrong state', async () => {
    const browser = app.browser();
    await browser.call('/auth/login');
    const answer = await browser.call('/auth/callback?code=some-code&state=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    expect(answer.status).toBe(400);
    expect(answer.headers['set-cookie']).toBeUndefined();
    expect(world.provider.tokenRequests).toHaveLength(0);
    expect((await browser.call('/me')).status).toBe(401);
  });

  it('refuses a callback in a browser that did not start the sign-in (login CSRF)', async () => {
    const victim = app.browser();
    const attacker = app.browser();
    const start = await attacker.call('/auth/login');
    const atProvider = await fetch(start.headers.location as string, { redirect: 'manual' });
    const callbackUrl = new URL(atProvider.headers.get('location') as string);

    const answer = await victim.call(`${callbackUrl.pathname}${callbackUrl.search}`);
    expect(answer.status).toBe(400);
    expect(answer.headers['set-cookie']).toBeUndefined();
    expect(world.provider.tokenRequests).toHaveLength(0);
    expect((await victim.call('/me')).status).toBe(401);
  });

  it('refuses a replayed callback', async () => {
    const browser = app.browser();
    const { callbackPath, done } = await signIn(browser);
    expect(done.status).toBe(302);
    const session = browser.cookies.get('dsm_session');

    const replay = await browser.call(callbackPath);
    expect(replay.status).toBe(400);
    expect(replay.headers['set-cookie']).toBeUndefined();
    expect(world.provider.tokenRequests).toHaveLength(1);
    expect(browser.cookies.get('dsm_session')).toBe(session);
  });

  it('shows an error of the provider without reflecting it as markup', async () => {
    const browser = app.browser();
    const state = (await browser.call('/auth/login').then((answer) => new URL(answer.headers.location as string))).searchParams.get('state');
    const attack = encodeURIComponent('<script>alert(1)</script>');
    const answer = await browser.call(`/auth/callback?state=${state}&error=${attack}&error_description=${attack}`);
    expect(answer.status).toBe(400);
    expect(answer.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(answer.headers['content-security-policy']).toContain("default-src 'none'");
    expect(answer.body).not.toContain('<script');
    expect(answer.body).not.toContain('alert(1)');
    expect(answer.headers['set-cookie']).toBeUndefined();

    const next = (await browser.call('/auth/login').then((again) => new URL(again.headers.location as string))).searchParams.get('state');
    const denied = await browser.call(`/auth/callback?state=${next}&error=access_denied&error_description=${attack}`);
    expect(denied.status).toBe(400);
    expect(denied.body).toContain('<code>access_denied</code>');
    expect(denied.body).not.toContain('<script');
  });

  it.each([
    ['another nonce', () => (world.provider.changeIdToken = (claims) => ({ ...claims, nonce: 'another-sign-in' }))],
    ['another issuer', () => (world.provider.changeIdToken = (claims) => ({ ...claims, iss: 'https://evil.example/realms/test' }))],
    ['another audience', () => (world.provider.changeIdToken = (claims) => ({ ...claims, aud: 'another-client', azp: 'another-client' }))],
    ['an expired token', () => (world.provider.changeIdToken = (claims) => ({ ...claims, exp: Math.floor(world.clock.now / 1000) - 600 }))],
    ['another subject than the access token', () => (world.provider.changeIdToken = (claims) => ({ ...claims, sub: 'somebody-else' }))],
    ['a signature of another key', () => (world.provider.signIdTokenWith = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey)],
  ])('does not sign in with an ID token that has %s', async (_name, misbehave) => {
    misbehave();
    const browser = app.browser();
    const { done } = await signIn(browser);
    expect(done.status).toBe(502);
    expect(done.headers['set-cookie']).toBeUndefined();
    expect((await browser.call('/me')).status).toBe(401);
  });

  it('refuses a callback that names another issuer (RFC 9207) or none', async () => {
    for (const change of [(url: URL) => url.searchParams.set('iss', 'https://evil.example'), (url: URL) => url.searchParams.delete('iss')]) {
      const browser = app.browser();
      const start = await browser.call('/auth/login');
      const callbackUrl = new URL((await fetch(start.headers.location as string, { redirect: 'manual' })).headers.get('location') as string);
      change(callbackUrl);
      const answer = await browser.call(`${callbackUrl.pathname}${callbackUrl.search}`);
      expect(answer.status).toBe(400);
      expect(answer.headers['set-cookie']).toBeUndefined();
    }
    expect(world.provider.tokenRequests).toHaveLength(0);
  });

  it('does not accept a tampered or foreign session cookie', async () => {
    const browser = app.browser();
    await signIn(browser);
    const id = browser.cookies.get('dsm_session') as string;
    const tampered = `${id.slice(0, 20)}${id[20] === 'A' ? 'B' : 'A'}${id.slice(21)}`;
    for (const cookie of [tampered, id.slice(0, 42), `${id}A`, 'A'.repeat(43), '', '../../etc/passwd']) {
      const me = await call(app.port, '/me', { headers: { cookie: `dsm_session=${cookie}` } });
      expect(me.status).toBe(401);
      const api = await call(app.port, '/api/company-profile/companies/1', { headers: { cookie: `dsm_session=${cookie}` } });
      expect(api.status).toBe(401);
    }
    expect(world.backend.requests).toHaveLength(0);
    expect((await browser.call('/me')).status).toBe(200);
  });
});

describe('/api/** proxy', () => {
  it('answers 401 without a session and does not call the backend', async () => {
    const answer = await app.browser().call('/api/company-profile/companies/1');
    expect(answer.status).toBe(401);
    expect(problemOf(answer.body).type).toBe(`${PROBLEM}unauthorized`);
    expect(world.backend.requests).toHaveLength(0);
  });

  it('forwards a GET with the access token of the person and without cookie, CSRF token or client Authorization', async () => {
    const browser = app.browser();
    await signIn(browser);
    const csrf = (JSON.parse((await browser.call('/me')).body) as { csrf_token: string }).csrf_token;
    const answer = await browser.call('/api/company-profile/companies/abc?x=1&y=%20z', {
      headers: { authorization: 'Bearer from-the-browser', 'x-csrf-token': csrf, 'x-forwarded-host': 'evil.example', 'x-request-id': 'r-1' },
    });
    expect(answer.status).toBe(200);
    expect(JSON.parse(answer.body)).toEqual({ method: 'GET', url: '/api/company-profile/companies/abc?x=1&y=%20z', body: '' });
    expect(answer.headers['x-content-type-options']).toBe('nosniff');
    expect(answer.headers['cache-control']).toBe('no-store');

    expect(world.backend.requests).toHaveLength(1);
    const { headers } = world.backend.requests[0];
    expect(headers.authorization).toBe(`Bearer ${world.provider.accessTokens.at(-1)}`);
    expect(headers.cookie).toBeUndefined();
    expect(headers['x-csrf-token']).toBeUndefined();
    expect(headers.host).toBe(new URL(world.backend.url).host);
    expect(headers['x-forwarded-host']).toBe(new URL(app.origin).host);
    expect(headers['x-forwarded-proto']).toBe('http');
    expect(headers['x-request-id']).toBe('r-1');
    expect(JSON.stringify(headers)).not.toContain(browser.cookies.get('dsm_session'));
  });

  it('does not pass cookies of the backend on to the browser', async () => {
    const browser = app.browser();
    await signIn(browser);
    const answer = await browser.call('/api/cookie');
    expect(answer.status).toBe(200);
    expect(answer.headers['set-cookie']).toBeUndefined();
    expect(answer.headers['x-backend']).toBe('kept');
    expect((await browser.call('/me')).status).toBe(200);
  });

  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])('refuses %s without the CSRF token of the session, forwards it with the token', async (method) => {
    const browser = app.browser();
    await signIn(browser);
    const csrf = (JSON.parse((await browser.call('/me')).body) as { csrf_token: string }).csrf_token;
    const other = app.browser();
    await signIn(other);
    const otherCsrf = (JSON.parse((await other.call('/me')).body) as { csrf_token: string }).csrf_token;
    const path = '/api/company-profile/companies/abc/addresses';
    const init = { method, body: '{"city":"Stuttgart"}' };
    const json = { 'content-type': 'application/json' };

    for (const headers of [json, { ...json, 'x-csrf-token': 'wrong' }, { ...json, 'x-csrf-token': otherCsrf }]) {
      const refused = await browser.call(path, { ...init, headers });
      expect(refused.status).toBe(403);
      expect(refused.headers['content-type']).toBe('application/problem+json');
      expect(problemOf(refused.body)).toMatchObject({ type: `${PROBLEM}csrf`, status: 403 });
    }
    const foreign = await browser.call(path, { ...init, headers: { ...json, 'x-csrf-token': csrf, origin: 'https://evil.example' } });
    expect(foreign.status).toBe(403);
    expect(problemOf(foreign.body).type).toBe(`${PROBLEM}forbidden-origin`);
    expect(world.backend.requests).toHaveLength(0);

    const accepted = await browser.call(path, { ...init, headers: { ...json, 'x-csrf-token': csrf, origin: app.origin } });
    expect(accepted.status).toBe(method === 'POST' ? 201 : 200);
    expect(world.backend.requests).toHaveLength(1);
    expect(world.backend.requests[0]).toMatchObject({ method, url: path, body: '{"city":"Stuttgart"}' });
    expect(world.backend.requests[0].headers['content-type']).toBe('application/json');
  });

  it('forwards a body sent in chunks', async () => {
    const browser = app.browser();
    await signIn(browser);
    const csrf = (JSON.parse((await browser.call('/me')).body) as { csrf_token: string }).csrf_token;
    const req = request({
      host: '127.0.0.1',
      port: app.port,
      path: '/api/upload',
      method: 'POST',
      agent: false,
      headers: { cookie: `dsm_session=${browser.cookies.get('dsm_session')}`, 'x-csrf-token': csrf, 'transfer-encoding': 'chunked' },
    });
    req.write('part-1,');
    req.end('part-2');
    const [res] = (await once(req, 'response')) as [IncomingMessage];
    res.resume();
    await once(res, 'end');
    expect(res.statusCode).toBe(201);
    expect(world.backend.requests[0].body).toBe('part-1,part-2');
  });

  it('only forwards paths under /api/, also when the path tries to leave it', async () => {
    const browser = app.browser();
    await signIn(browser);
    for (const path of ['/api/../internal/admin', '/api/%2e%2e/internal/admin', '/apix/internal', '/api']) {
      const answer = await browser.call(path);
      expect([200, 404]).toContain(answer.status);
      expect(answer.body).not.toContain('"method"');
    }
    for (const path of ['/api/x%2f..%2f..%2finternal%2fadmin', '/api/x%5C..%5C..%5Cinternal', '/api/%2e%2e%2finternal']) {
      const answer = await browser.call(path);
      expect(answer.status).toBe(400);
      expect(problemOf(answer.body).type).toBe(`${PROBLEM}bad-request`);
    }
    expect((await browser.call('/api/x', { method: 'TRACE' })).status).toBe(405);
    expect(world.backend.requests).toHaveLength(0);
  });

  it('passes Server-Sent Events through unbuffered and ends the stream with the session', async () => {
    const browser = app.browser();
    await signIn(browser);
    const req = request({ host: '127.0.0.1', port: app.port, path: '/api/events', agent: false, headers: { cookie: `dsm_session=${browser.cookies.get('dsm_session')}` } });
    req.end();
    const [res] = (await once(req, 'response')) as [IncomingMessage];
    let received = '';
    res.setEncoding('utf8');
    res.on('data', (chunk: string) => (received += chunk));
    res.on('error', () => undefined);
    expect(res.headers['content-type']).toBe('text/event-stream');

    await vi.waitFor(() => expect(received).toBe('data: first\n\n'));
    world.backend.sendEvent('second');
    await vi.waitFor(() => expect(received).toBe('data: first\n\ndata: second\n\n'));
    // Longer than the silence the BFF accepts from the backend otherwise (300 ms in this test): the stream stays open.
    await new Promise((resolve) => setTimeout(resolve, 450));
    world.backend.sendEvent('third');
    await vi.waitFor(() => expect(received).toContain('data: third'));
    expect(res.complete).toBe(false);

    const closed = new Promise((resolve) => res.on('close', resolve));
    expect((await browser.call('/auth/logout', { method: 'POST' })).status).toBe(204);
    await closed;
    expect(res.complete).toBe(false);
  });

  it('answers 504 when the backend stays silent and 502 when it cannot be reached', async () => {
    const browser = app.browser();
    await signIn(browser);
    const slow = await browser.call('/api/slow');
    expect(slow.status).toBe(504);
    expect(problemOf(slow.body).type).toBe(`${PROBLEM}upstream-timeout`);
    const reset = await browser.call('/api/reset');
    expect(reset.status).toBe(502);
    expect(problemOf(reset.body)).toMatchObject({ type: `${PROBLEM}upstream`, detail: 'The backend cannot be reached.' });
  });
});

describe('token refresh', () => {
  it('refreshes the access token shortly before it expires, once for parallel requests', async () => {
    const browser = app.browser();
    await signIn(browser);
    await browser.call('/api/a');
    const first = world.provider.accessTokens.at(-1);
    expect(world.backend.requests[0].headers.authorization).toBe(`Bearer ${first}`);

    world.clock.now += 200_000;
    await browser.call('/api/b');
    expect(world.backend.requests[1].headers.authorization).toBe(`Bearer ${first}`);
    expect(world.provider.tokenRequests).toHaveLength(1);

    world.clock.now += 75_000; // 275 s of 300 s: inside the 30 s before expiry
    const answers = await Promise.all(Array.from({ length: 5 }, (_, index) => browser.call(`/api/c${index}`)));
    expect(answers.map((answer) => answer.status)).toEqual([200, 200, 200, 200, 200]);
    const refreshes = world.provider.tokenRequests.filter((entry) => entry.form.grant_type === 'refresh_token');
    expect(refreshes).toHaveLength(1);
    expect(refreshes[0].form).toMatchObject({ client_id: CLIENT_ID, refresh_token: world.provider.refreshTokens.at(-2) });
    const second = world.provider.accessTokens.at(-1);
    expect(second).not.toBe(first);
    for (const entry of world.backend.requests.slice(2)) {
      expect(entry.headers.authorization).toBe(`Bearer ${second}`);
    }

    // The rotated refresh token is used for the next refresh.
    world.clock.now += 290_000;
    expect((await browser.call('/me')).status).toBe(200);
    expect(world.provider.tokenRequests.at(-1)?.form.refresh_token).toBe(world.provider.refreshTokens.at(-2));
  });

  it('ends the session and answers 401 when the provider refuses the refresh', async () => {
    const browser = app.browser();
    await signIn(browser);
    const session = browser.cookies.get('dsm_session');
    world.provider.failRefresh = true;
    world.clock.now += 301_000;

    const answer = await browser.call('/api/company-profile/companies/1');
    expect(answer.status).toBe(401);
    expect(problemOf(answer.body).type).toBe(`${PROBLEM}unauthorized`);
    expect(answer.headers['set-cookie']).toEqual(['dsm_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0']);
    expect(world.backend.requests).toHaveLength(0);

    world.provider.failRefresh = false;
    expect((await call(app.port, '/me', { headers: { cookie: `dsm_session=${session}` } })).status).toBe(401);
  });

  it('ends the session when the refreshed token belongs to somebody else', async () => {
    const browser = app.browser();
    await signIn(browser);
    world.provider.person = { ...world.provider.person, sub: 'somebody-else' };
    world.clock.now += 301_000;
    expect((await browser.call('/api/company-profile/companies/1')).status).toBe(401);
    expect(world.backend.requests).toHaveLength(0);
    expect((await browser.call('/me')).status).toBe(401);
  });

  it('keeps the session when the provider is down: the valid token is used, an expired one gives 503', async () => {
    const browser = app.browser();
    await signIn(browser);
    world.provider.serverError = true;

    world.clock.now += 280_000;
    expect((await browser.call('/api/a')).status).toBe(200);

    world.clock.now += 30_000;
    const answer = await browser.call('/api/b');
    expect(answer.status).toBe(503);
    expect(problemOf(answer.body).type).toBe(`${PROBLEM}identity-provider-unavailable`);
    expect(world.backend.requests).toHaveLength(1);

    world.provider.serverError = false;
    expect((await browser.call('/api/c')).status).toBe(200);
    expect(world.backend.requests.at(-1)?.headers.authorization).toBe(`Bearer ${world.provider.accessTokens.at(-1)}`);
  });
});

describe('session lifetime and logout', () => {
  it('ends an idle session and a session at its absolute lifetime', async () => {
    const idle = app.browser();
    await signIn(idle);
    world.clock.now += 1_799_000;
    expect((await idle.call('/me')).status).toBe(200);
    world.clock.now += 1_800_000;
    expect((await idle.call('/me')).status).toBe(401);

    const busy = app.browser();
    await signIn(busy);
    for (let minutes = 0; minutes < 115; minutes += 5) {
      world.clock.now += 5 * 60_000;
      expect((await busy.call('/me')).status).toBe(200);
    }
    world.clock.now += 5 * 60_000;
    expect((await busy.call('/me')).status).toBe(401);
  });

  it('logs out: 204, cookie cleared, session gone, session at the provider ended with the refresh token', async () => {
    const browser = app.browser();
    await signIn(browser);
    const session = browser.cookies.get('dsm_session');

    const answer = await browser.call('/auth/logout', { method: 'POST', headers: { origin: app.origin } });
    expect(answer.status).toBe(204);
    expect(answer.body).toBe('');
    expect(answer.headers['set-cookie']).toEqual(['dsm_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0']);
    expect(world.provider.logoutRequests).toEqual([{ client_id: CLIENT_ID, refresh_token: world.provider.refreshTokens.at(-1) }]);

    expect((await browser.call('/me')).status).toBe(401);
    expect((await call(app.port, '/me', { headers: { cookie: `dsm_session=${session}` } })).status).toBe(401);
    expect((await call(app.port, '/api/x', { headers: { cookie: `dsm_session=${session}` } })).status).toBe(401);
    expect((await browser.call('/auth/logout', { method: 'POST' })).status).toBe(204);
    expect(world.provider.logoutRequests).toHaveLength(1);
  });

  it('does not log out for a request of another origin', async () => {
    const browser = app.browser();
    await signIn(browser);
    const answer = await browser.call('/auth/logout', { method: 'POST', headers: { origin: 'https://evil.example' } });
    expect(answer.status).toBe(403);
    expect((await browser.call('/me')).status).toBe(200);
    expect(world.provider.logoutRequests).toHaveLength(0);
  });

  it('answers 405 for other methods and 404 for unknown paths of the sign-in', async () => {
    expect((await call(app.port, '/auth/logout')).status).toBe(405);
    expect((await call(app.port, '/me', { method: 'POST' })).status).toBe(405);
    expect((await call(app.port, '/auth/login', { method: 'POST' })).status).toBe(405);
    expect((await call(app.port, '/auth/unknown')).status).toBe(404);
  });
});

describe('static files, configuration and health', () => {
  const securityHeaders = { 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'referrer-policy': 'strict-origin-when-cross-origin' };

  it('serves the portal with the security headers of the nginx configuration', async () => {
    const index = await call(app.port, '/');
    expect(index.status).toBe(200);
    expect(index.body).toBe(INDEX_HTML);
    expect(index.headers).toMatchObject({ ...securityHeaders, 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' });

    const asset = await call(app.port, '/assets/app.js');
    expect(asset.status).toBe(200);
    expect(asset.body).toBe('console.log("portal")');
    expect(asset.headers).toMatchObject({ ...securityHeaders, 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'public, max-age=31536000, immutable' });

    const head = await call(app.port, '/', { method: 'HEAD' });
    expect(head.status).toBe(200);
    expect(head.headers['content-length']).toBe(String(INDEX_HTML.length));
    expect(head.body).toBe('');
  });

  it('falls back to index.html for the routes of the app, not for missing assets', async () => {
    for (const path of ['/participants/1', '/onboarding?step=2', '/assets', '/some.unknown.file']) {
      const answer = await call(app.port, path);
      expect(answer.status).toBe(200);
      expect(answer.body).toBe(INDEX_HTML);
      expect(answer.headers['cache-control']).toBe('no-cache');
    }
    expect((await call(app.port, '/assets/missing.js')).status).toBe(404);
    expect((await call(app.port, '/', { method: 'POST' })).status).toBe(405);
  });

  it.each([
    '/../secret.txt',
    '/..%2fsecret.txt',
    '/%2e%2e/secret.txt',
    '/%2e%2e%2fsecret.txt',
    '/assets/../../secret.txt',
    '/assets/..%2f..%2fsecret.txt',
    '/assets/%2e%2e%2f%2e%2e%2fsecret.txt',
    '/..%5csecret.txt',
    '/link.txt',
    '/assets/',
    '/assets/%00',
  ])('does not serve anything outside the static directory or a directory listing for %j', async (path) => {
    const answer = await call(app.port, path);
    expect(answer.body).not.toContain(SECRET);
    expect(answer.body).not.toContain('app.js');
    expect(answer.status === 404 || (answer.status === 200 && answer.body === INDEX_HTML)).toBe(true);
  });

  it('serves /config.json from the configured file, never cached; 404 without one', async () => {
    const answer = await call(app.port, '/config.json');
    expect(answer.status).toBe(200);
    expect(JSON.parse(answer.body)).toEqual({ api_base_url: '/api', environment: 'test' });
    expect(answer.headers).toMatchObject({ ...securityHeaders, 'content-type': 'application/json', 'cache-control': 'no-store' });

    const without = await world.start(() => ({ configFile: null }));
    const missing = await call(without.port, '/config.json');
    expect(missing.status).toBe(404);
    expect(missing.headers['content-type']).toBe('application/problem+json');
  });

  it('answers the health probe', async () => {
    const answer = await call(app.port, '/health');
    expect(answer.status).toBe(200);
    expect(JSON.parse(answer.body)).toEqual({ status: 'ok' });
    expect(answer.headers['cache-control']).toBe('no-store');
  });
});

describe('other settings', () => {
  it('uses Secure cookies with the __Host- prefix when the public URL is https', async () => {
    const secure = await world.start(() => ({ publicOrigin: 'https://portal.example.org', secureCookies: true }));
    const browser = secure.browser();
    const { start, done } = await signIn(browser);
    expect(start.headers['set-cookie']).toEqual([expect.stringMatching(/^__Host-dsm_login=[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; SameSite=Lax; Secure; Max-Age=600$/)]);
    expect(done.status).toBe(302);
    expect(done.headers.location).toBe('https://portal.example.org/');
    expect(done.headers['set-cookie']).toEqual([expect.stringMatching(/^__Host-dsm_session=[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; SameSite=Lax; Secure$/)]);
    expect((await browser.call('/me')).status).toBe(200);
    // The name without the prefix is not a session here.
    expect((await call(secure.port, '/me', { headers: { cookie: `dsm_session=${browser.cookies.get('__Host-dsm_session')}` } })).status).toBe(401);
  });

  it('authenticates a confidential client with its secret and passes the identity provider hint', async () => {
    const confidential = await world.start(undefined, { BFF_CLIENT_SECRET: 'p@ss word+1', BFF_IDP_HINT: 'ebw-connector' });
    const browser = confidential.browser();
    const { start, done } = await signIn(browser);
    expect(new URL(start.headers.location as string).searchParams.get('kc_idp_hint')).toBe('ebw-connector');
    expect(done.status).toBe(302);
    const { form, authorization } = world.provider.tokenRequests[0];
    expect(authorization).toBe(`Basic ${Buffer.from(`${CLIENT_ID}:p%40ss+word%2B1`).toString('base64')}`);
    expect(form).not.toHaveProperty('client_secret');
    expect(form).not.toHaveProperty('client_id');
  });

  it('never writes a token, code, cookie or secret into the log', async () => {
    const browser = app.browser();
    const { callbackUrl } = await signIn(browser);
    const csrf = (JSON.parse((await browser.call('/me')).body) as { csrf_token: string }).csrf_token;
    world.provider.failRefresh = true;
    world.clock.now += 301_000;
    await browser.call('/api/x');
    const log = world.logs.join('\n');
    expect(world.logs.length).toBeGreaterThan(0);
    for (const secret of [
      ...world.provider.accessTokens,
      ...world.provider.refreshTokens,
      callbackUrl.searchParams.get('code'),
      callbackUrl.searchParams.get('state'),
      csrf,
      'p@ss word+1',
    ]) {
      expect(log).not.toContain(secret);
    }
    expect(log).toContain('"event":"login"');
    expect(log).toContain('"event":"session_ended"');
  });
});
