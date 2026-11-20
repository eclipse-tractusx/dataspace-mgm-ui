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
import { isApiPath, parseRequestTarget } from './request-target.ts';

describe('request target', () => {
  it('accepts only the origin form', () => {
    expect(parseRequestTarget('/api/x?a=1')?.pathname).toBe('/api/x');
    expect(parseRequestTarget('/api/x?a=1')?.search).toBe('?a=1');
    for (const wrong of [undefined, '', '*', 'http://evil.example/api/x', 'api/x']) {
      expect(parseRequestTarget(wrong)).toBeNull();
    }
  });

  it('resolves dot segments before a route is chosen, also in encoded form', () => {
    expect(parseRequestTarget('/api/../me')?.pathname).toBe('/me');
    expect(parseRequestTarget('/api/%2e%2e/me')?.pathname).toBe('/me');
    expect(parseRequestTarget('/api/%2E%2E/%2e/internal')?.pathname).toBe('/internal');
    expect(parseRequestTarget('/api\\..\\internal')?.pathname).toBe('/internal');
    expect(parseRequestTarget('//evil.example/api/x')?.pathname).toBe('//evil.example/api/x');
  });

  it('forwards only paths that stay under /api/ for every reader', () => {
    for (const path of ['/api/company-profile/companies/1', '/api/x/a%20b', '/api/x/urn%3Asamm%3Aa.b%3A1.0.0%23X', '/api/x/..a', '/api/x%2Fy']) {
      expect(isApiPath(path)).toBe(true);
    }
    for (const path of ['/api', '/apix/y', '/me', '/api/x%2f..%2f..%2finternal', '/api/x%5C..%5Cinternal', '/api/%2e%2e%2finternal', '/api/x/%2e%2E%2Fy', '/api/x%2F.%2Fy']) {
      expect(isApiPath(path)).toBe(false);
    }
  });
});
