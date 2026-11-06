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

import { createCoreClient } from '@dataspace-mgm/core-http';
import { describe, expect, it } from 'vitest';
import { c3m1ModuleFrom } from '../../c3-m1-module.factory';
import type { paths } from '../../generated/c3-m1-api';
import { ChangeRequestReviewHttpRepository, fileNameOf } from './change-request-review-http.repository';
import { CompanyHttpRepository } from './company-http.repository';
import { CompanyRoleHttpRepository } from './company-role-http.repository';
import { OspCompanyHttpRepository } from './osp-company-http.repository';
import { OwnChangeRequestHttpRepository } from './own-change-request-http.repository';

const U1 = 'c0000001-0000-4000-8000-000000000001';
const CR = 'e0000001-0000-4000-8000-000000000001';

/** A Company of the backend as it is on the wire (camelCase, address in parts, roles with status). */
const COMPANY_WIRE = {
  id: U1,
  name: 'Beispiel Maschinenbau GmbH',
  shortName: 'Beispiel Maschinenbau',
  address: { street: 'Musterstraße', houseNumber: '1', postalCode: '70569', city: 'Stuttgart', region: 'BW', countryCode: 'DE' },
  identifiers: [
    { type: 'EBWOID', value: 'EBWOID-DE-0000000001', source: 'BUSINESS_WALLET' },
    { type: 'VAT_ID', value: 'DE123456789', source: 'DECLARED' },
  ],
  coreDataSource: 'EBW',
  coreDataVerifiedAt: '2026-11-02T09:14:00Z',
  bpn: 'BPNLIUK2REMLK3F4',
  status: 'ACTIVE',
  companyRoles: [{ companyRole: 'ACTIVE_PARTICIPANT', status: 'ACTIVE' }],
  dataspaceName: 'Catena-X',
  createdAt: '2026-11-02T09:20:00Z',
  activatedAt: '2026-11-03T10:05:00Z',
};
const DETAIL_WIRE = { ...COMPANY_WIRE, openChangeRequestId: CR, deactivationReason: null, applicationId: 'a0000001-0000-4000-8000-000000000001' };
const CR_WIRE = {
  id: CR,
  companyId: U1,
  status: 'OPEN',
  changes: { identifiers: [{ type: 'LEI_CODE', value: '529900T8BM49AURSDO55' }] },
  comment: 'We add our LEI.',
  documents: [{ id: 'd0000001-0000-4000-8000-000000000001', fileName: 'lei.pdf', mediaType: 'application/pdf', sizeBytes: 184320 }],
  requestedBy: '5a1c0001-0000-4000-8000-000000000001',
  createdAt: '2026-11-05T14:02:00Z',
};
const ROLES_WIRE = [
  {
    companyRole: 'APP_PROVIDER',
    assignableBy: 'COMPANY',
    status: 'NONE',
    description: 'Offers apps',
    agreements: [{ agreementKey: 'terms-app-provider', version: '1.0', name: 'Terms', names: { en: 'Terms' }, documentUrl: 'https://x.example/t.pdf' }],
  },
];

interface Answer {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
}

/** A module whose fetch answers in turn with the given answers and records every request. */
function moduleAnswering(...answers: Answer[]) {
  const requests: Request[] = [];
  const fetchImpl = async (request: Request) => {
    requests.push(request);
    const { status, body, headers } = answers.shift() ?? { status: 500, body: {} };
    const type = status < 400 ? 'application/json' : 'application/problem+json';
    const content = body instanceof Blob ? body : JSON.stringify(body);
    return new Response(content, { status, headers: { 'content-type': type, ...headers } });
  };
  const client = createCoreClient<paths>({ baseUrl: 'http://ui.test/api/c3-m1', fetch: fetchImpl as unknown as typeof fetch, getCsrfToken: () => 'csrf-1' });
  const module = c3m1ModuleFrom({
    companies: new CompanyHttpRepository(client),
    ownChangeRequests: new OwnChangeRequestHttpRepository(client),
    companyRoles: new CompanyRoleHttpRepository(client),
    ospCompanies: new OspCompanyHttpRepository(client),
    reviews: new ChangeRequestReviewHttpRepository(client),
  });
  const sent = (index = 0) => ({ method: requests[index].method, url: new URL(requests[index].url), request: requests[index] });
  return { module, sent };
}

