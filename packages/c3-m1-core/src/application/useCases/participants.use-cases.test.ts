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
import { describe, expect, it } from 'vitest';
import { c3m1Problem, type InMemoryC3M1StoreOptions } from '../../domain/testing/in-memory-c3-m1.store';
import { createInMemoryC3M1Module } from '../../domain/testing/in-memory-c3-m1.module';
import { COMPANY_IDS, PERSON_IDS } from '../../domain/testing/participants.fixtures';

/**
 * The use cases check the input locally (UX pre-check, nothing sent), normalise it, and turn every answer of C3-M1 into
 * a result. The rules themselves (permissions, scopes, four-eyes principle, last role, open request) are C3-M1's; here
 * they arrive as injected answers of the module.
 */
const module = (options: InMemoryC3M1StoreOptions = {}) => createInMemoryC3M1Module({ actorId: PERSON_IDS.rolf, now: () => '2026-11-06T10:00:00Z', ...options });
const PAGE = { page: 0, size: 20 };
const CR_OPEN = 'e0000001-0000-4000-8000-000000000001';
const CR_LOGISTIK = 'e0000002-0000-4000-8000-000000000002';
const pdf = { fileName: 'lei.pdf', mediaType: 'application/pdf', sizeBytes: 2048, content: new Blob(['%PDF']) };

describe('own company', () => {
  it('trims the short name and sends null for an empty one', async () => {
    const { module: c3m1 } = module();
    expect(await c3m1.updateShortName.execute(COMPANY_IDS.u1, ' Beispiel MB ')).toMatchObject({ status: 'success', data: { shortName: 'Beispiel MB' } });
    expect(await c3m1.updateShortName.execute(COMPANY_IDS.u1, '')).toMatchObject({ status: 'success', data: { shortName: null } });
  });

  it('does not send a short name that is too long', async () => {
    const { module: c3m1, store } = module();
    expect(await c3m1.updateShortName.execute(COMPANY_IDS.u1, 'x'.repeat(101))).toEqual({ status: 'invalid', errors: [{ field: 'shortName', key: 'tooLong', params: { max: 100 } }] });
    expect(store.calls).toEqual([]);
  });

  it.each([
    [c3m1Problem(403, 'forbidden'), { status: 'forbidden' }],
    [c3m1Problem(404, 'not-found'), { status: 'not-found' }],
    [c3m1Problem(409, 'invalid-state'), { status: 'rejected', problem: 'invalid-state' }],
    [c3m1Problem(409, 'field-locked'), { status: 'rejected', problem: 'field-locked' }],
  ])('returns the answer %s of the module as a result', async (failure, expected) => {
    expect(await module({ failures: { updateCompany: failure } }).module.updateShortName.execute(COMPANY_IDS.u1, 'x')).toMatchObject(expected);
  });
});

