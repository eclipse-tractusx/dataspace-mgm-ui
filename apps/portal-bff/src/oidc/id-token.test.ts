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
import { validateIdTokenClaims } from './id-token.ts';

const NOW = 1_800_000_000;
const expected = { issuer: 'https://iam.example.org/realms/r', clientId: 'portal-ui', nonce: 'n-1', nowSeconds: NOW, clockSkewSeconds: 60 };
const valid = { iss: expected.issuer, aud: 'portal-ui', azp: 'portal-ui', exp: NOW + 300, iat: NOW, nonce: 'n-1', sub: 'person-1' };
const check = (change: Record<string, unknown>) => () => validateIdTokenClaims({ ...valid, ...change }, expected);

describe('ID token claims', () => {
  it('accepts a token of this sign-in and returns who signed in', () => {
    expect(check({})()).toEqual({ subject: 'person-1', username: null });
    expect(check({ preferred_username: 'pia', aud: ['portal-ui', 'other'] })()).toEqual({ subject: 'person-1', username: 'pia' });
  });

  it.each([
    ['iss', { iss: 'https://evil.example/realms/r' }],
    ['iss', { iss: undefined }],
    ['aud', { aud: 'other-client' }],
    ['aud', { aud: ['other-client'] }],
    ['aud', { aud: undefined }],
    ['azp', { aud: ['portal-ui', 'other'], azp: undefined }],
    ['azp', { azp: 'other-client' }],
    ['exp', { exp: NOW - 61 }],
    ['exp', { exp: String(NOW + 300) }],
    ['exp', { exp: undefined }],
    ['iat', { iat: NOW + 61 }],
    ['iat', { iat: undefined }],
    ['nbf', { nbf: NOW + 61 }],
    ['nonce', { nonce: 'n-2' }],
    ['nonce', { nonce: undefined }],
    ['sub', { sub: '' }],
    ['sub', { sub: undefined }],
  ])('refuses a wrong %s (%j)', (claim, change) => {
    expect(check(change)).toThrow(`id_token_${claim}`);
  });

  it('allows for a small clock difference, not more', () => {
    expect(check({ exp: NOW - 59 })).not.toThrow();
    expect(check({ iat: NOW + 59 })).not.toThrow();
  });
});
