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
import { MOCK_PERSONS, createMockCoreModules } from './mock-container';

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

  it('signs in the test persons of Wallets as a service with the permissions of C4-M1', async () => {
    const signIn = async (person: string) => (await createMockCoreModules(person).identity.getCurrentSession.execute())!;
    expect(await signIn('erika')).toMatchObject({ user: { name: 'Erika Mustermann' }, bpn: 'BPNLIUK2REMLK3F4', permissions: ['view_credentials'] });
    expect(await signIn('max')).toMatchObject({ user: { name: 'Max Mustermann' }, companyId: MOCK_PERSONS.erika.companyId, permissions: [] });
    expect(await signIn('otto')).toMatchObject({ user: { name: 'Otto Normalverbraucher' }, companyId: null, permissions: ['manage_credentials'] });
    expect(await signIn('rolf')).toMatchObject({ user: { name: 'Rolf Prüfer' }, companyId: null, permissions: [] });
  });

  it('serves the credentials of C4-M1 from the fixtures of the mockup (proof of concept)', async () => {
    const { c4m1 } = createMockCoreModules('erika');
    const own = await c4m1?.listCompanyCredentials.execute(MOCK_PERSONS.erika.companyId);
    expect(own?.status === 'found' && own.credentials.map((credential) => credential.dataspace.mark)).toEqual(['CX', 'CX', 'SC']);
    const all = await c4m1?.listCredentials.execute({ page: 0, size: 20 });
    expect(all?.status === 'found' && all.page.total).toBe(16);
  });

  it('starts signed out for a person key it does not know', async () => {
    const modules = createMockCoreModules('none');
    expect(await modules.identity.getCurrentSession.execute()).toBeNull();
  });
});
