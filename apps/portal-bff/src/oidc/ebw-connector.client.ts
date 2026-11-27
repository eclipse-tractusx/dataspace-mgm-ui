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

import type { JsonWebKey } from 'node:crypto';
import { BFF } from '../constants/bff.constant.ts';
import type { EbwConnectorClientOptions } from '../data/ebw.data.ts';
import type { LoginTransaction } from '../data/session.data.ts';
import { clientAssertion } from './client-key.ts';
import { validateIdTokenClaims } from './id-token.ts';
import { decodeJwt, isKeyFor, isSupportedAlgorithm, verifyJwtSignature } from './jwt.ts';
import { OidcError } from './oidc.error.ts';
import { codeChallengeOf } from './pkce.ts';

const JWKS_REFETCH_AFTER_MS = 30_000;
const COMPACT_JWS = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';

type Json = Record<string, unknown>;

interface Endpoints {
  authorization: string;
  token: string;
  jwks: string;
}

/**
 * The BFF as a client of the EBW-Connector for the wallet step of the registration (FRAMEWORK 5.2 step 2, C5-M1 6.8):
 * authorization code flow with PKCE S256, `private_key_jwt` at the token endpoint, and the verification attestation
 * (`ebw_attestation`) from the token response. Separate from the client of the identity provider (oidc.client.ts):
 * this one never creates a session. Never follows redirects and never puts a token, code or key into an error.
 */
export class EbwConnectorClient {
  private readonly options: EbwConnectorClientOptions;
  private endpointsRequest: Promise<Endpoints> | null = null;
  private keys: JsonWebKey[] = [];
  private keysFetchedAt = Number.NEGATIVE_INFINITY;

  constructor(options: EbwConnectorClientOptions) {
    this.options = options;
  }

  /** The endpoints of the discovery document, fetched once; a failed fetch is tried again by the next caller. */
  public endpoints(): Promise<Endpoints> {
    this.endpointsRequest ??= this.discover().catch((error: unknown) => {
      this.endpointsRequest = null;
      throw error;
    });
    return this.endpointsRequest;
  }

