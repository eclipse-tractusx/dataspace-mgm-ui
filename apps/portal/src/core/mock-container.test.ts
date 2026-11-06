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
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import { describe, expect, it } from 'vitest';
import { MOCK_MODE } from './mock-mode';
import { createMockCoreModules } from './mock-container';

describe('mock mode', () => {
  it('is off unless VITE_USE_MOCKS is "true"', () => {
    expect(MOCK_MODE).toBe(false);
  });

  it('signs in Pia Provider and serves her company without HTTP', async () => {
    const modules = createMockCoreModules();
    const session = await modules.identity.getCurrentSession.execute();
    expect(session?.user.name).toBe('Pia Provider');

    const result = await modules.c3m1.getOwnCompany.execute(session?.companyId ?? null);
    expect(result).toMatchObject({ status: 'found', company: { name: 'OSP A Beispiel GmbH', bpn: 'BPNL00000000OSPA' } });
  });

  it('serves participant management from the fixtures of the mockup (Otto)', async () => {
    const otto = createMockCoreModules('otto');
    expect(otto.c3m1).toBeDefined();
    expect(await otto.c3m1.listCompanies.execute({ page: 0, size: 20 })).toMatchObject({ status: 'success', data: { total: 5 } });
    expect(await otto.c3m2.getCspRegistration.execute('c0000001-0000-4000-8000-000000000001')).toMatchObject({ status: 'found' });
  });

  it('starts signed out for a person key it does not know', async () => {
    const modules = createMockCoreModules('none');
    expect(await modules.identity.getCurrentSession.execute()).toBeNull();
  });
});
