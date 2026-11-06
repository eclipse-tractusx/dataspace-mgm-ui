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
import { C1M2ProblemException } from '../c1-m2-problem.exception';
import { InMemoryAgreementRepository } from './in-memory-agreement.repository';
import { InMemoryReferenceDataRepository } from './in-memory-reference-data.repository';

describe('InMemoryReferenceDataRepository', () => {
  it('lists the countries by code in the language asked for', async () => {
    const repository = new InMemoryReferenceDataRepository();
    expect(await repository.listCountries('de')).toEqual([
      { code: 'DE', name: 'Deutschland' },
      { code: 'US', name: 'Vereinigte Staaten' },
    ]);
    expect(repository.calls).toEqual(['listCountries']);
  });

  it('lists the identifier types of a country with its pattern, else Worldwide; null for an unknown country', async () => {
    const repository = new InMemoryReferenceDataRepository();
    const de = await repository.listIdentifierTypes('DE', 'en');
    expect(de?.map((type) => type.type)).toEqual(['EUID', 'EBWOID', 'COMMERCIAL_REG_NUMBER', 'VAT_ID', 'LEI_CODE', 'EORI']);
    expect(de?.find((type) => type.type === 'VAT_ID')).toEqual({ type: 'VAT_ID', name: 'VAT ID', pattern: '^DE\\d{9}$' });
    expect(await repository.listIdentifierTypes('US', 'de')).toEqual([{ type: 'EORI', name: 'EORI-Nummer', pattern: '^[A-Z]{2}[A-Za-z0-9]{1,15}$' }]);
    expect(await repository.listIdentifierTypes('FR', 'en')).toBeNull();
  });

  it('lists the selectable company roles with the keys of their active terms', async () => {
    const roles = await new InMemoryReferenceDataRepository().listCompanyRoles('en');
    expect(roles).toEqual([
      { role: 'ACTIVE_PARTICIPANT', name: 'Participant', description: 'Data provider, data consumer, app user', agreementKeys: ['terms-active-participant', 'security-regulations'] },
      { role: 'APP_PROVIDER', name: 'App provider', description: 'offers apps in the marketplace', agreementKeys: ['terms-app-provider'] },
      { role: 'SERVICE_PROVIDER', name: 'Service provider', description: 'offers services in the marketplace', agreementKeys: ['terms-service-provider'] },
    ]);
  });

  it('case 25: the required terms of ACTIVE_PARTICIPANT with party and documents; scope ALL only without roles', async () => {
    const repository = new InMemoryReferenceDataRepository();
    const agreements = await repository.listAgreements(['ACTIVE_PARTICIPANT'], 'de');
    expect(agreements.map((agreement) => [agreement.agreementKey, agreement.version, agreement.party])).toEqual([
      ['osp-terms', '1.0', 'OSP'],
      ['terms-active-participant', '1.0', 'DATASPACE'],
      ['security-regulations', '1.0', 'DATASPACE'],
    ]);
    expect(agreements[0]).toEqual({
      agreementKey: 'osp-terms',
      version: '1.0',
      party: 'OSP',
      title: 'Nutzungsbedingungen des OSP',
      documentUrls: { de: 'https://osp-a.example.org/terms/osp-terms-1.0-de.pdf', en: 'https://osp-a.example.org/terms/osp-terms-1.0-en.pdf' },
      scope: 'ALL',
    });
    expect(agreements[2]).toMatchObject({ documentUrls: { en: 'https://dataspace.example.org/terms/security-1.0-en.pdf' }, companyRoles: ['ACTIVE_PARTICIPANT'] });
    expect((await repository.listAgreements([], 'en')).map((agreement) => agreement.agreementKey)).toEqual(['osp-terms']);
  });

  it('case 25: refuses an unknown or not selectable role', async () => {
    const repository = new InMemoryReferenceDataRepository();
    await expect(repository.listAgreements(['NOPE'], 'en')).rejects.toMatchObject({
      problem: { status: 400, type: 'urn:c1-m2:problem:validation', errors: [{ field: 'companyRole', message: 'Company role NOPE is unknown or not selectable.' }] },
    });
    await expect(repository.listAgreements(['ONBOARDING_SERVICE_PROVIDER'], 'en')).rejects.toBeInstanceOf(C1M2ProblemException);
  });

  it('follows a new version of shared terms and fails with the injected failure', async () => {
    const agreements = new InMemoryAgreementRepository();
    const repository = new InMemoryReferenceDataRepository({ agreements });
    await agreements.createVersion({
      agreementKey: 'terms-app-provider',
      version: '2.0',
      party: 'DATASPACE',
      scope: 'COMPANY_ROLE',
      companyRoles: ['APP_PROVIDER', 'SERVICE_PROVIDER'],
      title: { de: 'Anbieter', en: 'Provider' },
      documentUrls: { en: 'https://dataspace.example.org/terms/provider-2.0-en.pdf' },
      reconsentRequired: false,
    });
    expect(await repository.listAgreements(['SERVICE_PROVIDER'], 'en')).toMatchObject([{ agreementKey: 'osp-terms' }, { agreementKey: 'terms-service-provider' }, { agreementKey: 'terms-app-provider', version: '2.0' }]);
    expect((await repository.listCompanyRoles('en'))[2].agreementKeys).toEqual(['terms-service-provider', 'terms-app-provider']);

    const failure = new Error('down');
    await expect(new InMemoryReferenceDataRepository({ failure }).listCountries('en')).rejects.toBe(failure);
  });
});
