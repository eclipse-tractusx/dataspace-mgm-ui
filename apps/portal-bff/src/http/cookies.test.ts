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

import { describe, expect, it } from 'vitest';
import { cookieName, isOpaqueToken, parseCookies, serializeCookie } from './cookies.ts';

describe('cookies', () => {
  it('parses a Cookie header; the first value of a name wins', () => {
    const cookies = parseCookies('a=1; dsm_session=abc=def ;b=; =x; broken; dsm_session=second');
    expect(Object.fromEntries(cookies)).toEqual({ a: '1', dsm_session: 'abc=def', b: '' });
    expect(parseCookies(undefined).size).toBe(0);
  });

  it('accepts only 43 base64url characters as a token of the BFF', () => {
    expect(isOpaqueToken('A'.repeat(43))).toBe(true);
    for (const wrong of [undefined, null, '', 'A'.repeat(42), 'A'.repeat(44), `${'A'.repeat(42)}/`, `${'A'.repeat(42)};`]) {
      expect(isOpaqueToken(wrong)).toBe(false);
    }
  });

  it('writes HttpOnly, SameSite=Lax, Path=/ and no Domain; Secure and __Host- on https only', () => {
    expect(serializeCookie(cookieName('dsm_session', false), 'v', false)).toBe('dsm_session=v; Path=/; HttpOnly; SameSite=Lax');
    expect(serializeCookie(cookieName('dsm_session', true), 'v', true)).toBe('__Host-dsm_session=v; Path=/; HttpOnly; SameSite=Lax; Secure');
    expect(serializeCookie('n', 'v', true, 600)).toBe('n=v; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=600');
    expect(serializeCookie('n', '', false, 0)).toBe('n=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  });
});
