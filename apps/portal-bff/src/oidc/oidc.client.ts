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
import type { IdTokenIdentity, OidcClientOptions, OidcMetadata, TokenSet } from '../data/oidc.data.ts';
import type { LoginTransaction } from '../data/session.data.ts';
import { validateIdTokenClaims } from './id-token.ts';
import { decodeJwt, isKeyFor, isSupportedAlgorithm, verifyJwtSignature } from './jwt.ts';
import { OidcError } from './oidc.error.ts';
import { codeChallengeOf } from './pkce.ts';

const JWKS_REFETCH_AFTER_MS = 30_000;

type Json = Record<string, unknown>;

function formEncode(value: string): string {
  return new URLSearchParams({ v: value }).toString().slice(2);
}

function providerErrorCode(payload: Json | null): string {
  const code = payload?.error;
  return typeof code === 'string' && /^[a-z_]{1,40}$/.test(code) ? code : 'error';
}

/**
 * The OpenID Connect client of the BFF: discovery, authorization request, code and refresh grant, ID token check and
 * logout. Talks to the provider only at the endpoints of its discovery document, never follows redirects and never
 * puts a token, code or secret into an error.
 */
export class OidcClient {
  private readonly options: OidcClientOptions;
  private metadataRequest: Promise<OidcMetadata> | null = null;
  private keys: JsonWebKey[] = [];
  private keysFetchedAt = Number.NEGATIVE_INFINITY;

  constructor(options: OidcClientOptions) {
    this.options = options;
  }

  /** The discovery document, fetched once; a failed fetch is tried again by the next caller. */
  public metadata(): Promise<OidcMetadata> {
    this.metadataRequest ??= this.discover().catch((error: unknown) => {
      this.metadataRequest = null;
      throw error;
    });
    return this.metadataRequest;
  }

