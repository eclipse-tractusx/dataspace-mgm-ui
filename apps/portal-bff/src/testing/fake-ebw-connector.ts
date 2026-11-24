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

import { createHash, createPublicKey, generateKeyPairSync, randomBytes, verify, type JsonWebKey, type KeyObject } from 'node:crypto';
import { createServer, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { BFF } from '../constants/bff.constant.ts';
import { signJwt } from './sign-jwt.ts';

export interface FakeEbwConnector {
  issuer: string;
  /** The JWKS of the client as registered at the connector; client assertions are checked against it. */
  clientJwks: { keys: JsonWebKey[] };
  /** What the token response carries as `ebw_attestation`; null leaves it out. */
  attestation: string | null;
  /** The step fails at the connector: the authorization response carries this error instead of a code. */
  failWith: { error: string; description: string } | null;
  serverError: boolean;
  changeIdToken: ((claims: Record<string, unknown>) => Record<string, unknown>) | null;
  /** What the connector saw. */
  authorizationRequests: Array<Record<string, string>>;
  tokenRequests: Array<{ form: Record<string, string>; assertion: Record<string, unknown> | null }>;
  /** A verification attestation signed by this connector (its content is not what the BFF looks at). */
  signAttestation(claims: Record<string, unknown>): string;
  reset(): void;
  close(): Promise<void>;
}

const formOf = async (req: IncomingMessage) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  return Object.fromEntries(new URLSearchParams(Buffer.concat(chunks).toString('utf8')));
};

const decode = (segment: string) => JSON.parse(Buffer.from(segment, 'base64url').toString('utf8')) as Record<string, unknown>;

/**
 * An EBW-Connector for the tests, in this process, as far as the BFF uses it (C5-M1 6.8): discovery, authorization
 * endpoint (the wallets answer at once), token endpoint with `private_key_jwt`, PKCE S256 and one-time codes, JWKS.
 * Its ID tokens and attestations are signed with ES256, as the real one does.
 */
export async function startFakeEbwConnector(clientId: string, now: () => number): Promise<FakeEbwConnector> {
  const key = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const codes = new Map<string, { challenge: string; nonce: string; redirectUri: string }>();
  const usedJtis = new Set<string>();

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
  const issuer = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const json = (status: number, payload: unknown) => ({ status, headers: { 'content-type': 'application/json' }, payload });

  /** The claims of a valid client assertion (RFC 7523), or null. */
  const assertionOf = (form: Record<string, string>): Record<string, unknown> | null => {
    if (form.client_assertion_type !== 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer' || !form.client_assertion) {
      return null;
    }
    const [header, claims, signature] = form.client_assertion.split('.');
    const payload = decode(claims);
    const data = Buffer.from(`${header}.${claims}`);
    const signed = connector.clientJwks.keys.some((jwk) => {
      const publicKey: KeyObject = createPublicKey({ key: jwk, format: 'jwk' });
      return verify('sha256', data, { key: publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(signature, 'base64url'));
    });
    const seconds = Math.floor(now() / 1000);
    const fresh = typeof payload.exp === 'number' && payload.exp > seconds && payload.exp <= seconds + 360;
    const once = typeof payload.jti === 'string' && !usedJtis.has(payload.jti);
    if (!signed || decode(header).alg !== 'ES256' || payload.iss !== clientId || payload.sub !== clientId || payload.aud !== `${issuer}/token` || !fresh || !once) {
      return null;
    }
    usedJtis.add(payload.jti as string);
    return payload;
  };

  const handle = async (req: IncomingMessage) => {
    const url = new URL(req.url ?? '/', issuer);
    if (url.pathname === '/.well-known/openid-configuration') {
      return json(200, {
        issuer,
        authorization_endpoint: `${issuer}/authorize`,
        token_endpoint: `${issuer}/token`,
        jwks_uri: `${issuer}/jwks`,
        code_challenge_methods_supported: ['S256'],
        token_endpoint_auth_methods_supported: ['private_key_jwt'],
        id_token_signing_alg_values_supported: ['ES256'],
      });
    }
    if (url.pathname === '/jwks') {
      return json(200, { keys: [{ ...key.publicKey.export({ format: 'jwk' }), kid: 'ebw-1', use: 'sig', alg: 'ES256' }] });
    }
    if (url.pathname === '/authorize') {
      const query = Object.fromEntries(url.searchParams);
      connector.authorizationRequests.push(query);
      const valid =
        query.response_type === 'code' &&
        query.client_id === clientId &&
        (Object.values(BFF.EBW_SCOPES) as string[]).includes(query.scope) &&
        query.code_challenge_method === 'S256' &&
        Boolean(query.code_challenge && query.state && query.nonce && query.redirect_uri);
      if (!valid) {
        return json(400, { error: 'invalid_request' });
      }
      const back = new URL(query.redirect_uri);
      back.searchParams.set('state', query.state);
      back.searchParams.set('iss', issuer);
      if (connector.failWith) {
        back.searchParams.set('error', connector.failWith.error);
        back.searchParams.set('error_description', connector.failWith.description);
      } else {
        const code = randomBytes(16).toString('hex');
        codes.set(code, { challenge: query.code_challenge, nonce: query.nonce, redirectUri: query.redirect_uri });
        back.searchParams.set('code', code);
      }
      return { status: 302, headers: { location: back.href }, payload: undefined };
    }
    if (url.pathname === '/token' && req.method === 'POST') {
      const form = await formOf(req);
      const assertion = assertionOf(form);
      connector.tokenRequests.push({ form, assertion });
      if (connector.serverError) {
        return json(503, { error: 'temporarily_unavailable' });
      }
      if (!assertion) {
        return json(401, { error: 'invalid_client' });
      }
      const pending = codes.get(form.code);
      codes.delete(form.code);
      const challenge = createHash('sha256').update(form.code_verifier ?? '').digest('base64url');
      if (form.grant_type !== 'authorization_code' || !pending || pending.challenge !== challenge || pending.redirectUri !== form.redirect_uri) {
        return json(400, { error: 'invalid_grant' });
      }
      const seconds = Math.floor(now() / 1000);
      const idClaims = { iss: issuer, sub: 'pairwise-subject-of-erika', aud: clientId, iat: seconds, exp: seconds + 300, nonce: pending.nonce, given_name: 'Erika', family_name: 'Mustermann' };
      const idToken = signJwt(connector.changeIdToken ? connector.changeIdToken(idClaims) : idClaims, key.privateKey, { kid: 'ebw-1' });
      return json(200, {
        // Opaque, as at the real connector: the BFF must not expect a JWT here.
        access_token: randomBytes(24).toString('base64url'),
        token_type: 'Bearer',
        expires_in: 300,
        id_token: idToken,
        ...(connector.attestation === null ? {} : { ebw_attestation: connector.attestation }),
      });
    }
    return json(404, { error: 'not_found' });
  };

  const connector: FakeEbwConnector = {
    issuer,
    clientJwks: { keys: [] },
    attestation: null,
    failWith: null,
    serverError: false,
    changeIdToken: null,
    authorizationRequests: [],
    tokenRequests: [],
    signAttestation: (claims) => signJwt(claims, key.privateKey, { typ: 'ebw-attestation+jwt', kid: 'ebw-1' }),
    reset() {
      connector.attestation = connector.signAttestation({ iss: issuer, aud: 'portal-registration', client_id: clientId, jti: randomBytes(8).toString('hex') });
      connector.failWith = null;
      connector.serverError = false;
      connector.changeIdToken = null;
      connector.authorizationRequests.length = 0;
      connector.tokenRequests.length = 0;
    },
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
  connector.reset();
  return connector;
}