  /** The URL of the authorization endpoint for this wallet step (code flow, PKCE S256, state, nonce, the scopes of its purpose). */
  public async authorizationUrl(transaction: LoginTransaction): Promise<string> {
    const url = new URL((await this.endpoints()).authorization);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.options.clientId);
    url.searchParams.set('redirect_uri', this.options.redirectUri);
    url.searchParams.set('scope', BFF.EBW_SCOPES[transaction.purpose ?? 'onboarding']);
    url.searchParams.set('state', transaction.state);
    url.searchParams.set('nonce', transaction.nonce);
    url.searchParams.set('code_challenge', codeChallengeOf(transaction.codeVerifier));
    url.searchParams.set('code_challenge_method', 'S256');
    return url.href;
  }

  /** RFC 9207: an `iss` in the authorization response must be this EBW-Connector. */
  public isExpectedIssuer(iss: string | null): boolean {
    return iss === null || iss === this.options.issuer;
  }

  /**
   * Exchanges the code, checks the ID token (signature, issuer, audience, expiry, nonce of this step) and returns the
   * verification attestation of the token response as it came; null when the answer carries none. The backend
   * checks the attestation itself (C1-M2 6.4); here it only has to look like a compact JWS of a sane size.
   */
  public async exchangeCode(code: string, transaction: LoginTransaction): Promise<string | null> {
    const { token } = await this.endpoints();
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.options.redirectUri,
      code_verifier: transaction.codeVerifier,
      client_id: this.options.clientId,
      client_assertion_type: ASSERTION_TYPE,
      client_assertion: clientAssertion(this.options.key, this.options.clientId, token, Math.floor(this.options.now() / 1000)),
    });
    let response: Response;
    try {
      response = await this.options.fetch(token, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
        body: body.toString(),
        redirect: 'error',
        signal: AbortSignal.timeout(BFF.OIDC_TIMEOUT_MS),
      });
    } catch {
      throw new OidcError('unavailable', 'no_answer');
    }
    const payload = (await response.json().catch(() => null)) as Json | null;
    if (!response.ok) {
      const rejected = response.status >= 400 && response.status < 500 && response.status !== 429;
      const code = typeof payload?.error === 'string' && /^[a-z_]{1,40}$/.test(payload.error) ? payload.error : 'error';
      throw rejected ? new OidcError('rejected', code) : new OidcError('unavailable', `http_${response.status}`);
    }
    if (!payload || typeof payload.id_token !== 'string') {
      throw new OidcError('invalid', 'id_token_missing');
    }
    await this.verifyIdToken(payload.id_token, transaction.nonce);
    const attestation = payload.ebw_attestation;
    if (attestation === undefined || attestation === null) {
      return null;
    }
    if (typeof attestation !== 'string' || attestation.length > BFF.MAX_ATTESTATION_CHARS || !COMPACT_JWS.test(attestation)) {
      throw new OidcError('invalid', 'attestation_format');
    }
    return attestation;
  }

  private async verifyIdToken(idToken: string, nonce: string): Promise<void> {
    const jwt = decodeJwt(idToken);
    const { alg, kid } = jwt.header;
    if (!isSupportedAlgorithm(alg)) {
      throw new OidcError('invalid', 'id_token_alg');
    }
    const key = await this.signingKey(alg, typeof kid === 'string' ? kid : null);
    if (!verifyJwtSignature(jwt, key)) {
      throw new OidcError('invalid', 'id_token_signature');
    }
    validateIdTokenClaims(jwt.claims, {
      issuer: this.options.issuer,
      clientId: this.options.clientId,
      nonce,
      nowSeconds: Math.floor(this.options.now() / 1000),
      clockSkewSeconds: BFF.CLOCK_SKEW_SECONDS,
    });
  }

  /** The key of the JWKS for a token. An unknown key id fetches the JWKS again (key rotation), but not on every token. */
  private async signingKey(alg: string, kid: string | null): Promise<JsonWebKey> {
    const find = () => {
      const candidates = this.keys.filter((key) => isKeyFor(alg, key) && (kid === null || key.kid === kid));
      return candidates.length === 1 || (candidates.length > 1 && kid !== null) ? candidates[0] : null;
    };
    let key = find();
    if (!key && this.options.now() - this.keysFetchedAt > JWKS_REFETCH_AFTER_MS) {
      const body = await this.getJson((await this.endpoints()).jwks);
      this.keys = Array.isArray(body.keys) ? (body.keys as JsonWebKey[]).filter((entry) => typeof entry === 'object' && entry !== null) : [];
      this.keysFetchedAt = this.options.now();
      key = find();
    }
    if (!key) {
      throw new OidcError('invalid', 'id_token_key');
    }
    return key;
  }

  private async discover(): Promise<Endpoints> {
    const { issuer } = this.options;
    const body = await this.getJson(`${issuer}/.well-known/openid-configuration`);
    if (body.issuer !== issuer) {
      throw new OidcError('invalid', 'discovery_issuer');
    }
    const endpoint = (name: string): string => {
      const value = body[name];
      const url = typeof value === 'string' && URL.canParse(value) ? new URL(value) : null;
      const allowed = issuer.startsWith('https:') ? ['https:'] : ['https:', 'http:'];
      if (!url || !allowed.includes(url.protocol)) {
        throw new OidcError('invalid', `discovery_${name}`);
      }
      return url.href;
    };
    const list = (name: string): unknown[] | null => (Array.isArray(body[name]) ? (body[name] as unknown[]) : null);
    if (list('code_challenge_methods_supported')?.includes('S256') === false) {
      throw new OidcError('invalid', 'discovery_pkce_s256');
    }
    if (list('token_endpoint_auth_methods_supported')?.includes('private_key_jwt') === false) {
      throw new OidcError('invalid', 'discovery_private_key_jwt');
    }
    return { authorization: endpoint('authorization_endpoint'), token: endpoint('token_endpoint'), jwks: endpoint('jwks_uri') };
  }

  private async getJson(url: string): Promise<Json> {
    let response: Response;
    try {
      response = await this.options.fetch(url, {
        headers: { accept: 'application/json' },
        redirect: 'error',
        signal: AbortSignal.timeout(BFF.OIDC_TIMEOUT_MS),
      });
    } catch {
      throw new OidcError('unavailable', 'no_answer');
    }
    const body = response.ok ? ((await response.json().catch(() => null)) as Json | null) : null;
    if (!body || typeof body !== 'object') {
      await response.body?.cancel().catch(() => undefined);
      throw new OidcError('unavailable', `http_${response.status}`);
    }
    return body;
  }
}
