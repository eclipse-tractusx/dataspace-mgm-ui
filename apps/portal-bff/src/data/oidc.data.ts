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

/** The parts of the OpenID Provider metadata the BFF uses. */
export interface OidcMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  end_session_endpoint: string | null;
  revocation_endpoint: string | null;
  /** True when the provider announces `client_secret_post` but not `client_secret_basic`. */
  clientSecretInBody: boolean;
  /** RFC 9207: the provider adds `iss` to the authorization response. */
  issInResponse: boolean;
}

export interface TokenSet {
  accessToken: string;
  /** Claims of the access token (it must be a JWT: GET /me is built from them). */
  claims: Record<string, unknown>;
  accessTokenExpiresAt: number;
  refreshToken: string | null;
  idToken: string | null;
}

export interface DecodedJwt {
  header: Record<string, unknown>;
  claims: Record<string, unknown>;
  signingInput: string;
  signature: Buffer;
}

export interface IdTokenExpectation {
  issuer: string;
  clientId: string;
  nonce: string;
  nowSeconds: number;
  clockSkewSeconds: number;
}

export interface IdTokenIdentity {
  subject: string;
  username: string | null;
}

export type OidcErrorKind = 'rejected' | 'unavailable' | 'invalid';

export interface OidcClientOptions {
  issuer: string;
  clientId: string;
  clientSecret: string | null;
  redirectUri: string;
  idpHint: string | null;
  now: () => number;
  fetch: typeof fetch;
}
