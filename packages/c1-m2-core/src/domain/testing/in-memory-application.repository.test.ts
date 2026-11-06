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

import { CoreHttpException } from '@dataspace-mgm/core-http';
import { PIA_SESSION } from '@dataspace-mgm/identity-core/testing';
import { describe, expect, it } from 'vitest';
import { C1M2ProblemException } from '../c1-m2-problem.exception';
import type { ApplicationCreateInput } from '../data/application-create-input.data';
import type { C1M2ProblemData } from '../data/c1-m2-problem.data';
import type { ConsentInput } from '../data/submit-input.data';
import {
  ERIKA_APPLICATION_CREATED,
  ERIKA_APPLICATION_SUBMITTED,
  ERIKA_ATTESTATION,
  HANS_APPLICATION_DOCUMENTS,
  MAX_APPLICATION_TRANSFER_RETURN,
  MOCK_PDF_CONTENT,
} from './fixtures/applications.fixture';
import { GIESSEREI_CLAIMS, GIESSEREI_COMPANY, MASCHINENBAU_CLAIMS, OSP_A_EXISTING_COMPANY, WERKZEUGBAU_CLAIMS, WERKZEUGBAU_COMPANY } from './fixtures/companies.fixture';
import { ERIKA_SESSION, HANS_SESSION, MAX_SESSION, OTTO_SESSION, ROLF_SESSION } from './fixtures/sessions.fixture';
import { InMemoryAgreementRepository } from './in-memory-agreement.repository';
import { InMemoryApplicationRepository, type InMemoryApplicationOptions } from './in-memory-application.repository';
import { mockAttestation } from './mock-attestation';
import type { MockAttestationOverrides } from './mock-attestation-claims';
import { callerOf, NO_PERMISSIONS_CALLER } from './mock-caller';

const NOW = new Date('2026-11-06T10:00:00.000Z');
const now = () => NOW;
const DAY = 24 * 60 * 60;
const nowSeconds = Math.floor(NOW.getTime() / 1000);

const ERIKA = callerOf(ERIKA_SESSION);
const MAX = callerOf(MAX_SESSION);
const HANS = callerOf(HANS_SESSION);
const ROLF = callerOf(ROLF_SESSION);
/** README 14.1 "bound account": `company_id` set and `register_company` (PIA_SESSION carries only a subset). */
const BOUND = { ...callerOf(PIA_SESSION), permissions: ['register_company'] };

const CONSENTS: ReadonlyArray<ConsentInput> = [
  { agreementKey: 'osp-terms', version: '1.0', language: 'de' },
  { agreementKey: 'terms-active-participant', version: '1.0', language: 'de' },
  { agreementKey: 'security-regulations', version: '1.0', language: 'en' },
];

const attestation = (overrides: MockAttestationOverrides = {}) => mockAttestation(overrides, NOW);
const maxAttestation = (overrides: MockAttestationOverrides = {}) => attestation({ person: { given_name: 'Max', family_name: 'Mustermann' }, ...overrides });

const ebw = (overrides: Partial<ApplicationCreateInput> = {}): ApplicationCreateInput => ({
  kind: 'ONBOARDING',
  verification: 'EBW',
  attestation: attestation(),
  companyRoles: ['ACTIVE_PARTICIPANT'],
  ...overrides,
});

const LOGISTIK: ApplicationCreateInput = {
  kind: 'ONBOARDING',
  verification: 'DOCUMENTS',
  companyData: {
    legalName: 'Beispiel Logistik GmbH',
    address: { streetName: 'Hafenstraße', streetNumber: '5', postalCode: '68159', city: 'Mannheim', region: 'BW', countryCode: 'DE' },
    identifiers: [
      { type: 'COMMERCIAL_REG_NUMBER', value: 'HRB 200002' },
      { type: 'VAT_ID', value: 'de987654321' },
    ],
  },
  companyRoles: ['ACTIVE_PARTICIPANT'],
};

const PDF = (text = 'content') => new Blob([`%PDF-1.7\n${text}\n%%EOF\n`]);

function setup(options: Partial<InMemoryApplicationOptions> = {}) {
  const agreements = new InMemoryAgreementRepository({ now });
  const repository = new InMemoryApplicationRepository({ caller: ERIKA, agreements, now, ...options });
  return { repository, agreements };
}

/** The Problem Details the fake answered with; fails when the call succeeded or threw something else. */
async function problemOf(call: Promise<unknown>): Promise<C1M2ProblemData> {
  try {
    await call;
  } catch (error) {
    if (error instanceof C1M2ProblemException) {
      return error.problem;
    }
    throw error;
  }
  throw new Error('Expected a Problem Details answer');
}