describe('own change requests', () => {
  it('lists them newest first, without the reviewer', async () => {
    const result = await module().module.listOwnChangeRequests.execute(COMPANY_IDS.u1, PAGE);
    expect(result.status === 'success' && result.data.items.map((item) => item.status)).toEqual(['OPEN', 'DECLINED', 'WITHDRAWN']);
    expect(result.status === 'success' && result.data.items.every((item) => item.decidedBy === null)).toBe(true);
  });

  it('sends a checked draft with the trimmed comment', async () => {
    const created = await module().module.createChangeRequest.execute(COMPANY_IDS.u1, {
      identifiers: [{ type: 'LEI_CODE', value: '529900T8BM49AURSDO55' }],
      comment: '  We add our LEI.  ',
      documents: [pdf],
    });
    expect(created).toMatchObject({ status: 'success', data: { status: 'OPEN', comment: 'We add our LEI.' } });
  });

  it('checks the draft before sending', async () => {
    const { module: c3m1, store } = module();
    expect(await c3m1.createChangeRequest.execute(COMPANY_IDS.u1, { comment: '', documents: [] })).toMatchObject({ status: 'invalid' });
    expect(store.calls).toEqual([]);
  });

  it.each(['change-request-open', 'attestation-required', 'change-requests-disabled'])('returns 409 %s of the module as rejected', async (problem) => {
    const result = await module({ failures: { createChangeRequest: c3m1Problem(409, problem) } }).module.createChangeRequest.execute(COMPANY_IDS.u1, {
      identifiers: [{ type: 'EORI', value: 'DE1' }],
      comment: 'EORI',
      documents: [pdf],
    });
    expect(result).toMatchObject({ status: 'rejected', problem, error: { status: 409 } });
  });

  it('withdraws and returns 409 invalid-state of the module as rejected', async () => {
    expect(await module().module.withdrawChangeRequest.execute(COMPANY_IDS.u1, CR_OPEN)).toMatchObject({ status: 'success', data: { status: 'WITHDRAWN' } });
    const refused = await module({ failures: { withdrawChangeRequest: c3m1Problem(409, 'invalid-state') } }).module.withdrawChangeRequest.execute(COMPANY_IDS.u1, CR_OPEN);
    expect(refused).toMatchObject({ status: 'rejected', problem: 'invalid-state' });
  });
});

describe('company roles', () => {
  it('lists, adds with all terms and removes', async () => {
    const { module: c3m1 } = module();
    const listed = await c3m1.listCompanyRoles.execute(COMPANY_IDS.u1, 'en');
    const appProvider = listed.status === 'success' ? listed.data[1] : null;
    const added = await c3m1.addCompanyRole.execute(COMPANY_IDS.u1, appProvider!, 'en');
    expect(added.status === 'success' && added.data[1]).toMatchObject({ status: 'ACTIVE', agreements: [{ consentStatus: 'ACTIVE' }] });
    const removed = await c3m1.removeCompanyRole.execute(COMPANY_IDS.u1, 'APP_PROVIDER', 'en');
    expect(removed.status === 'success' && removed.data[1].status).toBe('INACTIVE');
  });

  it('returns last-role, consent-missing and 502 upstream-error of the module', async () => {
    expect(await module({ failures: { removeCompanyRole: c3m1Problem(409, 'last-role') } }).module.removeCompanyRole.execute(COMPANY_IDS.u1, 'ACTIVE_PARTICIPANT', 'en')).toMatchObject({ status: 'rejected', problem: 'last-role' });
    const listed = await module().module.listCompanyRoles.execute(COMPANY_IDS.u1, 'en');
    const role = listed.status === 'success' ? listed.data[1] : null;
    expect(await module({ failures: { addCompanyRole: c3m1Problem(400, 'consent-missing') } }).module.addCompanyRole.execute(COMPANY_IDS.u1, role!, 'en')).toMatchObject({ status: 'rejected', problem: 'consent-missing' });
    expect(await module({ failure: c3m1Problem(502, 'upstream-error') }).module.listCompanyRoles.execute(COMPANY_IDS.u1, 'en')).toMatchObject({ status: 'failed', error: { status: 502 } });
  });
});

