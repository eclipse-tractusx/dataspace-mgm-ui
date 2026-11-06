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
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import { beforeEach, describe, expect, it } from 'vitest';
import {
  buildBackendLoginUrl,
  createMockCoreModules,
  getLoginMode,
  isSpecLoginResponseEnabled,
  MOCK_PERSON_KEY,
  setLoginMode,
  setSpecLoginResponseEnabled,
  SPEC_ME_RESPONSES,
} from './mock-container';
import { safeMockReturnTo } from './mock-eudi-sign-in';

describe('EUDI sign-in and login mode toggles', () => {
  beforeEach(() => window.sessionStorage.clear());

  it('only returns to a local path', () => {
    expect(safeMockReturnTo('/participants?tab=1')).toBe('/participants?tab=1');
    expect(safeMockReturnTo('//example.com')).toBe('/');
    expect(safeMockReturnTo('/\\example.com')).toBe('/');
    expect(safeMockReturnTo('https://example.com')).toBe('/');
  });

  it('persists sign-out and accepts a selected account on reload', async () => {
    const first = createMockCoreModules('pia');
    expect(await first.identity.getCurrentSession.execute()).toBeTruthy();
    await first.identity.logout.execute();
    expect(window.sessionStorage.getItem(MOCK_PERSON_KEY)).toBe('none');
    expect(await createMockCoreModules('pia').identity.getCurrentSession.execute()).toBeNull();
    window.sessionStorage.setItem(MOCK_PERSON_KEY, 'pia');
    expect(await createMockCoreModules('none').identity.getCurrentSession.execute()).toBeTruthy();
  });

  it('toggles between standard backend login and EUDI login modes and spec-compliant /me responses', () => {
    setLoginMode('normal');
    expect(getLoginMode()).toBe('normal');
    setLoginMode('eudi');
    expect(getLoginMode()).toBe('eudi');
    expect(isSpecLoginResponseEnabled()).toBe(false);
    setSpecLoginResponseEnabled(true);
    expect(isSpecLoginResponseEnabled()).toBe(true);
    expect(buildBackendLoginUrl('/access-control', 'erika')).toBe('/auth/login?person=erika&return_to=%2Faccess-control');
    expect(SPEC_ME_RESPONSES.erika).toMatchObject({
      id: '5a1c0001-0000-4000-8000-000000000001',
      username: 'erika',
      permissions: expect.arrayContaining(['view_company_users', 'manage_company_users']),
    });
  });
});
