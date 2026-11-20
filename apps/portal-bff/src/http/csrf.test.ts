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
import { isCsrfValid, isOwnOrigin, safeEqual } from './csrf.ts';

describe('CSRF', () => {
  it('lets read requests pass without a token', () => {
    for (const method of ['GET', 'HEAD', 'OPTIONS']) {
      expect(isCsrfValid(method, undefined, 'token')).toBe(true);
    }
  });

  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])('needs the token of the session for %s', (method) => {
    expect(isCsrfValid(method, 'token', 'token')).toBe(true);
    for (const wrong of [undefined, '', 'Token', 'token ', 'other', ['token', 'token']]) {
      expect(isCsrfValid(method, wrong, 'token')).toBe(false);
    }
  });

  it('compares secrets of any length', () => {
    expect(safeEqual('abc', 'abc')).toBe(true);
    expect(safeEqual('abc', 'abcd')).toBe(false);
    expect(safeEqual('', 'a')).toBe(false);
  });

  it('refuses a write request that names another origin', () => {
    const own = 'https://portal.example.org';
    expect(isOwnOrigin(undefined, own)).toBe(true);
    expect(isOwnOrigin(own, own)).toBe(true);
    for (const other of ['https://evil.example', 'http://portal.example.org', 'https://portal.example.org.evil.example', 'null', [own, own]]) {
      expect(isOwnOrigin(other, own)).toBe(false);
    }
  });
});
