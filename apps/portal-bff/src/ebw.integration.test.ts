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
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { startFakeEbwConnector, type FakeEbwConnector } from './testing/fake-ebw-connector.ts';
import type { TestBrowser } from './testing/test-browser.ts';
import { createTestWorld, signIn, type TestBff, type TestWorld } from './testing/test-world.ts';

const PROBLEM = 'urn:portal-bff:problem:';
const EBW_CLIENT_ID = 'osp-a-ui';
const SCOPE = 'openid profile representation company attestation';
const problemOf = (body: string) => JSON.parse(body) as { type: string; status: number };

let world: TestWorld;
let connector: FakeEbwConnector;
let app: TestBff;
let plain: TestBff;
let directory: string;

beforeAll(async () => {
  world = await createTestWorld();
  connector = await startFakeEbwConnector(EBW_CLIENT_ID, () => world.clock.now);
  directory = mkdtempSync(join(tmpdir(), 'portal-bff-ebw-'));
  const keyFile = join(directory, 'ebw-client.pem');
  writeFileSync(keyFile, generateKeyPairSync('ec', { namedCurve: 'P-256' }).privateKey.export({ type: 'pkcs8', format: 'pem' }));
  app = await world.start(undefined, { BFF_EBW_ISSUER_URL: connector.issuer, BFF_EBW_CLIENT_ID: EBW_CLIENT_ID, BFF_EBW_KEY_FILE: keyFile });
  plain = await world.start();
  // The connector knows the client by the JWKS the BFF publishes, as an entry with `jwksUri` does.
  connector.clientJwks = JSON.parse((await app.browser().call('/ebw/jwks')).body) as FakeEbwConnector['clientJwks'];
});

afterAll(async () => {
  await world.close();
  await connector.close();
  rmSync(directory, { recursive: true, force: true });
});

beforeEach(() => {
  world.provider.reset();
  connector.reset();
  world.logs.length = 0;
});

/** A signed-in browser and the CSRF token of its session. */
async function signedIn(target: TestBff = app): Promise<{ browser: TestBrowser; csrf: string }> {
  const browser = target.browser();
  await signIn(browser);
  const me = JSON.parse((await browser.call('/me')).body) as { csrf_token: string };
  return { browser, csrf: me.csrf_token };
}

const collect = (browser: TestBrowser, csrf: string) => browser.call('/ebw/attestation', { method: 'POST', headers: { 'x-csrf-token': csrf, origin: app.origin } });

/** The wallet step as a browser does it: start → EBW-Connector → /ebw/callback. Returns the answer of the callback. */
async function walletStep(browser: TestBrowser, returnTo = '/onboarding/start?kind=ONBOARDING') {
  const start = await browser.call(`/ebw/attestation/start?return_to=${encodeURIComponent(returnTo)}`);
  const atConnector = await fetch(start.headers.location as string, { redirect: 'manual' });
  const callbackUrl = new URL(atConnector.headers.get('location') as string);
  const callbackPath = `${callbackUrl.pathname}${callbackUrl.search}`;
  return { start, callbackPath, done: await browser.call(callbackPath) };
}

