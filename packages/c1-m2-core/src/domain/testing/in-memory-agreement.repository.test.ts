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

import { describe, expect, it } from 'vitest';
import type { AgreementVersionCreateInput } from '../data/agreement-version-create-input.data';
import { OTTO_SESSION, ROLF_SESSION } from './fixtures/sessions.fixture';
import { InMemoryAgreementRepository } from './in-memory-agreement.repository';
import { callerOf } from './mock-caller';

const NOW = new Date('2026-11-06T10:00:00.000Z');
const OSP_TERMS_1_1: AgreementVersionCreateInput = {
  agreementKey: 'osp-terms',
  version: '1.1',
  party: 'OSP',
  scope: 'ALL',
  title: { de: 'Nutzungsbedingungen des OSP', en: 'Terms of use of the OSP' },
  documentUrls: { de: 'https://osp-a.example.org/terms/osp-terms-1.1-de.pdf', en: 'https://osp-a.example.org/terms/osp-terms-1.1-en.pdf' },
  reconsentRequired: true,
  reconsentDueAt: '2027-01-31T00:00:00Z',
};

describe('InMemoryAgreementRepository', () => {
  const otto = () => new InMemoryAgreementRepository({ caller: callerOf(OTTO_SESSION), now: () => NOW });

  it('case 21: a new version becomes active, the previous one inactive', async () => {
    const repository = otto();
    const created = await repository.createVersion(OSP_TERMS_1_1);
    expect(created).toEqual({ ...OSP_TERMS_1_1, status: 'ACTIVE', createdAt: NOW.toISOString(), createdBy: '5a1c0012-0000-4000-8000-000000000012' });
    const page = await repository.listVersions({ agreementKey: 'osp-terms' });
    expect(page.items.map((version) => [version.version, version.status])).toEqual([
      ['1.1', 'ACTIVE'],
      ['1.0', 'INACTIVE'],
    ]);
    expect(repository.activeVersions().map((version) => `${version.agreementKey}@${version.version}`)).toContain('osp-terms@1.1');
    expect(repository.calls).toEqual(['createVersion', 'listVersions']);
  });

  it('case 21: the same version again is a conflict; Rolf has no manage_agreements', async () => {
    const repository = otto();
    await repository.createVersion(OSP_TERMS_1_1);
    await expect(repository.createVersion(OSP_TERMS_1_1)).rejects.toMatchObject({ problem: { status: 409, type: 'urn:c1-m2:problem:conflict' } });
    const rolf = new InMemoryAgreementRepository({ caller: callerOf(ROLF_SESSION) });
    await expect(rolf.listVersions({})).rejects.toMatchObject({ problem: { status: 403, type: 'urn:c1-m2:problem:forbidden' } });
    await expect(rolf.createVersion(OSP_TERMS_1_1)).rejects.toMatchObject({ problem: { status: 403 } });
  });

  it('lists every version by key and newest first, filtered by status and paged', async () => {
    const repository = otto();
    await repository.createVersion(OSP_TERMS_1_1);
    const all = await repository.listVersions({});
    expect(all.total).toBe(6);
    expect(all.items.map((version) => version.agreementKey)).toEqual(['osp-terms', 'osp-terms', 'security-regulations', 'terms-active-participant', 'terms-app-provider', 'terms-service-provider']);
    expect((await repository.listVersions({ status: 'INACTIVE' })).items).toMatchObject([{ agreementKey: 'osp-terms', version: '1.0' }]);
    expect(await repository.listVersions({ page: 2, size: 2 })).toMatchObject({ page: 2, size: 2, total: 6, items: [{ agreementKey: 'terms-app-provider' }, { agreementKey: 'terms-service-provider' }] });
  });

  it.each<[string, Partial<AgreementVersionCreateInput>]>([
    ['agreementKey', { agreementKey: 'OSP Terms' }],
    ['version', { version: '' }],
    ['party', { party: 'CSP' as never }],
    ['scope', { scope: 'SOME' as never }],
    ['companyRoles', { companyRoles: ['ACTIVE_PARTICIPANT'] }],
    ['companyRoles', { scope: 'COMPANY_ROLE' }],
    ['companyRoles', { scope: 'COMPANY_ROLE', companyRoles: ['ONBOARDING_SERVICE_PROVIDER'] }],
    ['title.en', { title: { de: 'Titel', en: '' } }],
    ['documentUrls', { documentUrls: {} }],
    ['documentUrls', { documentUrls: { en: 'http://osp-a.example.org/terms.pdf' } }],
    ['documentUrls', { documentUrls: { en: 'not a url' } }],
    ['reconsentDueAt', { reconsentDueAt: undefined }],
    ['reconsentDueAt', { reconsentDueAt: '2026-01-01T00:00:00Z' }],
  ])('refuses an invalid %s', async (field, change) => {
    await expect(otto().createVersion({ ...OSP_TERMS_1_1, ...change })).rejects.toMatchObject({
      problem: { type: 'urn:c1-m2:problem:validation', errors: [expect.objectContaining({ field })] },
    });
  });

  it('records the creator only with a caller, keeps companyRoles only for COMPANY_ROLE, and fails with the injected failure', async () => {
    const repository = new InMemoryAgreementRepository();
    const created = await repository.createVersion({ ...OSP_TERMS_1_1, agreementKey: 'terms-x', scope: 'COMPANY_ROLE', companyRoles: ['APP_PROVIDER'], reconsentRequired: false, reconsentDueAt: undefined });
    expect(created).toMatchObject({ createdBy: null, companyRoles: ['APP_PROVIDER'], reconsentDueAt: null });
    expect(repository.versions).toHaveLength(6);
    repository.setFailure(new Error('down'));
    await expect(repository.listVersions({})).rejects.toThrow('down');
  });
});
