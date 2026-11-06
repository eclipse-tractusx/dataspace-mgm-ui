/********************************************************************************
 * Copyright (c) 2026 Catena-X Automotive Network e.V.
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

import { PIA_SESSION } from '@dataspace-mgm/identity-core/testing';
import { describe, expect, it } from 'vitest';
import { createMockC1M2Module, createMockC1M2Ports } from './create-mock-c1-m2-module';
import { HANS_APPLICATION_DOCUMENTS, MOCK_MODE_APPLICATIONS } from './fixtures/applications.fixture';
import { ERIKA_SESSION, HANS_SESSION, OTTO_SESSION } from './fixtures/sessions.fixture';
import { mockAttestation } from './mock-attestation';

describe('createMockC1M2Module', () => {
  it('wires every use case of C1M2Module on the in-memory adapters, with the mock-mode applications', async () => {
    const module = createMockC1M2Module(HANS_SESSION);
    expect(Object.keys(module)).toHaveLength(20);
    expect(await module.getOwnApplication.execute(HANS_APPLICATION_DOCUMENTS.id)).toEqual({ status: 'found', application: HANS_APPLICATION_DOCUMENTS });
    expect(await module.listCountries.execute()).toMatchObject({ status: 'found' });
  });

  it('shares one list of terms: a version created by the OSP Admin is required for the applicant of the same backend', async () => {
    const ports = createMockC1M2Ports(OTTO_SESSION, { applications: [] });
    await ports.agreements.createVersion({
      agreementKey: 'osp-terms',
      version: '2.0',
      party: 'OSP',
      scope: 'ALL',
      title: { de: 'Neu', en: 'New' },
      documentUrls: { en: 'https://osp-a.example.org/terms/osp-terms-2.0-en.pdf' },
      reconsentRequired: false,
    });
    expect((await ports.referenceData.listAgreements([], 'en'))[0]).toMatchObject({ agreementKey: 'osp-terms', version: '2.0' });
  });

  it('answers 403 for a signed-out person and account-bound for Pia with register_company', async () => {
    expect(await createMockC1M2Module(null).listOwnApplications.execute()).toMatchObject({ status: 'failed', error: { status: 403 } });
    const pia = createMockC1M2Module({ ...PIA_SESSION, permissions: ['register_company'] });
    expect(await pia.createApplication.execute({ kind: 'ONBOARDING', verification: 'EBW', attestation: mockAttestation(), companyRoles: ['ACTIVE_PARTICIPANT'] })).toEqual({
      status: 'account-bound',
    });
  });

  it('takes the options: applications, documentsEnabled, failure', async () => {
    expect(await createMockC1M2Module(ERIKA_SESSION, { applications: [] }).listOwnApplications.execute()).toMatchObject({ status: 'found', page: { total: 0 } });
    expect(MOCK_MODE_APPLICATIONS.some((application) => application.applicant.sub === ERIKA_SESSION.user.id)).toBe(false);
    const disabled = createMockC1M2Module(HANS_SESSION, { applications: [], documentsEnabled: false });
    expect(
      await disabled.createApplication.execute({
        kind: 'ONBOARDING',
        verification: 'DOCUMENTS',
        companyData: { legalName: 'Beispiel Logistik GmbH', address: HANS_APPLICATION_DOCUMENTS.companyData.address, identifiers: [{ type: 'VAT_ID', value: 'DE987654321' }] },
        companyRoles: ['ACTIVE_PARTICIPANT'],
      }),
    ).toEqual({ status: 'documents-disabled' });
    const down = createMockC1M2Module(ERIKA_SESSION, { failure: new Error('down') });
    expect(await down.listCountries.execute()).toEqual({ status: 'failed', error: { status: null, problemType: null, message: 'down' } });
    expect(await down.listAgreementVersions.execute()).toMatchObject({ status: 'failed' });
  });
});