const problem = (status: number, name: string) => ({ status, body: { type: `urn:c3-m1:problem:${name}`, title: name, status } });

describe('own company over HTTP', () => {
  it('PATCHes only the short name, with the CSRF token', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: { ...COMPANY_WIRE, shortName: null } });
    expect(await module.updateShortName.execute(U1, '')).toMatchObject({ status: 'success', data: { shortName: null, postalAddress: { street: 'Musterstraße' } } });
    expect(sent().method).toBe('PATCH');
    expect(sent().url.pathname).toBe(`/api/c3-m1/companies/${U1}`);
    expect(sent().request.headers.get('X-CSRF-Token')).toBe('csrf-1');
    expect(await sent().request.json()).toEqual({ shortName: null });
  });

  it('maps 409 field-locked to rejected', async () => {
    const { module } = moduleAnswering(problem(409, 'field-locked'));
    expect(await module.updateShortName.execute(U1, 'x')).toMatchObject({ status: 'rejected', problem: 'field-locked' });
  });
});

describe('own change requests over HTTP', () => {
  it('lists with page and size', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: { items: [CR_WIRE], page: 0, size: 20, total: 1 } });
    const result = await module.listOwnChangeRequests.execute(U1, { page: 0, size: 20 });
    expect(result).toMatchObject({ status: 'success', data: { total: 1, items: [{ id: CR, companyName: null, decidedBy: null, closedAt: null }] } });
    expect(sent().url.pathname).toBe(`/api/c3-m1/companies/${U1}/change-requests`);
    expect(sent().url.search).toBe('?page=0&size=20');
  });

  it('sends multipart/form-data: part data as JSON and one part documents per file', async () => {
    const { module, sent } = moduleAnswering({ status: 201, body: CR_WIRE });
    const file = { fileName: 'lei.pdf', mediaType: 'application/pdf', sizeBytes: 4, content: new Blob(['%PDF'], { type: 'application/pdf' }) };
    const result = await module.createChangeRequest.execute(U1, { identifiers: [{ type: 'LEI_CODE', value: ' 529900T8BM49AURSDO55 ' }], comment: 'LEI', documents: [file] });
    expect(result).toMatchObject({ status: 'success', data: { status: 'OPEN' } });
    expect(sent().method).toBe('POST');
    expect(sent().request.headers.get('content-type')).toMatch(/^multipart\/form-data; boundary=/);
    const form = await sent().request.formData();
    // a plain text field, as team/2 reads it with Form(...): no file name, no Blob
    expect(typeof form.get('data')).toBe('string');
    expect(JSON.parse(form.get('data') as string)).toEqual({ identifiers: [{ type: 'LEI_CODE', value: '529900T8BM49AURSDO55' }], comment: 'LEI' });
    expect((form.getAll('documents') as File[]).map((part) => part.name)).toEqual(['lei.pdf']);
  });

  it.each([
    [problem(409, 'change-request-open'), { status: 'rejected', problem: 'change-request-open' }],
    [problem(400, 'document-invalid'), { status: 'rejected', problem: 'document-invalid' }],
    [problem(404, 'not-found'), { status: 'not-found' }],
    [problem(403, 'forbidden'), { status: 'forbidden' }],
    [problem(501, 'not-implemented'), { status: 'failed', error: { status: 501, problemType: 'urn:c3-m1:problem:not-implemented' } }],
  ])('withdraw maps %j', async (answer, expected) => {
    const { module, sent } = moduleAnswering(answer);
    expect(await module.withdrawChangeRequest.execute(U1, CR)).toMatchObject(expected);
    expect(sent().url.pathname).toBe(`/api/c3-m1/companies/${U1}/change-requests/${CR}/withdraw`);
  });
});

