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

/** A signed-in person. Tokens stay here, on the server; the browser only holds the random session id. */
export interface Session {
  /** SHA-256 of the session id: the id itself is never stored. */
  key: string;
  csrfToken: string;
  /** `sub` of the ID token. */
  subject: string;
  /** `preferred_username` of the ID token, if the provider sends one. */
  username: string | null;
  accessToken: string;
  /** Claims of the access token, for GET /me. */
  claims: Record<string, unknown>;
  accessTokenExpiresAt: number;
  refreshToken: string | null;
  createdAt: number;
  lastSeenAt: number;
  /** A running refresh, shared by parallel requests. */
  refreshing: Promise<SessionState> | null;
}

export type SessionState = 'ok' | 'ended' | 'unavailable';

/** What a new session is created from. */
export interface SessionSeed {
  subject: string;
  username: string | null;
  accessToken: string;
  claims: Record<string, unknown>;
  accessTokenExpiresAt: number;
  refreshToken: string | null;
}

export interface SessionStoreOptions {
  idleMs: number;
  maxMs: number;
  maxSessions: number;
  now: () => number;
}

/** A sign-in that has started and waits for the callback. */
export interface LoginTransaction {
  state: string;
  nonce: string;
  codeVerifier: string;
  /** Value of the login cookie: binds the sign-in to the browser that started it. */
  binding: string;
  returnTo: string;
  expiresAt: number;
}

export interface LoginTransactionStoreOptions {
  ttlMs: number;
  maxTransactions: number;
  now: () => number;
}
