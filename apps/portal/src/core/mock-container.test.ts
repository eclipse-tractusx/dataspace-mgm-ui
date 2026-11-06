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

import { mockAttestation } from '@dataspace-mgm/c1-m2-core/testing';
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

  it('starts signed out for a person key it does not know', async () => {
    const modules = createMockCoreModules('none');
    expect(await modules.identity.getCurrentSession.execute()).toBeNull();
    expect(await modules.c1m2?.listOwnApplications.execute()).toMatchObject({ status: 'failed', error: { status: 403 } });
  });

  it('lets Erika Mustermann create and submit her application on C1-M2 Registration without HTTP', async () => {
    const modules = createMockCoreModules('erika');
    const session = await modules.identity.getCurrentSession.execute();
    expect(session).toMatchObject({ user: { name: 'Erika Mustermann' }, companyId: null });
    const c1m2 = modules.c1m2;
    if (!c1m2) {
      throw new Error('C1-M2 is wired in mock mode');
    }

    const created = await c1m2.createApplication.execute({
      kind: 'ONBOARDING',
      verification: 'EBW',
      attestation: mockAttestation(),
      companyRoles: ['ACTIVE_PARTICIPANT'],
    });
    expect(created).toMatchObject({ status: 'created', application: { companyData: { legalName: 'Beispiel Maschinenbau GmbH' } } });
    const id = created.status === 'created' ? created.application.id : '';
    expect(await c1m2.getOwnApplication.execute(id)).toMatchObject({ status: 'found', application: { status: 'CREATED', reviewStatus: 'NONE' } });

    const agreements = await c1m2.listAgreements.execute(['ACTIVE_PARTICIPANT'], 'de');
    const consents = agreements.status === 'found' ? agreements.agreements.map(({ agreementKey, version }) => ({ agreementKey, version, language: 'de' as const })) : [];
    expect(consents).toHaveLength(3);
    expect(await c1m2.submitApplication.execute(id, { consents })).toMatchObject({ status: 'submitted' });
    expect(await c1m2.getOwnApplication.execute(id)).toMatchObject({ status: 'found', application: { status: 'SUBMITTED', reviewStatus: 'OPEN' } });
  });

  it('serves the applications of mock mode to the OSP Reviewer', async () => {
    const result = await createMockCoreModules('rolf').c1m2?.listAllApplications.execute();
    expect(result).toMatchObject({ status: 'found', page: { total: 3 } });
  });
});