describe('InMemoryApplicationRepository (test double of C1-M2)', () => {
  describe('create in the verification path EBW', () => {
    it('case 1: takes name, address, EBWOID and EUID from the attestation and assigns the FRAMEWORK 7a companyId', async () => {
      const { repository } = setup();
      const jws = attestation();
      const { application, repeated } = await repository.create(ebw({ attestation: jws }));

      expect(repeated).toBe(false);
      expect(application).toMatchObject({
        status: 'CREATED',
        kind: 'ONBOARDING',
        existingCompany: false,
        verification: 'EBW',
        companyId: 'c0000001-0000-4000-8000-000000000001',
        applicant: { sub: ERIKA.sub, givenName: 'Erika', familyName: 'Mustermann' },
        companyRoles: ['ACTIVE_PARTICIPANT'],
        createdAt: NOW.toISOString(),
        submittedAt: null,
      });
      expect(application.companyData).toEqual({
        legalName: 'Beispiel Maschinenbau GmbH',
        shortName: null,
        address: { streetName: 'Musterstraße', streetNumber: '1', postalCode: '70569', city: 'Stuttgart', region: null, countryCode: 'DE' },
        identifiers: [
          { type: 'EBWOID', value: 'EBWOID-DE-0000000001', source: 'ATTESTATION' },
          { type: 'EUID', value: 'DEXX001T.HRB100001', source: 'ATTESTATION' },
        ],
      });
      expect(application.comparison).toEqual(
        ['EBWOID', 'EUID', 'COUNTRY', 'LEGAL_NAME', 'STREET', 'POSTAL_CODE', 'CITY'].map((field) => ({ field, result: 'FROM_ATTESTATION' })),
      );
      expect(application.attestation).toMatchObject({
        issuer: 'https://ebw-connector.example.org',
        person: { givenName: 'Erika', familyName: 'Mustermann' },
        representation: { confirmed: true, result: 'CONFIRMED', validUntil: '2027-12-31' },
        issuedAt: NOW.toISOString(),
      });
      expect(repository.usedJtis).toContain(application.attestation?.attestationId);
      expect(repository.calls).toEqual(['create']);
      expect((await repository.getOwn(application.id))?.reviewStatus).toBe('NONE');
    });

    it('case 1: keeps the short name and the identifiers of the person; a second Maschinenbau application gets a new companyId', async () => {
      const { repository } = setup();
      const { application } = await repository.create(
        ebw({ companyData: { shortName: 'Beispiel Maschinenbau', identifiers: [{ type: 'VAT_ID', value: ' de123456789 ' }] } }),
      );
      expect(application.companyData.shortName).toBe('Beispiel Maschinenbau');
      expect(application.companyData.identifiers).toContainEqual({ type: 'VAT_ID', value: 'DE123456789', source: 'APPLICANT' });

      const second = await repository.as(MAX).create(ebw({ attestation: maxAttestation() }));
      expect(second.application.companyId).not.toBe('c0000001-0000-4000-8000-000000000001');
      expect(second.application.companyId).toMatch(/^[0-9a-f-]{36}$/);
    });

    it.each([
      ['format', 'nope'],
      ['format', 'a.b.c'],
      ['expired', attestation({ iat: nowSeconds - 40 * DAY, exp: nowSeconds - 3600 })],
      ['version', attestation({ attestation_version: '0.1' })],
      ['purpose', attestation({ purpose: 'delegation' })],
      ['claims', attestation({ company: { legal_name: 'Beispiel Maschinenbau GmbH', country: 'DE' }, sub: 'EBWOID-DE-0000000001' })],
      ['claims', attestation({ sub: 'EBWOID-DE-9999999999' })],
      ['claims', attestation({ company: { ...MASCHINENBAU_CLAIMS, country: 'FR' } })],
      ['claims', attestation({ evidence: undefined })],
      ['client', attestation({ client_id: 'other-client' })],
      ['person', maxAttestation()],
    ])('case 2/3: answers attestation-invalid with reason %s and stores nothing', async (reason, jws) => {
      const { repository } = setup();
      const answer = await problemOf(repository.create(ebw({ attestation: jws })));
      expect(answer).toMatchObject({ status: 400, type: 'urn:c1-m2:problem:attestation-invalid', reason });
      expect(repository.applications).toEqual([]);
      expect(repository.usedJtis).toEqual([]);
    });

    it('case 2: an attestation over 16 KB is a validation error', async () => {
      const { repository } = setup();
      const answer = await problemOf(repository.create(ebw({ attestation: 'a'.repeat(16385) })));
      expect(answer).toMatchObject({ type: 'urn:c1-m2:problem:validation', errors: [{ field: 'attestation' }] });
    });

    it('case 3: compares the names of the person after normalisation', async () => {
      const { repository } = setup();
      const { application } = await repository.create(ebw({ attestation: attestation({ person: { given_name: ' ERIKA ', family_name: 'mustermann' } }) }));
      expect(application.status).toBe('CREATED');
      expect(application.attestation?.person).toEqual({ givenName: ' ERIKA ', familyName: 'mustermann' });
    });

    it('accepts an attestation with representation.confirmed false (C1-M3 assesses it)', async () => {
      const { repository } = setup();
      const { application } = await repository.create(ebw({ attestation: attestation({ representation: { confirmed: false, reasons: ['mandate missing'] } }) }));
      expect(application.attestation?.representation).toEqual({ confirmed: false, reasons: ['mandate missing'] });
    });

    it('case 4: a bound account cannot create, but reads its own applications', async () => {
      const { repository } = setup({ caller: BOUND });
      expect(await problemOf(repository.create(ebw()))).toMatchObject({ status: 403, type: 'urn:c1-m2:problem:account-bound' });
      expect(repository.applications).toEqual([]);
      expect(await repository.listOwn({})).toEqual({ items: [], page: 0, size: 20, total: 0 });
    });

    it('case 5: repetition with the same jti, another attestation while open, and single use after withdrawal', async () => {
      const { repository } = setup();
      const jws = attestation();
      const first = await repository.create(ebw({ attestation: jws }));
      const again = await repository.create(ebw({ attestation: jws }));
      expect(again).toEqual({ application: first.application, repeated: true });
      expect(repository.applications).toHaveLength(1);

      expect(await problemOf(repository.create(ebw()))).toMatchObject({
        status: 409,
        type: 'urn:c1-m2:problem:open-application-exists',
        existingApplicationId: first.application.id,
      });
      expect(await problemOf(repository.create({ ...LOGISTIK }))).toMatchObject({ existingApplicationId: first.application.id });

      await repository.withdraw(first.application.id);
      expect(await problemOf(repository.create(ebw({ attestation: jws })))).toMatchObject({ status: 409, type: 'urn:c1-m2:problem:attestation-used' });
    });

    it('case 6: a differing EUID is a mismatch, a differing legal name is recorded', async () => {
      const { repository } = setup();
      expect(await problemOf(repository.create(ebw({ companyData: { identifiers: [{ type: 'EUID', value: 'DEXX001T.HRB999999' }] } })))).toMatchObject({
        status: 400,
        type: 'urn:c1-m2:problem:attestation-mismatch',
        fields: ['EUID'],
      });
      const address = { streetName: 'Musterstraße', streetNumber: '1', postalCode: null, city: 'Stuttgart', region: null, countryCode: 'US' };
      expect(await problemOf(repository.create(ebw({ companyData: { address, identifiers: [{ type: 'EBWOID', value: 'X' }] } })))).toMatchObject({
        fields: ['EBWOID', 'COUNTRY'],
      });

      const { application } = await repository.create(ebw({ companyData: { legalName: 'Beispiel Maschinenbau AG' } }));
      expect(application.companyData.legalName).toBe('Beispiel Maschinenbau AG');
      expect(application.comparison).toContainEqual({ field: 'LEGAL_NAME', result: 'MISMATCH' });
    });

    it('case 6: compares given fields after NFKC, whitespace and case folding; omitted parts of the address come from the attestation', async () => {
      const { repository } = setup();
      const { application } = await repository.create(
        ebw({
          companyData: {
            legalName: '  beispiel   MASCHINENBAU gmbh ',
            address: { streetName: 'MUSTERSTRASSE', streetNumber: '1', postalCode: null, city: 'Stuttgart-Vaihingen', region: 'BW', countryCode: 'DE' },
            identifiers: [
              { type: 'EBWOID', value: 'EBWOID-DE-0000000001' },
              { type: 'EUID', value: 'dexx001t.hrb100001' },
            ],
          },
        }),
      );
      expect(application.comparison).toEqual([
        { field: 'EBWOID', result: 'MATCH' },
        { field: 'EUID', result: 'MATCH' },
        { field: 'COUNTRY', result: 'MATCH' },
        { field: 'LEGAL_NAME', result: 'MATCH' },
        { field: 'STREET', result: 'MATCH' },
        { field: 'POSTAL_CODE', result: 'FROM_ATTESTATION' },
        { field: 'CITY', result: 'MISMATCH' },
      ]);
      expect(application.companyData.address).toEqual({
        streetName: 'MUSTERSTRASSE',
        streetNumber: '1',
        postalCode: '70569',
        city: 'Stuttgart-Vaihingen',
        region: 'BW',
        countryCode: 'DE',
      });
      expect(application.companyData.identifiers.filter((identifier) => identifier.source === 'APPLICANT')).toEqual([]);
    });

    it('records NOT_IN_ATTESTATION for an EUID or address the attestation lacks, and needs the address then', async () => {
      const { repository } = setup();
      const company = { legal_name: 'Beispiel Maschinenbau GmbH', ebwoid: 'EBWOID-DE-0000000001', country: 'DE' };
      expect(await problemOf(repository.create(ebw({ attestation: attestation({ company }) })))).toMatchObject({
        type: 'urn:c1-m2:problem:validation',
        errors: [{ field: 'companyData.address' }],
      });
      const { application } = await repository.create(
        ebw({
          attestation: attestation({ company }),
          companyData: {
            address: { streetName: 'Musterstraße', streetNumber: '1', postalCode: '70569', city: 'Stuttgart', region: null, countryCode: 'DE' },
            identifiers: [{ type: 'EUID', value: 'DEXX001T.HRB100001' }],
          },
        }),
      );
      expect(application.comparison).toEqual([
        { field: 'EBWOID', result: 'FROM_ATTESTATION' },
        { field: 'EUID', result: 'NOT_IN_ATTESTATION' },
        { field: 'COUNTRY', result: 'MATCH' },
        { field: 'LEGAL_NAME', result: 'FROM_ATTESTATION' },
        { field: 'STREET', result: 'NOT_IN_ATTESTATION' },
        { field: 'POSTAL_CODE', result: 'NOT_IN_ATTESTATION' },
        { field: 'CITY', result: 'NOT_IN_ATTESTATION' },
      ]);
      expect(application.companyData.identifiers).toContainEqual({ type: 'EUID', value: 'DEXX001T.HRB100001', source: 'APPLICANT' });
    });

    it('takes a street without a house number as the street name', async () => {
      const { repository } = setup();
      const company = { ...MASCHINENBAU_CLAIMS, address: { street_address: 'Am Markt', locality: 'Stuttgart', country: 'DE' } };
      const { application } = await repository.create(ebw({ attestation: attestation({ company }) }));
      expect(application.companyData.address).toMatchObject({ streetName: 'Am Markt', streetNumber: null, postalCode: null });
      expect(application.comparison.map((entry) => entry.field)).not.toContain('POSTAL_CODE');
    });

    it('case 7: identifier types of the country and selectable roles only', async () => {
      const { repository } = setup();
      const us = { ...MASCHINENBAU_CLAIMS, country: 'US', address: { ...MASCHINENBAU_CLAIMS.address, country: 'US' } };
      const answer = await problemOf(repository.create(ebw({ attestation: attestation({ company: us }), companyData: { identifiers: [{ type: 'LEI_CODE', value: '5299001234567890ABCD' }] } })));
      expect(answer.type).toBe('urn:c1-m2:problem:validation');
      expect(answer.errors).toContainEqual({ field: 'companyData.identifiers', message: 'Identifier type LEI_CODE is not allowed for US.' });

      expect(await problemOf(repository.create(ebw({ companyRoles: ['ONBOARDING_SERVICE_PROVIDER'] })))).toMatchObject({
        errors: [{ field: 'companyRoles', message: 'Company role ONBOARDING_SERVICE_PROVIDER is unknown or not selectable.' }],
      });
      expect(repository.applications).toEqual([]);
    });

    it('checks the input: attestation, references, roles and identifiers', async () => {
      const { repository } = setup();
      const errorsOf = async (input: ApplicationCreateInput) => (await problemOf(repository.create(input))).errors?.map((error) => error.field);
      expect(await errorsOf(ebw({ attestation: undefined }))).toEqual(['attestation']);
      expect(await errorsOf(ebw({ companyRoles: undefined }))).toEqual(['companyRoles']);
      expect(await errorsOf(ebw({ companyRoles: ['ACTIVE_PARTICIPANT', 'ACTIVE_PARTICIPANT'] }))).toEqual(['companyRoles']);
      expect(await errorsOf(ebw({ kind: 'REACTIVATION', companyRoles: undefined }))).toEqual(['companyId', 'companyRoles']);
      expect(await errorsOf(ebw({ kind: 'TRANSFER', companyId: GIESSEREI_COMPANY.id, bpn: 'bpn' }))).toEqual(['companyId', 'bpn']);
      expect(await errorsOf(ebw({ kind: 'NEW' as never, verification: 'PAPER' as never }))).toEqual(['kind', 'verification']);
      const identifiers = [
        { type: 'VAT_ID' as const, value: 'DE123456789' },
        { type: 'VAT_ID' as const, value: 'DE987654321' },
      ];
      expect(await errorsOf(ebw({ companyData: { identifiers } }))).toEqual(['companyData.identifiers']);
    });

    it('case 8: another person does not see the application (404)', async () => {
      const { repository } = setup();
      const { application } = await repository.create(ebw());
      const max = repository.as(MAX);
      expect(await max.getOwn(application.id)).toBeNull();
      expect(await max.update(application.id, { companyRoles: ['APP_PROVIDER'] })).toBeNull();
      expect(await max.replaceAttestation(application.id, maxAttestation())).toBeNull();
      expect(await max.submit(application.id, { consents: CONSENTS })).toBeNull();
      expect(await max.withdraw(application.id)).toBeNull();
      expect(await max.listOwn({})).toMatchObject({ items: [], total: 0 });
      expect(max.calls).toEqual(['getOwn', 'update', 'replaceAttestation', 'submit', 'withdraw', 'listOwn']);
      expect((await repository.getOwn(application.id))?.status).toBe('CREATED');
    });
  });

  describe('change before submission', () => {
    it('case 9: changes roles in CREATED, refuses after submission', async () => {
      const { repository } = setup({ now: () => new Date(NOW.getTime() + 60_000) });
      const { application } = await repository.create(ebw({ attestation: mockAttestation({}, NOW) }));
      const updated = await repository.update(application.id, { companyRoles: ['ACTIVE_PARTICIPANT', 'APP_PROVIDER'] });
      expect(updated).toMatchObject({ companyRoles: ['ACTIVE_PARTICIPANT', 'APP_PROVIDER'], changedAt: '2026-11-06T10:01:00.000Z' });
      expect(updated?.comparison).toEqual(application.comparison);

      await repository.submit(application.id, { consents: [...CONSENTS, { agreementKey: 'terms-app-provider', version: '1.0', language: 'en' }] });
      expect(await problemOf(repository.update(application.id, { companyRoles: ['ACTIVE_PARTICIPANT'] }))).toMatchObject({
        status: 409,
        type: 'urn:c1-m2:problem:invalid-state',
      });
    });

    it('compares again after a change: given fields are compared, untouched ones stay from the attestation', async () => {
      const { repository } = setup();
      const { application } = await repository.create(ebw());
      const updated = await repository.update(application.id, {
        legalName: 'Beispiel Maschinenbau AG',
        shortName: 'BM',
        identifiers: [
          { type: 'VAT_ID', value: 'DE123456789' },
          { type: 'EBWOID', value: 'EBWOID-DE-0000000001' },
        ],
      });
      expect(updated?.companyData).toMatchObject({ legalName: 'Beispiel Maschinenbau AG', shortName: 'BM' });
      expect(updated?.comparison).toContainEqual({ field: 'LEGAL_NAME', result: 'MISMATCH' });
      expect(updated?.comparison).toContainEqual({ field: 'STREET', result: 'FROM_ATTESTATION' });
      expect(updated?.companyData.identifiers.map((identifier) => `${identifier.type}:${identifier.source}`)).toEqual([
        'EBWOID:ATTESTATION',
        'EUID:ATTESTATION',
        'VAT_ID:APPLICANT',
      ]);

      const cleared = await repository.update(application.id, { shortName: null, identifiers: [] });
      expect(cleared?.companyData.shortName).toBeNull();
      expect(cleared?.companyData.legalName).toBe('Beispiel Maschinenbau AG');
    });

    it('refuses an empty change, a differing EBWOID and an EBWOID without Business Wallet', async () => {
      const { repository } = setup();
      const { application } = await repository.create(ebw());
      expect(await problemOf(repository.update(application.id, {}))).toMatchObject({ type: 'urn:c1-m2:problem:validation', errors: [{ field: 'body' }] });
      expect(await problemOf(repository.update(application.id, { identifiers: [{ type: 'EBWOID', value: 'EBWOID-DE-0000000003' }] }))).toMatchObject({
        type: 'urn:c1-m2:problem:attestation-mismatch',
        fields: ['EBWOID'],
      });

      const hans = setup({ caller: HANS, applications: [HANS_APPLICATION_DOCUMENTS] }).repository;
      expect(await problemOf(hans.update(HANS_APPLICATION_DOCUMENTS.id, { identifiers: [{ type: 'EBWOID', value: 'X' }] }))).toMatchObject({
        type: 'urn:c1-m2:problem:validation',
      });
      const updated = await hans.update(HANS_APPLICATION_DOCUMENTS.id, { legalName: 'Beispiel Logistik SE' });
      expect(updated).toMatchObject({ comparison: [], companyData: { legalName: 'Beispiel Logistik SE' } });
    });

    it('works on a preloaded application: the claims are rebuilt from its data', async () => {
      const { repository } = setup({ applications: [ERIKA_APPLICATION_CREATED] });
      expect(repository.usedJtis).toEqual([ERIKA_APPLICATION_CREATED.attestation?.attestationId]);
      expect(await repository.create(ebw({ attestation: ERIKA_ATTESTATION }))).toMatchObject({ repeated: true, application: { id: ERIKA_APPLICATION_CREATED.id } });

      const updated = await repository.update(ERIKA_APPLICATION_CREATED.id, { legalName: 'Beispiel Maschinenbau GmbH' });
      expect(updated?.comparison).toEqual([
        { field: 'EBWOID', result: 'FROM_ATTESTATION' },
        { field: 'EUID', result: 'FROM_ATTESTATION' },
        { field: 'COUNTRY', result: 'FROM_ATTESTATION' },
        { field: 'LEGAL_NAME', result: 'MATCH' },
        { field: 'STREET', result: 'FROM_ATTESTATION' },
        { field: 'POSTAL_CODE', result: 'FROM_ATTESTATION' },
        { field: 'CITY', result: 'FROM_ATTESTATION' },
      ]);
      expect(updated?.companyData.identifiers).toContainEqual({ type: 'VAT_ID', value: 'DE123456789', source: 'APPLICANT' });
    });

    it('case 11: an attestation older than 30 days blocks the submission until it is replaced; the old jti stays used', async () => {
      const { repository } = setup();
      const old = attestation({ iat: nowSeconds - 31 * DAY, exp: nowSeconds + 29 * DAY });
      const { application } = await repository.create(ebw({ attestation: old }));
      const oldJti = application.attestation?.attestationId as string;

      expect(await problemOf(repository.submit(application.id, { consents: CONSENTS }))).toMatchObject({
        status: 409,
        type: 'urn:c1-m2:problem:attestation-expired',
      });
      const replaced = await repository.replaceAttestation(application.id, attestation());
      expect(replaced?.attestation?.attestationId).not.toBe(oldJti);
      expect(replaced?.attestation?.issuedAt).toBe(NOW.toISOString());
      expect((await repository.submit(application.id, { consents: CONSENTS }))?.status).toBe('SUBMITTED');
      expect(repository.usedJtis).toContain(oldJti);
      expect(await problemOf(repository.replaceAttestation(application.id, attestation()))).toMatchObject({ type: 'urn:c1-m2:problem:invalid-state' });
    });

    it('case 11: replacing with the same jti changes nothing; a used jti is refused; FROM_ATTESTATION fields follow the new attestation', async () => {
      const { repository } = setup();
      const jws = attestation();
      const { application } = await repository.create(ebw({ attestation: jws, companyData: { legalName: 'Beispiel Maschinenbau AG' } }));
      expect(await repository.replaceAttestation(application.id, jws)).toEqual(application);

      const other = await repository.as(MAX).create(ebw({ attestation: maxAttestation({ company: WERKZEUGBAU_CLAIMS }) }));
      const usedJti = other.application.attestation?.attestationId as string;
      expect(await problemOf(repository.replaceAttestation(application.id, attestation({ jti: usedJti })))).toMatchObject({
        type: 'urn:c1-m2:problem:attestation-used',
      });

      const moved = { ...MASCHINENBAU_CLAIMS, legal_name: 'Beispiel Maschinenbau AG', address: { street_address: 'Neue Straße 7', postal_code: '70173', locality: 'Stuttgart', country: 'DE' } };
      const replaced = await repository.replaceAttestation(application.id, attestation({ company: moved }));
      expect(replaced?.companyData.address).toMatchObject({ streetName: 'Neue Straße', streetNumber: '7', postalCode: '70173' });
      expect(replaced?.comparison).toContainEqual({ field: 'LEGAL_NAME', result: 'MATCH' });
    });

    it('case 12: a new attestation must concern the same company; DOCUMENTS has none to replace', async () => {
      const { repository } = setup({ applications: [HANS_APPLICATION_DOCUMENTS] });
      const { application } = await repository.create(ebw());
      expect(await problemOf(repository.replaceAttestation(application.id, attestation({ company: WERKZEUGBAU_CLAIMS })))).toMatchObject({
        status: 400,
        type: 'urn:c1-m2:problem:attestation-mismatch',
        fields: ['EBWOID', 'EUID'],
      });
      expect(await problemOf(repository.replaceAttestation(application.id, attestation({ company: { ...MASCHINENBAU_CLAIMS, country: 'US' } })))).toMatchObject({
        type: 'urn:c1-m2:problem:attestation-mismatch',
        fields: ['COUNTRY'],
      });
      const hans = repository.as(HANS);
      expect(await problemOf(hans.replaceAttestation(HANS_APPLICATION_DOCUMENTS.id, attestation()))).toMatchObject({
        status: 409,
        type: 'urn:c1-m2:problem:invalid-state',
      });
    });
  });

  describe('submit and withdraw', () => {
    it('case 10: needs every required consent in the active version, stores them with givenAt, and repeats without change', async () => {
      const { repository } = setup();
      const { application } = await repository.create(ebw());
      expect(await problemOf(repository.submit(application.id, { consents: CONSENTS.slice(1) }))).toMatchObject({
        status: 400,
        type: 'urn:c1-m2:problem:consents-incomplete',
        missing: [{ agreementKey: 'osp-terms', version: '1.0' }],
      });
      expect(await problemOf(repository.submit(application.id, { consents: [...CONSENTS, { agreementKey: 'terms-app-provider', version: '1.0', language: 'en' }] }))).toMatchObject({
        type: 'urn:c1-m2:problem:validation',
        errors: [{ field: 'consents', message: 'Terms terms-app-provider are unknown or not required.' }],
      });
      expect(await problemOf(repository.submit(application.id, { consents: [{ agreementKey: 'Osp Terms', version: '', language: 'fr' as never }] }))).toMatchObject({
        type: 'urn:c1-m2:problem:validation',
      });
      expect(await problemOf(repository.submit(application.id, { consents: [] }))).toMatchObject({ errors: [{ message: 'At least one consent.' }] });
      expect(await problemOf(repository.submit(application.id, { consents: [CONSENTS[0], CONSENTS[0]] }))).toMatchObject({
        errors: [{ message: 'One consent per terms document.' }],
      });

      const submitted = await repository.submit(application.id, { consents: CONSENTS });
      expect(submitted).toMatchObject({ status: 'SUBMITTED', submittedAt: NOW.toISOString(), representationDeclared: null });
      expect(submitted?.consents).toEqual(CONSENTS.map((consent) => ({ ...consent, givenAt: NOW.toISOString() })));
      expect(repository.requiredAgreementsOf(application.id)).toEqual(CONSENTS.map(({ agreementKey, version }) => ({ agreementKey, version })));
      expect(await repository.submit(application.id, { consents: [] })).toBe(submitted);
      expect((await repository.getOwn(application.id))?.reviewStatus).toBe('OPEN');
    });

    it('case 18: withdraws in CREATED and in SUBMITTED until the decision; repeats without change', async () => {
      const { repository } = setup();
      const { application } = await repository.create(ebw());
      const withdrawn = await repository.withdraw(application.id);
      expect(withdrawn).toMatchObject({ status: 'WITHDRAWN', withdrawnAt: NOW.toISOString() });
      expect((await repository.getOwn(application.id))?.reviewStatus).toBe('NONE');
      expect(await repository.withdraw(application.id)).toBe(withdrawn);
      expect(await problemOf(repository.submit(application.id, { consents: CONSENTS }))).toMatchObject({ type: 'urn:c1-m2:problem:invalid-state' });

      const second = await repository.create(ebw());
      await repository.submit(second.application.id, { consents: CONSENTS });
      expect(await repository.withdraw(second.application.id)).toMatchObject({ status: 'WITHDRAWN' });
      expect((await repository.getOwn(second.application.id))?.reviewStatus).toBe('CLOSED');
    });

    it('case 18: refuses after the decision, fails when C1-M3 is not reachable, changes nothing on failure', async () => {
      const { repository } = setup({ applications: [ERIKA_APPLICATION_SUBMITTED] });
      const id = ERIKA_APPLICATION_SUBMITTED.id;
      repository.setReviewStatus(id, 'APPROVED');
      expect(await problemOf(repository.withdraw(id))).toMatchObject({ status: 409, type: 'urn:c1-m2:problem:already-decided', reviewStatus: 'APPROVED' });

      repository.setReviewStatus(id, 'UNKNOWN');
      expect(await problemOf(repository.withdraw(id))).toMatchObject({ status: 502, type: 'urn:c1-m2:problem:upstream-error' });

      repository.setReviewStatus(id, 'AWAITING_SECOND_APPROVAL');
      repository.setFailure(new CoreHttpException(502, 'urn:c1-m2:problem:upstream-error', 'C1-M3 not reachable'));
      await expect(repository.withdraw(id)).rejects.toThrow('C1-M3 not reachable');
      repository.setFailure(null);
      expect((await repository.getOwn(id))?.status).toBe('SUBMITTED');
      expect(await repository.withdraw(id)).toMatchObject({ status: 'WITHDRAWN' });
    });

    it('case 19: reviewStatus NONE, OPEN and UNKNOWN', async () => {
      const { repository } = setup({ applications: [ERIKA_APPLICATION_CREATED] });
      const id = ERIKA_APPLICATION_CREATED.id;
      expect((await repository.getOwn(id))?.reviewStatus).toBe('NONE');
      await repository.submit(id, { consents: CONSENTS });
      expect((await repository.getOwn(id))?.reviewStatus).toBe('OPEN');
      repository.setReviewStatus(id, 'UNKNOWN');
      expect((await repository.getOwn(id))?.reviewStatus).toBe('UNKNOWN');
      expect(() => repository.setReviewStatus('a0000000-0000-4000-8000-000000000000', 'OPEN')).toThrow(C1M2ProblemException);
    });

    it('cases 22/23: complete and decline (steps of Process Orchestration) as test helpers', async () => {
      const { repository } = setup({ applications: [ERIKA_APPLICATION_SUBMITTED] });
      const id = ERIKA_APPLICATION_SUBMITTED.id;
      repository.complete(id);
      repository.complete(id);
      expect(await repository.getOwn(id)).toMatchObject({ status: 'COMPLETED', completedAt: NOW.toISOString(), reviewStatus: 'APPROVED' });
      expect(await problemOf(repository.withdraw(id))).toMatchObject({ type: 'urn:c1-m2:problem:invalid-state' });
      expect(() => repository.decline(id, 'late')).toThrow(C1M2ProblemException);

      const declined = setup({ applications: [ERIKA_APPLICATION_SUBMITTED] }).repository;
      declined.decline(id, 'The register extract is too old.');
      declined.decline(id, 'Another reason');
      expect(await declined.getOwn(id)).toMatchObject({ status: 'DECLINED', declineReason: 'The register extract is too old.', closedAt: NOW.toISOString() });

      const created = setup({ applications: [ERIKA_APPLICATION_CREATED] }).repository;
      expect(() => created.complete(id)).toThrow(C1M2ProblemException);
      expect(() => created.decline(id, 'x')).toThrow(C1M2ProblemException);
      await created.withdraw(id);
      created.decline(id, 'x');
      expect((await created.getOwn(id))?.status).toBe('WITHDRAWN');
    });
  });

  describe('kinds REACTIVATION and TRANSFER', () => {
    const werkzeugbau = (overrides: MockAttestationOverrides = {}) => attestation({ company: WERKZEUGBAU_CLAIMS, ...overrides });

    it('case 13: reactivates by companyId or bpn and takes the roles from C3-M1', async () => {
      const { repository } = setup();
      const byId = await repository.create({ kind: 'REACTIVATION', verification: 'EBW', companyId: WERKZEUGBAU_COMPANY.id, attestation: werkzeugbau() });
      expect(byId.application).toMatchObject({ existingCompany: true, companyId: WERKZEUGBAU_COMPANY.id, companyRoles: ['ACTIVE_PARTICIPANT'], kind: 'REACTIVATION' });
      await repository.withdraw(byId.application.id);

      const byBpn = await repository.create({ kind: 'REACTIVATION', verification: 'EBW', bpn: 'BPNL00000000003C', attestation: werkzeugbau() });
      expect(byBpn.application).toMatchObject({ existingCompany: true, companyId: WERKZEUGBAU_COMPANY.id, companyRoles: ['ACTIVE_PARTICIPANT'] });
    });

    it('case 13: refuses an active or unknown company, another company, a reference for ONBOARDING, and C3-M1 down', async () => {
      const { repository } = setup();
      expect(await problemOf(repository.create({ kind: 'REACTIVATION', verification: 'EBW', companyId: OSP_A_EXISTING_COMPANY.id, attestation: werkzeugbau() }))).toMatchObject({
        status: 409,
        type: 'urn:c1-m2:problem:company-not-eligible',
        companyStatus: 'ACTIVE',
      });
      const unknown = await problemOf(repository.create({ kind: 'REACTIVATION', verification: 'EBW', companyId: 'f0000000-0000-4000-8000-000000000000', attestation: werkzeugbau() }));
      expect(unknown).toMatchObject({ type: 'urn:c1-m2:problem:company-not-eligible' });
      expect(unknown.companyStatus).toBeUndefined();
      expect(await problemOf(repository.create({ kind: 'REACTIVATION', verification: 'EBW', companyId: WERKZEUGBAU_COMPANY.id, attestation: attestation() }))).toMatchObject({
        status: 400,
        type: 'urn:c1-m2:problem:attestation-mismatch',
        fields: ['EBWOID', 'EUID'],
      });
      expect(await problemOf(repository.create(ebw({ companyId: WERKZEUGBAU_COMPANY.id })))).toMatchObject({ type: 'urn:c1-m2:problem:validation', errors: [{ field: 'companyId' }] });
      expect(repository.applications).toEqual([]);

      const down = setup({ failure: new CoreHttpException(502, 'urn:c1-m2:problem:upstream-error', 'C3-M1 not reachable') }).repository;
      await expect(down.create({ kind: 'REACTIVATION', verification: 'EBW', companyId: WERKZEUGBAU_COMPANY.id, attestation: werkzeugbau() })).rejects.toThrow('C3-M1 not reachable');
    });

    it('case 13: refuses when none of the company roles is selectable', async () => {
      const { repository } = setup({ existingCompanies: [{ ...WERKZEUGBAU_COMPANY, companyRoles: ['ONBOARDING_SERVICE_PROVIDER'] }] });
      expect(await problemOf(repository.create({ kind: 'REACTIVATION', verification: 'EBW', companyId: WERKZEUGBAU_COMPANY.id, attestation: werkzeugbau() }))).toMatchObject({
        type: 'urn:c1-m2:problem:validation',
        errors: [{ field: 'companyRoles', message: 'At least one company role is required.' }],
      });
    });

    it('case 14: TRANSFER without reference is new, with the Gießerei reference a return; REACTIVATION of Gießerei is not eligible', async () => {
      const { repository } = setup();
      const transfer = await repository.create(ebw({ kind: 'TRANSFER' }));
      expect(transfer.application).toMatchObject({ kind: 'TRANSFER', existingCompany: false });
      await repository.withdraw(transfer.application.id);

      const giesserei = attestation({ company: GIESSEREI_CLAIMS });
      expect(await problemOf(repository.create({ kind: 'TRANSFER', verification: 'EBW', companyId: GIESSEREI_COMPANY.id, attestation: giesserei }))).toMatchObject({
        type: 'urn:c1-m2:problem:validation',
        errors: [{ field: 'companyData.address' }],
      });
      expect(await problemOf(repository.create({ kind: 'REACTIVATION', verification: 'EBW', companyId: GIESSEREI_COMPANY.id, attestation: giesserei }))).toMatchObject({
        type: 'urn:c1-m2:problem:company-not-eligible',
        companyStatus: 'INACTIVE',
      });
      const back = await repository.create({
        kind: 'TRANSFER',
        verification: 'EBW',
        companyId: GIESSEREI_COMPANY.id,
        attestation: giesserei,
        companyData: { address: MAX_APPLICATION_TRANSFER_RETURN.companyData.address },
      });
      expect(back.application).toMatchObject({
        existingCompany: true,
        companyId: GIESSEREI_COMPANY.id,
        companyRoles: ['ACTIVE_PARTICIPANT', 'APP_PROVIDER'],
        comparison: MAX_APPLICATION_TRANSFER_RETURN.comparison,
        companyData: MAX_APPLICATION_TRANSFER_RETURN.companyData,
      });
    });

    it('case 15: one open application per existing company', async () => {
      const { repository } = setup();
      await repository.create({ kind: 'REACTIVATION', verification: 'EBW', companyId: WERKZEUGBAU_COMPANY.id, attestation: werkzeugbau() });
      const max = repository.as(MAX);
      expect(await problemOf(max.create({ kind: 'REACTIVATION', verification: 'EBW', companyId: WERKZEUGBAU_COMPANY.id, attestation: maxAttestation({ company: WERKZEUGBAU_CLAIMS }) }))).toMatchObject({
        status: 409,
        type: 'urn:c1-m2:problem:company-has-open-application',
      });
    });

    it('compares a changed EUID with the existing company', async () => {
      const { repository } = setup({ caller: MAX, applications: [MAX_APPLICATION_TRANSFER_RETURN] });
      const giesserei = { ...GIESSEREI_COMPANY, identifiers: [...GIESSEREI_COMPANY.identifiers, { type: 'EUID' as const, value: 'DEXX001T.HRB100004' }] };
      const documents = setup({ caller: HANS, existingCompanies: [giesserei] }).repository;
      const created = await documents.create({ ...LOGISTIK, kind: 'TRANSFER', companyId: giesserei.id, companyRoles: undefined });
      expect(created.application).toMatchObject({ existingCompany: true, companyRoles: ['ACTIVE_PARTICIPANT', 'APP_PROVIDER'] });
      expect(await problemOf(documents.update(created.application.id, { identifiers: [{ type: 'EUID', value: 'DEXX001T.HRB999999' }] }))).toMatchObject({
        type: 'urn:c1-m2:problem:attestation-mismatch',
        fields: ['EUID'],
      });
      expect(await problemOf(repository.update(MAX_APPLICATION_TRANSFER_RETURN.id, { companyRoles: ['APP_PROVIDER'] }))).toMatchObject({
        type: 'urn:c1-m2:problem:invalid-state',
      });
    });
  });

  describe('verification path DOCUMENTS', () => {
    it('case 16: creates from the data of the person, with the FRAMEWORK 7a companyId of Beispiel Logistik GmbH', async () => {
      const { repository } = setup({ caller: HANS });
      const { application } = await repository.create(LOGISTIK);
      expect(application).toMatchObject({
        verification: 'DOCUMENTS',
        companyId: 'c0000002-0000-4000-8000-000000000002',
        comparison: [],
        attestation: null,
        applicant: { givenName: 'Hans', familyName: 'Beispiel' },
      });
      expect(application.companyData.identifiers).toEqual([
        { type: 'COMMERCIAL_REG_NUMBER', value: 'HRB 200002', source: 'APPLICANT' },
        { type: 'VAT_ID', value: 'DE987654321', source: 'APPLICANT' },
      ]);
    });

    it('case 16: refuses an EBWOID, an attestation, missing data; case 17: documents-disabled', async () => {
      const { repository } = setup({ caller: HANS });
      const fieldsOf = async (input: ApplicationCreateInput) => (await problemOf(repository.create(input))).errors?.map((error) => error.field);
      expect(await fieldsOf({ ...LOGISTIK, companyData: { ...LOGISTIK.companyData, identifiers: [{ type: 'EBWOID', value: 'EBWOID-DE-1' }] } })).toEqual(['companyData.identifiers']);
      expect(await fieldsOf({ ...LOGISTIK, attestation: attestation() })).toEqual(['attestation']);
      expect(await fieldsOf({ ...LOGISTIK, companyData: {} })).toEqual(['companyData.legalName', 'companyData.address', 'companyData.identifiers']);
      expect(repository.applications).toEqual([]);

      const disabled = setup({ caller: HANS, documentsEnabled: false }).repository;
      expect(await problemOf(disabled.create(LOGISTIK))).toMatchObject({ status: 400, type: 'urn:c1-m2:problem:documents-disabled' });
    });

    it('case 16: uploads PDF, PNG and JPEG by their first bytes, within size and count', async () => {
      const { repository } = setup({ caller: HANS, documentMaxBytes: 64, documentMaxCount: 4 });
      const { application } = await repository.create(LOGISTIK);
      const pdf = await repository.uploadDocument(application.id, { file: PDF(), fileName: 'extract.pdf', documentType: 'COMMERCIAL_REGISTER_EXTRACT' });
      expect(pdf).toMatchObject({ documentType: 'COMMERCIAL_REGISTER_EXTRACT', fileName: 'extract.pdf', contentType: 'application/pdf', sizeBytes: 23, uploadedAt: NOW.toISOString() });
      expect(pdf?.sha256).toMatch(/^[0-9a-f]{64}$/);
      const png = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1])]);
      expect((await repository.uploadDocument(application.id, { file: png, fileName: 'scan.png', documentType: 'OTHER' }))?.contentType).toBe('image/png');
      const jpeg = new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])]);
      expect((await repository.uploadDocument(application.id, { file: jpeg, fileName: 'power.jpg', documentType: 'POWER_OF_ATTORNEY' }))?.contentType).toBe('image/jpeg');

      const messagesOf = async (file: Blob, fileName = 'x.pdf', documentType = 'OTHER' as const) =>
        (await problemOf(repository.uploadDocument(application.id, { file, fileName, documentType }))).errors?.map((error) => error.message);
      expect(await messagesOf(new Blob(['hello']))).toEqual(['Only PDF, PNG or JPEG (checked by the first bytes).']);
      expect(await messagesOf(PDF('x'.repeat(64)))).toEqual(['A supporting document has 1 to 64 bytes.']);
      expect(await messagesOf(PDF(), '../etc/passwd')).toEqual(['The file name has 1 to 200 characters, without path parts and control characters.']);
      expect(await messagesOf(PDF(), 'x.pdf', 'PASSPORT' as never)).toEqual(['documentType is COMMERCIAL_REGISTER_EXTRACT, POWER_OF_ATTORNEY or OTHER.']);

      await repository.uploadDocument(application.id, { file: PDF(), fileName: 'four.pdf', documentType: 'OTHER' });
      expect(await messagesOf(PDF(), 'five.pdf')).toEqual(['At most 4 supporting documents per application.']);
      expect((await repository.getOwn(application.id))?.documents).toHaveLength(4);
    });

    it('case 16: the eleventh document with the default limit is refused', async () => {
      const { repository } = setup({ caller: HANS });
      const { application } = await repository.create(LOGISTIK);
      for (let index = 1; index <= 10; index++) {
        await repository.uploadDocument(application.id, { file: PDF(), fileName: `${index}.pdf`, documentType: 'OTHER' });
      }
      expect(await problemOf(repository.uploadDocument(application.id, { file: PDF(), fileName: '11.pdf', documentType: 'OTHER' }))).toMatchObject({
        type: 'urn:c1-m2:problem:validation',
      });
    });

    it('case 16: submission needs the register extract and the declaration of representation', async () => {
      const { repository } = setup({ caller: HANS });
      const { application } = await repository.create(LOGISTIK);
      const other = await repository.uploadDocument(application.id, { file: PDF(), fileName: 'other.pdf', documentType: 'OTHER' });
      expect(await problemOf(repository.submit(application.id, { consents: CONSENTS, representationDeclared: true }))).toMatchObject({
        status: 400,
        type: 'urn:c1-m2:problem:documents-incomplete',
        missingDocumentTypes: ['COMMERCIAL_REGISTER_EXTRACT'],
        representationDeclarationMissing: false,
      });
      await repository.uploadDocument(application.id, { file: PDF(), fileName: 'extract.pdf', documentType: 'COMMERCIAL_REGISTER_EXTRACT' });
      expect(await problemOf(repository.submit(application.id, { consents: CONSENTS }))).toMatchObject({
        missingDocumentTypes: [],
        representationDeclarationMissing: true,
      });
      const submitted = await repository.submit(application.id, { consents: CONSENTS, representationDeclared: true });
      expect(submitted).toMatchObject({ status: 'SUBMITTED', representationDeclared: true });
      expect(await problemOf(repository.deleteDocument(application.id, other?.documentId as string))).toMatchObject({ type: 'urn:c1-m2:problem:invalid-state' });
      expect(await problemOf(repository.uploadDocument(application.id, { file: PDF(), fileName: 'late.pdf', documentType: 'OTHER' }))).toMatchObject({
        type: 'urn:c1-m2:problem:invalid-state',
      });
    });

    it('serves and deletes documents of the own application only', async () => {
      const { repository } = setup({ caller: HANS, applications: [HANS_APPLICATION_DOCUMENTS] });
      const id = HANS_APPLICATION_DOCUMENTS.id;
      const documentId = HANS_APPLICATION_DOCUMENTS.documents[0].documentId;
      const document = await repository.getDocument(id, documentId);
      expect(document).toMatchObject({ contentType: 'application/pdf', fileName: 'handelsregisterauszug-hrb-200002.pdf' });
      expect(await document?.content.text()).toBe(MOCK_PDF_CONTENT);
      expect(await repository.getDocument(id, 'd0000000-0000-4000-8000-000000000000')).toBeNull();
      expect(await repository.as(ERIKA).getDocument(id, documentId)).toBeNull();
      expect(await repository.as(ERIKA).deleteDocument(id, documentId)).toBe(false);

      expect(await repository.deleteDocument(id, documentId)).toBe(true);
      expect(await repository.deleteDocument(id, documentId)).toBe(false);
      expect((await repository.getOwn(id))?.documents).toEqual([]);
      expect(repository.documents).toEqual([]);
    });

    it('serves the content given for a preloaded document', async () => {
      const content = new TextEncoder().encode('%PDF-1.4 other');
      const { repository } = setup({ caller: HANS, applications: [HANS_APPLICATION_DOCUMENTS], documentContents: { [HANS_APPLICATION_DOCUMENTS.documents[0].documentId]: content } });
      expect(repository.documents[0]).toMatchObject({ applicationId: HANS_APPLICATION_DOCUMENTS.id, content });
    });

    it('refuses uploads to an application in the verification path EBW', async () => {
      const { repository } = setup();
      const { application } = await repository.create(ebw());
      expect(await problemOf(repository.uploadDocument(application.id, { file: PDF(), fileName: 'x.pdf', documentType: 'OTHER' }))).toMatchObject({
        type: 'urn:c1-m2:problem:invalid-state',
      });
      expect(await repository.uploadDocument('a0000000-0000-4000-8000-000000000000', { file: PDF(), fileName: 'x.pdf', documentType: 'OTHER' })).toBeNull();
      expect(await repository.deleteDocument(application.id, 'd0000000-0000-4000-8000-000000000000')).toBe(false);
    });
  });

  describe('lists, OSP staff and permissions', () => {
    it('lists the own applications newest first, filtered and paged', async () => {
      const { repository } = setup({ caller: HANS, applications: [HANS_APPLICATION_DOCUMENTS, { ...ERIKA_APPLICATION_SUBMITTED, applicant: { ...ERIKA_APPLICATION_SUBMITTED.applicant, sub: HANS.sub }, id: 'a0000009-0000-4000-8000-000000000009' }] });
      const all = await repository.listOwn({});
      expect(all.items.map((item) => item.id)).toEqual([HANS_APPLICATION_DOCUMENTS.id, 'a0000009-0000-4000-8000-000000000009']);
      expect(all.items[0]).toEqual({
        id: HANS_APPLICATION_DOCUMENTS.id,
        companyId: HANS_APPLICATION_DOCUMENTS.companyId,
        kind: 'ONBOARDING',
        existingCompany: false,
        verification: 'DOCUMENTS',
        status: 'CREATED',
        legalName: 'Beispiel Logistik GmbH',
        countryCode: 'DE',
        companyRoles: ['ACTIVE_PARTICIPANT'],
        createdAt: HANS_APPLICATION_DOCUMENTS.createdAt,
        submittedAt: null,
      });
      expect((await repository.listOwn({ status: ['SUBMITTED'] })).total).toBe(1);
      expect(await repository.listOwn({ page: 1, size: 1 })).toMatchObject({ page: 1, size: 1, total: 2, items: [{ id: 'a0000009-0000-4000-8000-000000000009' }] });
      expect(await problemOf(repository.listOwn({ size: 101 }))).toMatchObject({ errors: [{ field: 'size' }] });
      expect(await problemOf(repository.listOwn({ page: -1 }))).toMatchObject({ errors: [{ field: 'page' }] });
    });

    it('case 20: OSP staff read every application and document; others get 403', async () => {
      const { repository } = setup({ applications: [ERIKA_APPLICATION_SUBMITTED, HANS_APPLICATION_DOCUMENTS] });
      const rolf = repository.as(ROLF);
      expect((await rolf.listAll({})).items.map((item) => item.id)).toEqual([HANS_APPLICATION_DOCUMENTS.id, ERIKA_APPLICATION_SUBMITTED.id]);
      expect((await rolf.listAll({ verification: ['DOCUMENTS'], kind: ['ONBOARDING'], status: ['CREATED'] })).total).toBe(1);
      expect((await rolf.listAll({ companyId: ERIKA_APPLICATION_SUBMITTED.companyId })).items).toHaveLength(1);
      expect(await rolf.getAny(ERIKA_APPLICATION_SUBMITTED.id)).toEqual(ERIKA_APPLICATION_SUBMITTED);
      expect(await rolf.getAny('a0000000-0000-4000-8000-000000000000')).toBeNull();
      const document = await rolf.getAnyDocument(HANS_APPLICATION_DOCUMENTS.id, HANS_APPLICATION_DOCUMENTS.documents[0].documentId);
      expect(document?.fileName).toBe('handelsregisterauszug-hrb-200002.pdf');
      expect(await rolf.getAnyDocument('a0000000-0000-4000-8000-000000000000', 'd')).toBeNull();

      expect(await problemOf(repository.listAll({}))).toMatchObject({ status: 403, type: 'urn:c1-m2:problem:forbidden' });
      expect(await problemOf(repository.getAny(ERIKA_APPLICATION_SUBMITTED.id))).toMatchObject({ status: 403 });
      const nobody = repository.as(NO_PERMISSIONS_CALLER);
      expect(await problemOf(nobody.getOwn(ERIKA_APPLICATION_SUBMITTED.id))).toMatchObject({ status: 403, type: 'urn:c1-m2:problem:forbidden' });
      expect(await problemOf(repository.as({ ...ROLF, permissions: ['view_applications'] }).getOwn(ERIKA_APPLICATION_SUBMITTED.id))).toMatchObject({ status: 403 });
    });

    it('case 21: a new version of the terms is required at the next submission', async () => {
      const agreements = new InMemoryAgreementRepository({ caller: callerOf(OTTO_SESSION), now });
      const repository = new InMemoryApplicationRepository({ caller: ERIKA, agreements, now, applications: [ERIKA_APPLICATION_CREATED] });
      await agreements.createVersion({
        agreementKey: 'osp-terms',
        version: '1.1',
        party: 'OSP',
        scope: 'ALL',
        title: { de: 'Nutzungsbedingungen des OSP', en: 'Terms of use of the OSP' },
        documentUrls: { en: 'https://osp-a.example.org/terms/osp-terms-1.1-en.pdf' },
        reconsentRequired: true,
        reconsentDueAt: '2027-01-31T00:00:00Z',
      });
      expect(await problemOf(repository.submit(ERIKA_APPLICATION_CREATED.id, { consents: CONSENTS }))).toMatchObject({
        type: 'urn:c1-m2:problem:consents-incomplete',
        missing: [{ agreementKey: 'osp-terms', version: '1.1' }],
      });
      const consents = CONSENTS.map((consent) => (consent.agreementKey === 'osp-terms' ? { ...consent, version: '1.1' } : consent));
      expect((await repository.submit(ERIKA_APPLICATION_CREATED.id, { consents }))?.status).toBe('SUBMITTED');
    });

    it('fails every call with the injected failure and records the calls', async () => {
      const failure = new CoreHttpException(500, null, 'boom');
      const { repository } = setup({ failure });
      await expect(repository.create(ebw())).rejects.toBe(failure);
      await expect(repository.getOwn('x')).rejects.toBe(failure);
      await expect(repository.as(ROLF).listAll({})).resolves.toMatchObject({ total: 0 });
      expect(repository.calls).toEqual(['create', 'getOwn']);
    });
  });
});
