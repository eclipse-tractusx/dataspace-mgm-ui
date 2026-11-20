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

import { createHash, generateKeyPairSync, randomBytes, type KeyObject } from 'node:crypto';
import { createServer, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { signJwt } from './sign-jwt.ts';

export interface FakeOidcProvider {
  issuer: string;
  /** Claims of the person who signs in (in the access token). */
  person: Record<string, unknown>;
  /** What the tests switch on to make the provider misbehave. */
  failRefresh: boolean;
  serverError: boolean;
  changeIdToken: ((claims: Record<string, unknown>) => Record<string, unknown>) | null;
  signIdTokenWith: KeyObject | null;
  /** What the provider saw. */
  tokenRequests: Array<{ form: Record<string, string>; authorization: string | undefined }>;
  logoutRequests: Array<Record<string, string>>;
  accessTokens: string[];
  refreshTokens: string[];
  reset(): void;
  close(): Promise<void>;
}

const body = async (req: IncomingMessage) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  return Object.fromEntries(new URLSearchParams(Buffer.concat(chunks).toString('utf8')));
};

/**
 * An OpenID Provider for the tests, in this process: discovery, authorization endpoint (signs the person in at once),
 * token endpoint with PKCE S256 check, one-time codes and rotating refresh tokens, JWKS, and a Keycloak-style logout.
 */
export async function startFakeOidcProvider(clientId: string, now: () => number): Promise<FakeOidcProvider> {
  const key = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const codes = new Map<string, { challenge: string; nonce: string; redirectUri: string }>();
  const validRefreshTokens = new Set<string>();
  let counter = 0;

  const server: Server = createServer((req, res) => {
    handle(req).then(
      ({ status, headers, payload }) => {
        res.writeHead(status, headers);
        res.end(payload === undefined ? undefined : JSON.stringify(payload));
      },
      () => {
        res.writeHead(500);
        res.end();
      },
    );
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const issuer = `http://127.0.0.1:${(server.address() as AddressInfo).port}/realms/test`;

  const json = (status: number, payload: unknown) => ({ status, headers: { 'content-type': 'application/json' }, payload });

  const issue = (nonce: string | null) => {
    const seconds = Math.floor(now() / 1000);
    counter += 1;
    const base = { iss: issuer, iat: seconds, exp: seconds + 300, sub: provider.person.sub };
    const accessToken = signJwt({ ...base, ...provider.person, aud: 'portal-core', azp: clientId, jti: `at-${counter}` }, key.privateKey, { kid: 'k1' });
    const refreshToken = randomBytes(16).toString('hex');
    validRefreshTokens.add(refreshToken);
    provider.accessTokens.push(accessToken);
    provider.refreshTokens.push(refreshToken);
    const idClaims = { ...base, aud: clientId, azp: clientId, nonce, preferred_username: 'pia' };
    const idToken = signJwt(provider.changeIdToken ? provider.changeIdToken(idClaims) : idClaims, provider.signIdTokenWith ?? key.privateKey, { kid: 'k1' });
    return { access_token: accessToken, token_type: 'Bearer', expires_in: 300, refresh_token: refreshToken, ...(nonce ? { id_token: idToken } : {}) };
  };

  const handle = async (req: IncomingMessage) => {
    const url = new URL(req.url ?? '/', issuer);
    const path = url.pathname.replace('/realms/test', '');
    if (path === '/.well-known/openid-configuration') {
      return json(200, {
        issuer,
        authorization_endpoint: `${issuer}/auth`,
        token_endpoint: `${issuer}/token`,
        jwks_uri: `${issuer}/certs`,
        end_session_endpoint: `${issuer}/logout`,
        revocation_endpoint: `${issuer}/revoke`,
        code_challenge_methods_supported: ['plain', 'S256'],
        token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
        authorization_response_iss_parameter_supported: true,
      });
    }
    if (path === '/certs') {
      return json(200, { keys: [{ ...key.publicKey.export({ format: 'jwk' }), kid: 'k1', use: 'sig', alg: 'RS256' }] });
    }
    if (path === '/auth') {
      const query = url.searchParams;
      const redirectUri = query.get('redirect_uri') ?? '';
      const valid =
        query.get('response_type') === 'code' &&
        query.get('client_id') === clientId &&
        query.get('scope') === 'openid' &&
        query.get('code_challenge_method') === 'S256' &&
        Boolean(query.get('code_challenge') && query.get('state') && query.get('nonce') && redirectUri);
      if (!valid) {
        return json(400, { error: 'invalid_request' });
      }
      const code = randomBytes(16).toString('hex');
      codes.set(code, { challenge: query.get('code_challenge') as string, nonce: query.get('nonce') as string, redirectUri });
      const back = new URL(redirectUri);
      back.searchParams.set('code', code);
      back.searchParams.set('state', query.get('state') as string);
      back.searchParams.set('iss', issuer);
      return { status: 302, headers: { location: back.href }, payload: undefined };
    }
    if (path === '/token' && req.method === 'POST') {
      const form = await body(req);
      provider.tokenRequests.push({ form, authorization: req.headers.authorization });
      if (provider.serverError) {
        return json(503, { error: 'temporarily_unavailable' });
      }
      if (form.grant_type === 'authorization_code') {
        const pending = codes.get(form.code);
        codes.delete(form.code);
        const challenge = createHash('sha256').update(form.code_verifier ?? '').digest('base64url');
        if (!pending || pending.challenge !== challenge || pending.redirectUri !== form.redirect_uri) {
          return json(400, { error: 'invalid_grant' });
        }
        return json(200, issue(pending.nonce));
      }
      if (form.grant_type === 'refresh_token') {
        if (provider.failRefresh || !validRefreshTokens.delete(form.refresh_token)) {
          return json(400, { error: 'invalid_grant', error_description: 'Token is not active' });
        }
        return json(200, issue(null));
      }
      return json(400, { error: 'unsupported_grant_type' });
    }
    if (path === '/logout' && req.method === 'POST') {
      provider.logoutRequests.push(await body(req));
      return { status: 204, headers: {}, payload: undefined };
    }
    return json(404, { error: 'not_found' });
  };

  const provider: FakeOidcProvider = {
    issuer,
    person: {},
    failRefresh: false,
    serverError: false,
    changeIdToken: null,
    signIdTokenWith: null,
    tokenRequests: [],
    logoutRequests: [],
    accessTokens: [],
    refreshTokens: [],
    reset() {
      provider.person = {
        sub: '5a1c0021-0000-4000-8000-000000000021',
        given_name: 'Pia',
        family_name: 'Provider',
        company_id: '11111111-1111-4111-8111-111111111111',
        bpn: 'BPNL00000000OSPA',
        resource_access: { 'portal-core': { roles: ['view_company', 'edit_company'] } },
      };
      provider.failRefresh = false;
      provider.serverError = false;
      provider.changeIdToken = null;
      provider.signIdTokenWith = null;
      provider.tokenRequests.length = 0;
      provider.logoutRequests.length = 0;
    },
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
  provider.reset();
  return provider;
}