describe('wallet step at the EBW-Connector', () => {
  it('publishes the public key of the client, and only that', async () => {
    const answer = await app.browser().call('/ebw/jwks');
    expect(answer.status).toBe(200);
    const { keys } = JSON.parse(answer.body) as { keys: Array<Record<string, unknown>> };
    expect(keys).toHaveLength(1);
    expect(keys[0]).toMatchObject({ kty: 'EC', crv: 'P-256', use: 'sig', alg: 'ES256' });
    expect(keys[0]).not.toHaveProperty('d');
  });

  it('runs the step: start → EBW-Connector → callback → the page collects the attestation once', async () => {
    const { browser, csrf } = await signedIn();
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual({ status: 'none' });

    const { start, done } = await walletStep(browser);
    expect(start.status).toBe(302);
    expect(start.headers['cache-control']).toBe('no-store');
    const location = new URL(start.headers.location as string);
    expect(`${location.origin}${location.pathname}`).toBe(`${connector.issuer}/authorize`);
    const query = Object.fromEntries(location.searchParams);
    expect(query).toMatchObject({ response_type: 'code', client_id: EBW_CLIENT_ID, redirect_uri: `${app.origin}/ebw/callback`, scope: SCOPE, code_challenge_method: 'S256' });
    for (const name of ['state', 'nonce', 'code_challenge']) {
      expect(query[name]).toMatch(/^[A-Za-z0-9_-]{43}$/);
    }
    expect(location.href).not.toContain('onboarding');

    expect(done.status).toBe(302);
    expect(done.headers.location).toBe(`${app.origin}/onboarding/start?kind=ONBOARDING&wallet=returned`);
    expect(done.headers['cache-control']).toBe('no-store');
    // The session stays the same: the wallet step sets no cookie.
    expect(done.headers['set-cookie']).toBeUndefined();

    // The code was exchanged with private_key_jwt (the fake connector checked signature, issuer, audience, expiry, jti) and PKCE.
    expect(connector.tokenRequests).toHaveLength(1);
    expect(connector.tokenRequests[0].assertion).toMatchObject({ iss: EBW_CLIENT_ID, sub: EBW_CLIENT_ID, aud: `${connector.issuer}/token` });
    expect(connector.tokenRequests[0].form).toMatchObject({ grant_type: 'authorization_code', redirect_uri: `${app.origin}/ebw/callback` });
    expect(connector.tokenRequests[0].form.code_verifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(connector.tokenRequests[0].form).not.toHaveProperty('client_secret');

    const first = await collect(browser, csrf);
    expect(first.status).toBe(200);
    expect(first.headers['cache-control']).toBe('no-store');
    expect(JSON.parse(first.body)).toEqual({ status: 'received', attestation: connector.attestation });
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual({ status: 'none' });

    // Neither the attestation nor a code, state or key reaches the log.
    const log = world.logs.join('\n');
    expect(log).toContain('"event":"wallet_step","outcome":"received"');
    expect(log).not.toContain(connector.attestation as string);
    expect(log).not.toContain(query.state);
  });

  it('asks for the person and the mandate only when the step is for a mandate, and refuses an unknown purpose', async () => {
    const { browser, csrf } = await signedIn();

    const start = await browser.call('/ebw/attestation/start?purpose=representation&return_to=%2Faccess-control');
    const location = new URL(start.headers.location as string);
    expect(location.searchParams.get('scope')).toBe('openid profile representation attestation');
    const atConnector = await fetch(location, { redirect: 'manual' });
    const callback = new URL(atConnector.headers.get('location') as string);
    const done = await browser.call(`${callback.pathname}${callback.search}`);
    expect(done.headers.location).toBe(`${app.origin}/access-control?wallet=returned`);
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual({ status: 'received', attestation: connector.attestation });

    const explicit = await browser.call('/ebw/attestation/start?purpose=onboarding');
    expect(new URL(explicit.headers.location as string).searchParams.get('scope')).toBe(SCOPE);

    const unknown = await browser.call('/ebw/attestation/start?purpose=anything');
    expect(unknown.status).toBe(400);
    expect(problemOf(unknown.body).type).toBe(`${PROBLEM}bad-request`);
  });

  it('hands the attestation only to the signed-in portal: session, CSRF token and origin', async () => {
    const { browser, csrf } = await signedIn();
    await walletStep(browser);
    const anonymous = await app.browser().call('/ebw/attestation', { method: 'POST', headers: { 'x-csrf-token': csrf } });
    expect(anonymous.status).toBe(401);
    expect(problemOf(anonymous.body).type).toBe(`${PROBLEM}unauthorized`);
    const noToken = await browser.call('/ebw/attestation', { method: 'POST' });
    expect(noToken.status).toBe(403);
    expect(problemOf(noToken.body).type).toBe(`${PROBLEM}csrf`);
    const otherOrigin = await browser.call('/ebw/attestation', { method: 'POST', headers: { 'x-csrf-token': csrf, origin: 'https://evil.example' } });
    expect(otherOrigin.status).toBe(403);
    expect(problemOf(otherOrigin.body).type).toBe(`${PROBLEM}forbidden-origin`);
    const get = await browser.call('/ebw/attestation');
    expect(get.status).toBe(405);
    expect(get.headers.allow).toBe('POST');
    // None of the refused calls consumed it.
    expect(JSON.parse((await collect(browser, csrf)).body)).toMatchObject({ status: 'received' });
  });

  it('sends a person who is not signed in to the sign-in, with the page to come back to', async () => {
    const answer = await app.browser().call('/ebw/attestation/start?return_to=%2Fonboarding%2Fstart%3Fkind%3DONBOARDING');
    expect(answer.status).toBe(302);
    expect(answer.headers.location).toBe(`${app.origin}/auth/login?return_to=${encodeURIComponent('/onboarding/start?kind=ONBOARDING')}`);
    expect(connector.authorizationRequests).toHaveLength(0);
  });

  it.each([
    ['https://evil.example/x', '/?wallet=returned'],
    ['//evil.example', '/?wallet=returned'],
    ['/ebw/attestation/start?return_to=%2F', '/?wallet=returned'],
    ['/auth/logout', '/?wallet=returned'],
    ['/onboarding/application/1/terms#bottom', '/onboarding/application/1/terms?wallet=returned#bottom'],
    ['/onboarding/start?wallet=x&kind=TRANSFER', '/onboarding/start?wallet=returned&kind=TRANSFER'],
  ])('returns only into the portal: return_to %s → %s', async (returnTo, expected) => {
    const { browser } = await signedIn();
    const { done } = await walletStep(browser, returnTo);
    expect(done.headers.location).toBe(`${app.origin}${expected}`);
  });

  it('accepts a callback once, and only in the session that started the step', async () => {
    const erika = await signedIn();
    const other = await signedIn();
    const start = await erika.browser.call('/ebw/attestation/start?return_to=%2Fonboarding%2Fstart');
    const atConnector = await fetch(start.headers.location as string, { redirect: 'manual' });
    const callbackUrl = new URL(atConnector.headers.get('location') as string);
    const callbackPath = `${callbackUrl.pathname}${callbackUrl.search}`;

    // Another session with the callback of Erika: refused, and the state is spent.
    const stolen = await other.browser.call(callbackPath);
    expect(stolen.status).toBe(400);
    expect(stolen.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(stolen.body).toContain('<h1>Wallet step failed</h1>');
    expect(stolen.body).toContain('<a href="/">Back to the portal</a>');
    expect(connector.tokenRequests).toHaveLength(0);
    expect((await erika.browser.call(callbackPath)).status).toBe(400);
    expect(JSON.parse((await collect(other.browser, other.csrf)).body)).toEqual({ status: 'none' });
    expect(JSON.parse((await collect(erika.browser, erika.csrf)).body)).toEqual({ status: 'none' });

    // A callback without a session, an unknown state and a replay are refused the same way.
    const fresh = await walletStep(erika.browser);
    expect(fresh.done.status).toBe(302);
    expect((await erika.browser.call(fresh.callbackPath)).status).toBe(400);
    expect((await app.browser().call('/ebw/callback?code=x&state=unknown')).status).toBe(400);
    expect((await erika.browser.call('/ebw/callback?code=x&state=unknown')).status).toBe(400);
  });

  it.each([
    [{ error: 'access_denied', description: 'WALLET_ERROR' }, { status: 'cancelled' }],
    [{ error: 'access_denied', description: 'STATUS_UNAVAILABLE' }, { status: 'failed', reason: 'STATUS_UNAVAILABLE' }],
    [{ error: 'access_denied', description: 'EXPIRED' }, { status: 'failed', reason: 'EXPIRED' }],
    [{ error: 'access_denied', description: '<script>alert(1)</script>' }, { status: 'failed', reason: 'access_denied' }],
    [{ error: 'invalid_scope', description: 'scope not allowed' }, { status: 'failed', reason: 'invalid_scope' }],
    [{ error: 'Weird Error!', description: '' }, { status: 'failed', reason: 'error' }],
  ])('keeps a failure of the EBW-Connector as the outcome: %j → %j', async (failWith, outcome) => {
    connector.failWith = failWith;
    const { browser, csrf } = await signedIn();
    const { done } = await walletStep(browser);
    expect(done.status).toBe(302);
    expect(done.headers.location).toBe(`${app.origin}/onboarding/start?kind=ONBOARDING&wallet=returned`);
    expect(connector.tokenRequests).toHaveLength(0);
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual(outcome);
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual({ status: 'none' });
  });

  it('reports a token response without an attestation', async () => {
    connector.attestation = null;
    const { browser, csrf } = await signedIn();
    await walletStep(browser);
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual({ status: 'failed', reason: 'no_attestation' });
  });

  it.each([
    ['an ID token for another step (nonce)', (c: FakeEbwConnector) => (c.changeIdToken = (claims) => ({ ...claims, nonce: 'another-step' }))],
    ['an ID token of another issuer', (c: FakeEbwConnector) => (c.changeIdToken = (claims) => ({ ...claims, iss: 'https://evil.example' }))],
    ['an ID token for another client', (c: FakeEbwConnector) => (c.changeIdToken = (claims) => ({ ...claims, aud: 'demo-osp' }))],
    ['an attestation that is no compact JWS', (c: FakeEbwConnector) => (c.attestation = 'not a token')],
    ['an attestation that is too long', (c: FakeEbwConnector) => (c.attestation = `${'a'.repeat(9000)}.${'b'.repeat(9000)}.c`)],
    ['a client key the connector does not know', (c: FakeEbwConnector) => (c.clientJwks = { keys: [] })],
  ])('does not hand out an attestation after %s', async (_name, misbehave) => {
    const registered = connector.clientJwks;
    misbehave(connector);
    const { browser, csrf } = await signedIn();
    const { done } = await walletStep(browser);
    connector.clientJwks = registered;
    expect(done.status).toBe(302);
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual({ status: 'failed', reason: 'connector_answer' });
  });

  it('reports an EBW-Connector that does not answer, and a wrong issuer in the callback', async () => {
    connector.serverError = true;
    const { browser, csrf } = await signedIn();
    await walletStep(browser);
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual({ status: 'failed', reason: 'connector_unavailable' });

    connector.serverError = false;
    const start = await browser.call('/ebw/attestation/start?return_to=%2Fonboarding%2Fstart');
    const callbackUrl = new URL((await fetch(start.headers.location as string, { redirect: 'manual' })).headers.get('location') as string);
    callbackUrl.searchParams.set('iss', 'https://evil.example');
    await browser.call(`${callbackUrl.pathname}${callbackUrl.search}`);
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual({ status: 'failed', reason: 'iss' });
    expect(connector.tokenRequests).toHaveLength(1);
  });

  it('still takes the answer of a step that expired at the EBW-Connector after ten minutes, but not after its own twenty', async () => {
    const { browser, csrf } = await signedIn();
    const callbackOf = async () => {
      const start = await browser.call('/ebw/attestation/start?return_to=%2Fonboarding%2Fstart');
      const url = new URL((await fetch(start.headers.location as string, { redirect: 'manual' })).headers.get('location') as string);
      return `${url.pathname}${url.search}`;
    };
    connector.failWith = { error: 'access_denied', description: 'EXPIRED' };
    const started = world.clock.now;
    const expiredThere = await callbackOf();
    world.clock.now = started + 11 * 60_000;
    const back = await browser.call(expiredThere);
    expect(back.status).toBe(302);
    expect(back.headers.location).toBe(`${app.origin}/onboarding/start?wallet=returned`);
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual({ status: 'failed', reason: 'EXPIRED' });

    const tooLate = await callbackOf();
    world.clock.now += 21 * 60_000;
    // The session is kept alive meanwhile; only the step is too old.
    world.clock.now -= 1;
    const refused = await browser.call(tooLate);
    world.clock.now = started;
    expect(refused.status).toBe(400);
    expect(refused.body).toContain('<h1>Wallet step failed</h1>');
  });

  it('drops an outcome that was not collected when a new step starts', async () => {
    const { browser, csrf } = await signedIn();
    await walletStep(browser);
    await browser.call('/ebw/attestation/start?return_to=%2Fonboarding%2Fstart');
    expect(JSON.parse((await collect(browser, csrf)).body)).toEqual({ status: 'none' });
  });

  it('ends with the session: after the sign-out nothing is left to collect', async () => {
    const { browser, csrf } = await signedIn();
    await walletStep(browser);
    await browser.call('/auth/logout', { method: 'POST', headers: { origin: app.origin } });
    expect((await collect(browser, csrf)).status).toBe(401);
  });
});

describe('wallet step not connected (no BFF_EBW_* settings)', () => {
  it('answers every path of the step with 404, and the rest of the BFF works as before', async () => {
    const { browser, csrf } = await signedIn(plain);
    for (const [path, method] of [
      ['/ebw/attestation/start?return_to=%2F', 'GET'],
      ['/ebw/callback?code=x&state=y', 'GET'],
      ['/ebw/attestation', 'POST'],
      ['/ebw/jwks', 'GET'],
      ['/ebw', 'GET'],
      ['/ebw/anything', 'GET'],
    ]) {
      const answer = await browser.call(path, { method, headers: { 'x-csrf-token': csrf, origin: plain.origin } });
      expect(answer.status, path).toBe(404);
      expect(problemOf(answer.body).type, path).toBe(`${PROBLEM}not-found`);
    }
    expect((await browser.call('/me')).status).toBe(200);
  });
});

describe('start of the BFF with the wallet step', () => {
  it('stops when the key file is unusable', async () => {
    const file = join(directory, 'rsa.pem');
    writeFileSync(file, generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' }));
    await expect(world.start(undefined, { BFF_EBW_ISSUER_URL: connector.issuer, BFF_EBW_CLIENT_ID: EBW_CLIENT_ID, BFF_EBW_KEY_FILE: file })).rejects.toThrow('EC private key on the curve P-256');
    await expect(
      world.start(undefined, { BFF_EBW_ISSUER_URL: connector.issuer, BFF_EBW_CLIENT_ID: EBW_CLIENT_ID, BFF_EBW_KEY_FILE: join(directory, 'missing.pem') }),
    ).rejects.toThrow('BFF_EBW_KEY_FILE cannot be read as a private key');
  });
});