describe('company roles over HTTP', () => {
  it('lists with lang, adds with all consents, removes by role', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: ROLES_WIRE }, { status: 200, body: ROLES_WIRE }, { status: 200, body: ROLES_WIRE });
    const listed = await module.listCompanyRoles.execute(U1, 'de');
    expect(listed).toMatchObject({ status: 'success', data: [{ companyRole: 'APP_PROVIDER', agreements: [{ consentStatus: null, consentedAt: null }] }] });
    expect(sent(0).url.search).toBe('?lang=de');
    await module.addCompanyRole.execute(U1, listed.status === 'success' ? listed.data[0] : (null as never), 'de');
    expect(sent(1).method).toBe('POST');
    expect(await sent(1).request.json()).toEqual({ companyRole: 'APP_PROVIDER', consents: [{ agreementKey: 'terms-app-provider', version: '1.0' }] });
    await module.removeCompanyRole.execute(U1, 'APP_PROVIDER', 'de');
    expect(sent(2).method).toBe('DELETE');
    expect(sent(2).url.pathname).toBe(`/api/c3-m1/companies/${U1}/company-roles/APP_PROVIDER`);
  });

  it('keeps the UI safe when the catalogue has no entry (null assignableBy, name, documentUrl)', async () => {
    const wire = [{ ...ROLES_WIRE[0], assignableBy: null, agreements: [{ agreementKey: 'terms-x', version: '1.0', name: null, names: {}, documentUrl: null }] }];
    const { module } = moduleAnswering({ status: 200, body: wire });
    expect(await module.listCompanyRoles.execute(U1, 'en')).toMatchObject({
      status: 'success',
      data: [{ assignableBy: 'SEED', agreements: [{ name: 'terms-x', documentUrl: '' }] }],
    });
  });

  it('maps 502 upstream-error to failed and 409 last-role to rejected', async () => {
    const { module } = moduleAnswering(problem(502, 'upstream-error'), problem(409, 'last-role'));
    expect(await module.listCompanyRoles.execute(U1, 'en')).toMatchObject({ status: 'failed', error: { status: 502 } });
    expect(await module.removeCompanyRole.execute(U1, 'ACTIVE_PARTICIPANT', 'en')).toMatchObject({ status: 'rejected', problem: 'last-role' });
  });
});

describe('companies of the OSP over HTTP', () => {
  it('lists with repeated status and the other filters', async () => {
    const summary = { id: U1, name: 'Beispiel', status: 'ACTIVE', coreDataSource: 'EBW', countryCode: 'DE', createdAt: '2026-11-02T09:20:00Z' };
    const { module, sent } = moduleAnswering({ status: 200, body: { items: [summary], page: 0, size: 20, total: 1 } });
    const result = await module.listCompanies.execute({ page: 0, size: 20, status: ['ACTIVE', 'REQUESTED'], name: ' Beisp ', hasBpn: true, coreDataSource: 'EBW' });
    expect(result).toMatchObject({ status: 'success', data: { items: [{ bpn: null, companyRoles: [] }] } });
    const query = sent().url.searchParams;
    expect(sent().url.pathname).toBe('/api/c3-m1/osp/companies');
    expect(query.getAll('status')).toEqual(['ACTIVE', 'REQUESTED']);
    expect(query.get('name')).toBe('Beisp');
    expect(query.get('hasBpn')).toBe('true');
    expect(query.get('coreDataSource')).toBe('EBW');
  });

  it('reads the detail, corrects only what changes, deactivates with the reason', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: DETAIL_WIRE }, { status: 200, body: DETAIL_WIRE }, { status: 200, body: { ...DETAIL_WIRE, status: 'INACTIVE' } });
    expect(await module.getCompanyDetail.execute(U1)).toMatchObject({ status: 'success', data: { openChangeRequestId: CR, reactivatedAt: null } });
    await module.correctCompany.execute(U1, { identifiers: [{ type: 'VAT_ID', value: 'DE1 ' }], reason: ' extract ' });
    expect(sent(1).method).toBe('PATCH');
    expect(await sent(1).request.json()).toEqual({ identifiers: [{ type: 'VAT_ID', value: 'DE1' }], reason: 'extract' });
    expect(await module.deactivateCompany.execute(U1, 'ended')).toMatchObject({ status: 'success', data: { status: 'INACTIVE' } });
    expect(sent(2).url.pathname).toBe(`/api/c3-m1/osp/companies/${U1}/deactivate`);
    expect(await sent(2).request.json()).toEqual({ reason: 'ended' });
  });

  it('maps 401 to failed (the client also redirects to sign-in)', async () => {
    const { module } = moduleAnswering({ status: 401, body: { type: 'urn:portal:problem:unauthorized', title: 'unauthorized', status: 401 } });
    expect(await module.listCompanies.execute({ page: 0, size: 20 })).toMatchObject({ status: 'failed', error: { status: 401 } });
  });
});