describe('companies of the onboarding service provider', () => {
  it('lists with a trimmed name filter', async () => {
    const filtered = await module().module.listCompanies.execute({ ...PAGE, status: ['REQUESTED'], name: '  zustimmung ' });
    expect(filtered.status === 'success' && filtered.data.items.map((item) => item.name)).toEqual(['Ohne Zustimmung GmbH']);
  });

  it('returns 403 of the module as forbidden and 400 validation as rejected', async () => {
    expect(await module({ failure: c3m1Problem(403, 'forbidden') }).module.listCompanies.execute(PAGE)).toEqual({ status: 'forbidden' });
    expect(await module({ failure: c3m1Problem(400, 'validation') }).module.listCompanies.execute(PAGE)).toMatchObject({ status: 'rejected', problem: 'validation' });
  });

  it('reads a company and answers 404 for an unknown one', async () => {
    expect(await module().module.getCompanyDetail.execute(COMPANY_IDS.u1)).toMatchObject({ status: 'success', data: { openChangeRequestId: CR_OPEN } });
    expect(await module().module.getCompanyDetail.execute('00000000-0000-4000-8000-000000000000')).toEqual({ status: 'not-found' });
  });

  it('corrects with a reason, and needs one', async () => {
    const { module: c3m1 } = module();
    expect(await c3m1.correctCompany.execute(COMPANY_IDS.u2, { shortName: 'BL', reason: ' register extract ' })).toMatchObject({ status: 'success', data: { shortName: 'BL' } });
    expect(await c3m1.correctCompany.execute(COMPANY_IDS.u2, { reason: '' })).toMatchObject({ status: 'invalid' });
    expect(await module({ failures: { correctCompany: c3m1Problem(409, 'field-locked') } }).module.correctCompany.execute(COMPANY_IDS.u2, { reason: 'x' })).toMatchObject({ status: 'rejected', problem: 'field-locked' });
  });

  it('deactivates (company status change to INACTIVE) with a required reason', async () => {
    const { module: c3m1 } = module();
    expect(await c3m1.deactivateCompany.execute(COMPANY_IDS.u2, 'contract ended')).toMatchObject({ status: 'success', data: { status: 'INACTIVE', deactivationReason: 'MANUAL' } });
    expect(await c3m1.deactivateCompany.execute(COMPANY_IDS.u2, ' ')).toMatchObject({ status: 'invalid' });
  });
});

describe('review of change requests', () => {
  it('lists the open ones oldest first and reads one with the current company', async () => {
    const { module: c3m1 } = module();
    const result = await c3m1.listChangeRequests.execute({ ...PAGE, status: ['OPEN'] });
    expect(result.status === 'success' && result.data.items.map((item) => item.companyName)).toEqual(['Beispiel Logistik GmbH', 'Beispiel Maschinenbau GmbH']);
    expect(await c3m1.getChangeRequest.execute(CR_LOGISTIK)).toMatchObject({ status: 'success', data: { company: { name: 'Beispiel Logistik GmbH' } } });
    expect(await c3m1.downloadChangeRequestDocument.execute(CR_LOGISTIK, 'nope')).toEqual({ status: 'not-found' });
  });

  it('approves and declines; the decline needs a reason, the comment has a limit', async () => {
    const { module: c3m1 } = module();
    expect(await c3m1.approveChangeRequest.execute(CR_LOGISTIK)).toMatchObject({ status: 'success', data: { status: 'APPROVED', decidedBy: PERSON_IDS.rolf } });
    expect(await c3m1.approveChangeRequest.execute(CR_OPEN, 'x'.repeat(1001))).toMatchObject({ status: 'invalid' });
    expect(await c3m1.declineChangeRequest.execute(CR_OPEN, ' ')).toMatchObject({ status: 'invalid' });
    expect(await c3m1.declineChangeRequest.execute(CR_OPEN, 'LEI missing')).toMatchObject({ status: 'success', data: { status: 'DECLINED', decisionReason: 'LEI missing' } });
  });

  it('returns the four-eyes answer of the module (409 same-person) as rejected', async () => {
    const result = await module({ failures: { approveChangeRequest: c3m1Problem(409, 'same-person') } }).module.approveChangeRequest.execute(CR_LOGISTIK);
    expect(result).toMatchObject({ status: 'rejected', problem: 'same-person', error: { status: 409 } });
  });

  it('reports 501 and a network error as failed', async () => {
    expect(await module({ failure: new CoreHttpException(501, 'urn:c3-m1:problem:not-implemented', 'n') }).module.getChangeRequest.execute('e')).toMatchObject({ status: 'failed', error: { status: 501 } });
    expect(await module({ failure: new TypeError('Failed to fetch') }).module.getChangeRequest.execute('e')).toMatchObject({ status: 'failed', error: { status: null } });
  });
});