  /** The URL of the authorization endpoint for this sign-in (code flow, PKCE S256, state and nonce). */
  public async authorizationUrl(transaction: LoginTransaction): Promise<string> {
    const url = new URL((await this.metadata()).authorization_endpoint);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.options.clientId);
    url.searchParams.set('redirect_uri', this.options.redirectUri);
    url.searchParams.set('scope', 'openid');
    url.searchParams.set('state', transaction.state);
    url.searchParams.set('nonce', transaction.nonce);
    url.searchParams.set('code_challenge', codeChallengeOf(transaction.codeVerifier));
    url.searchParams.set('code_challenge_method', 'S256');
    if (this.options.idpHint) {
      url.searchParams.set('kc_idp_hint', this.options.idpHint);
    }
    return url.href;
  }

  /** RFC 9207: the `iss` of the authorization response, when the provider sends it, must be this provider. */
  public async isExpectedIssuer(iss: string | null): Promise<boolean> {
    if (iss === null) {
      return !(await this.metadata()).issInResponse;
    }
    return iss === this.options.issuer;
  }

  /** Exchanges the code and checks the ID token (signature, issuer, audience, expiry, nonce). */
  public async exchangeCode(code: string, transaction: LoginTransaction): Promise<{ tokens: TokenSet; identity: IdTokenIdentity }> {
    const tokens = await this.grant({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.options.redirectUri,
      code_verifier: transaction.codeVerifier,
    });
    if (tokens.idToken === null) {
      throw new OidcError('invalid', 'id_token_missing');
    }
    const identity = await this.verifyIdToken(tokens.idToken, transaction.nonce);
    if (typeof tokens.claims.sub === 'string' && tokens.claims.sub !== identity.subject) {
      throw new OidcError('invalid', 'access_token_sub');
    }
    return { tokens, identity };
  }

  public refresh(refreshToken: string): Promise<TokenSet> {
    return this.grant({ grant_type: 'refresh_token', refresh_token: refreshToken });
  }

  /**
   * Ends the session at the provider without a browser redirect, as far as the provider allows it: Keycloak ends the
   * whole session for a POST of the refresh token to its logout endpoint; otherwise the refresh token is revoked
   * (RFC 7009). Returns false when neither worked; the session of the BFF is ended in any case.
   */
  public async endSession(refreshToken: string): Promise<boolean> {
    let metadata: OidcMetadata;
    try {
      metadata = await this.metadata();
    } catch {
      return false;
    }
    if (metadata.end_session_endpoint && (await this.post(metadata, metadata.end_session_endpoint, { refresh_token: refreshToken }))) {
      return true;
    }
    if (metadata.revocation_endpoint) {
      return this.post(metadata, metadata.revocation_endpoint, { token: refreshToken, token_type_hint: 'refresh_token' });
    }
    return false;
  }

  private async verifyIdToken(idToken: string, nonce: string): Promise<IdTokenIdentity> {
    const jwt = decodeJwt(idToken);
    const { alg, kid } = jwt.header;
    if (!isSupportedAlgorithm(alg)) {
      throw new OidcError('invalid', 'id_token_alg');
    }
    const key = await this.signingKey(alg, typeof kid === 'string' ? kid : null);
    if (!verifyJwtSignature(jwt, key)) {
      throw new OidcError('invalid', 'id_token_signature');
    }
    return validateIdTokenClaims(jwt.claims, {
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
      const body = await this.getJson((await this.metadata()).jwks_uri);
      this.keys = Array.isArray(body.keys) ? (body.keys as JsonWebKey[]).filter((entry) => typeof entry === 'object' && entry !== null) : [];
      this.keysFetchedAt = this.options.now();
      key = find();
    }
    if (!key) {
      throw new OidcError('invalid', 'id_token_key');
    }
    return key;
  }

  private async discover(): Promise<OidcMetadata> {
    const { issuer } = this.options;
    const body = await this.getJson(`${issuer}/.well-known/openid-configuration`);
    if (body.issuer !== issuer) {
      throw new OidcError('invalid', 'discovery_issuer');
    }
    const endpoint = (name: string, required: boolean): string | null => {
      const value = body[name];
      if (value === undefined && !required) {
        return null;
      }
      const url = typeof value === 'string' && URL.canParse(value) ? new URL(value) : null;
      const allowed = issuer.startsWith('https:') ? ['https:'] : ['https:', 'http:'];
      if (!url || !allowed.includes(url.protocol)) {
        throw new OidcError('invalid', `discovery_${name}`);
      }
      return url.href;
    };
    const list = (name: string): string[] | null => (Array.isArray(body[name]) ? (body[name] as string[]) : null);
    if (list('code_challenge_methods_supported')?.includes('S256') === false) {
      throw new OidcError('invalid', 'discovery_pkce_s256');
    }
    const authMethods = list('token_endpoint_auth_methods_supported') ?? ['client_secret_basic'];
    return {
      issuer,
      authorization_endpoint: endpoint('authorization_endpoint', true) as string,
      token_endpoint: endpoint('token_endpoint', true) as string,
      jwks_uri: endpoint('jwks_uri', true) as string,
      end_session_endpoint: endpoint('end_session_endpoint', false),
      revocation_endpoint: endpoint('revocation_endpoint', false),
      clientSecretInBody: !authMethods.includes('client_secret_basic') && authMethods.includes('client_secret_post'),
      issInResponse: body.authorization_response_iss_parameter_supported === true,
    };
  }

  private async grant(form: Record<string, string>): Promise<TokenSet> {
    const metadata = await this.metadata();
    const response = await this.send(metadata, metadata.token_endpoint, form);
    const payload = (await response.json().catch(() => null)) as Json | null;
    if (!response.ok) {
      const rejected = response.status >= 400 && response.status < 500 && response.status !== 429;
      throw rejected ? new OidcError('rejected', providerErrorCode(payload)) : new OidcError('unavailable', `http_${response.status}`);
    }
    if (!payload || typeof payload.access_token !== 'string' || String(payload.token_type).toLowerCase() !== 'bearer') {
      throw new OidcError('invalid', 'token_response');
    }
    const claims = decodeJwt(payload.access_token).claims;
    const expiresAt =
      typeof payload.expires_in === 'number' && payload.expires_in > 0
        ? this.options.now() + payload.expires_in * 1000
        : typeof claims.exp === 'number'
          ? claims.exp * 1000
          : null;
    if (expiresAt === null) {
      throw new OidcError('invalid', 'token_response_expiry');
    }
    return {
      accessToken: payload.access_token,
      claims,
      accessTokenExpiresAt: expiresAt,
      refreshToken: typeof payload.refresh_token === 'string' && payload.refresh_token ? payload.refresh_token : null,
      idToken: typeof payload.id_token === 'string' ? payload.id_token : null,
    };
  }

  private async post(metadata: OidcMetadata, endpoint: string, form: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.send(metadata, endpoint, form);
      await response.body?.cancel();
      return response.ok;
    } catch {
      return false;
    }
  }

  /** A form POST with the client's authentication: none but `client_id` for a public client. */
  private async send(metadata: OidcMetadata, endpoint: string, form: Record<string, string>): Promise<Response> {
    const { clientId, clientSecret } = this.options;
    const body = new URLSearchParams(form);
    const headers: Record<string, string> = { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' };
    if (clientSecret === null) {
      body.set('client_id', clientId);
    } else if (metadata.clientSecretInBody) {
      body.set('client_id', clientId);
      body.set('client_secret', clientSecret);
    } else {
      headers.authorization = `Basic ${Buffer.from(`${formEncode(clientId)}:${formEncode(clientSecret)}`).toString('base64')}`;
    }
    try {
      return await this.options.fetch(endpoint, {
        method: 'POST',
        headers,
        body: body.toString(),
        redirect: 'error',
        signal: AbortSignal.timeout(BFF.OIDC_TIMEOUT_MS),
      });
    } catch {
      throw new OidcError('unavailable', 'no_answer');
    }
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
