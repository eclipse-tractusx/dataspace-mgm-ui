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

export const BFF = {
  /** Cookie names; on https they get the `__Host-` prefix (Secure, Path=/, no Domain). */
  SESSION_COOKIE: 'dsm_session',
  LOGIN_COOKIE: 'dsm_login',
  HOST_PREFIX: '__Host-',
  CSRF_HEADER: 'x-csrf-token',
  CALLBACK_PATH: '/auth/callback',
  /** Client whose roles are the permission keys of GET /me (C2-M5 7.5). */
  PERMISSIONS_CLIENT: 'portal-core',
  PROBLEM_PREFIX: 'urn:portal-bff:problem:',
  SAFE_METHODS: ['GET', 'HEAD', 'OPTIONS'],
  API_METHODS: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
  /** A sign-in must be finished within this time. */
  LOGIN_TTL_MS: 10 * 60_000,
  /** The access token is refreshed this long before it expires. */
  REFRESH_SKEW_MS: 30_000,
  /** Accepted clock difference to the identity provider when checking the ID token. */
  CLOCK_SKEW_SECONDS: 60,
  OIDC_TIMEOUT_MS: 10_000,
  /** The backend may be silent this long (not applied to Server-Sent Events once the stream is open). */
  UPSTREAM_TIMEOUT_MS: 60_000,
  MAX_SESSIONS: 50_000,
  MAX_LOGIN_TRANSACTIONS: 10_000,
  SWEEP_INTERVAL_MS: 60_000,
  MAX_RETURN_TO_LENGTH: 2_000,
} as const;
