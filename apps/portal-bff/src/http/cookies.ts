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

import { BFF } from '../constants/bff.constant.ts';

const OPAQUE_TOKEN = /^[A-Za-z0-9_-]{43}$/;

/** The cookies of a request. The first value of a name wins; values are taken as they are (no decoding). */
export function parseCookies(header: string | undefined): Map<string, string> {
  const cookies = new Map<string, string>();
  for (const part of (header ?? '').split(';')) {
    const separator = part.indexOf('=');
    if (separator < 1) {
      continue;
    }
    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (name && !cookies.has(name)) {
      cookies.set(name, value);
    }
  }
  return cookies;
}

/** 256 random bits as base64url: the only form a session id, login binding or CSRF token of the BFF has. */
export function isOpaqueToken(value: string | undefined | null): value is string {
  return typeof value === 'string' && OPAQUE_TOKEN.test(value);
}

/** `__Host-` binds the cookie to this host and to https; browsers refuse the prefix without Secure and Path=/. */
export function cookieName(base: string, secure: boolean): string {
  return secure ? `${BFF.HOST_PREFIX}${base}` : base;
}

/**
 * A Set-Cookie value. Always HttpOnly, SameSite=Lax, Path=/ and never with Domain. Without `maxAgeSeconds` the cookie
 * ends with the browser session; 0 deletes it.
 */
export function serializeCookie(name: string, value: string, secure: boolean, maxAgeSeconds?: number): string {
  const parts = [`${name}=${value}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (secure) {
    parts.push('Secure');
  }
  if (maxAgeSeconds !== undefined) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`);
  }
  return parts.join('; ');
}