describe('review over HTTP', () => {
  it('lists, reads the detail, downloads a document as a Blob, approves and declines', async () => {
    const detail = { ...CR_WIRE, companyName: 'Beispiel', company: { id: U1, name: 'Beispiel', address: COMPANY_WIRE.address, identifiers: COMPANY_WIRE.identifiers, coreDataSource: 'EBW', status: 'ACTIVE' } };
    const { module, sent } = moduleAnswering(
      { status: 200, body: { items: [CR_WIRE], page: 0, size: 20, total: 1 } },
      { status: 200, body: detail },
      { status: 200, body: new Blob(['%PDF'], { type: 'application/pdf' }), headers: { 'content-type': 'application/pdf', 'content-disposition': 'attachment; filename="../lei.pdf"' } },
      { status: 200, body: { ...CR_WIRE, status: 'APPROVED' } },
      { status: 200, body: { ...CR_WIRE, status: 'DECLINED', decisionReason: 'no' } },
    );
    await module.listChangeRequests.execute({ page: 0, size: 20, status: ['OPEN'] });
    expect(sent(0).url.search).toBe('?page=0&size=20&status=OPEN');
    expect(await module.getChangeRequest.execute(CR)).toMatchObject({ status: 'success', data: { company: { address: { countryCode: 'DE', addressAddition: null } } } });
    const file = await module.downloadChangeRequestDocument.execute(CR, 'd1');
    expect(file).toMatchObject({ status: 'success', data: { fileName: 'lei.pdf', mediaType: 'application/pdf', sizeBytes: 4 } });
    expect(sent(2).url.pathname).toBe(`/api/c3-m1/osp/change-requests/${CR}/documents/d1`);
    await module.approveChangeRequest.execute(CR);
    expect(await sent(3).request.json()).toEqual({});
    expect(await module.declineChangeRequest.execute(CR, ' no ')).toMatchObject({ status: 'success', data: { decisionReason: 'no' } });
    expect(await sent(4).request.json()).toEqual({ reason: 'no' });
  });

  it('maps 409 same-person (four-eyes principle) and attestation-required to rejected', async () => {
    const { module } = moduleAnswering(problem(409, 'same-person'), problem(409, 'attestation-required'));
    expect(await module.approveChangeRequest.execute(CR, 'ok')).toMatchObject({ status: 'rejected', problem: 'same-person' });
    expect(await module.approveChangeRequest.execute(CR)).toMatchObject({ status: 'rejected', problem: 'attestation-required' });
  });

  it('maps a failed download to its result', async () => {
    const { module } = moduleAnswering(problem(404, 'not-found'));
    expect(await module.downloadChangeRequestDocument.execute(CR, 'd1')).toEqual({ status: 'not-found' });
  });
});

describe('fileNameOf', () => {
  it('reads plain and RFC 5987 names, keeps only the base name and falls back', () => {
    expect(fileNameOf('attachment; filename="a b.pdf"', 'x')).toBe('a b.pdf');
    expect(fileNameOf("attachment; filename*=UTF-8''Auszug%20%C3%A4.pdf", 'x')).toBe('Auszug ä.pdf');
    expect(fileNameOf('attachment; filename="C:\\\\tmp\\\\evil.pdf"', 'x')).toBe('evil.pdf');
    expect(fileNameOf(null, 'fallback')).toBe('fallback');
    expect(fileNameOf('attachment; filename="%E0%A4%A"', 'x')).toBe('%E0%A4%A');
  });
});
