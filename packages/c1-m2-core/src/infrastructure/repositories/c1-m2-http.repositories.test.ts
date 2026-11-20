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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import { describe, expect, it } from 'vitest';
import { createC1M2Module } from '../../index';

const APP = '55e8964d-8831-4fc7-9f59-a4b61b6cbd8c';
const DOC = '41ba6394-05ca-47e9-a470-0f3c3f451004';
const BASE = '/api/registration';

/** An application of the verification path DOCUMENTS as the backend answers POST /api/registration/applications. */
const DOCUMENTS_WIRE = {
  id: APP,
  companyId: '45dc6fe4-58b4-4c3d-a72d-6cfd5fae1e00',
  kind: 'ONBOARDING',
  existingCompany: false,
  verification: 'DOCUMENTS',
  applicant: { sub: '5a1c0001-0000-4000-8000-000000000001', givenName: 'Erika', familyName: 'Mustermann' },
  status: 'CREATED',
  companyData: {
    legalName: 'Beispiel Maschinenbau GmbH',
    shortName: null,
    address: { streetName: 'Musterstraße', streetNumber: '1', postalCode: '70569', city: 'Stuttgart', region: null, countryCode: 'DE' },
    identifiers: [{ type: 'VAT_ID', value: 'DE123456789', source: 'APPLICANT' }],
  },
  companyRoles: ['ACTIVE_PARTICIPANT'],
  attestation: null,
  comparison: [],
  documents: [],
  representationDeclared: null,
  consents: [],
  declineReason: null,
  createdAt: '2026-11-19T10:24:13.205419+00:00',
  changedAt: '2026-11-19T10:24:13.205419+00:00',
  submittedAt: null,
  withdrawnAt: null,
  closedAt: null,
  completedAt: null,
};

/** The same application with only the members the spec requires (the module leaves out what was never set). */
const MINIMAL_WIRE = {
  id: APP,
  companyId: DOCUMENTS_WIRE.companyId,
  kind: 'ONBOARDING',
  existingCompany: false,
  verification: 'DOCUMENTS',
  applicant: DOCUMENTS_WIRE.applicant,
  status: 'CREATED',
  companyData: { legalName: 'Beispiel Maschinenbau GmbH', address: { streetName: 'Musterstraße', city: 'Stuttgart', countryCode: 'DE' }, identifiers: [] },
  companyRoles: ['ACTIVE_PARTICIPANT'],
  comparison: [],
  documents: [],
  consents: [],
  createdAt: '2026-11-19T10:24:13.205419+00:00',
};

/** The parts of an application of the verification path EBW that DOCUMENTS does not have, as on the wire. */
const EBW_WIRE = {
  ...DOCUMENTS_WIRE,
  verification: 'EBW',
  attestation: {
    attestationId: '0ab80336-3043-474b-8c3b-30ac761a276a',
    issuer: 'https://ebw-connector.example.org',
    issuedAt: '2026-11-19T10:23:48+00:00',
    expiresAt: '2026-12-18T10:24:48+00:00',
    verifiedAt: '2026-11-19T10:23:48+00:00',
    person: { givenName: 'Erika', familyName: 'Mustermann' },
    representation: { confirmed: true, result: 'CONFIRMED', type: 'legal_representative', role: null, validUntil: null, issuer: null, trust: null, reasons: [] },
  },
  comparison: [
    { field: 'EBWOID', result: 'FROM_ATTESTATION' },
    { field: 'LEGAL_NAME', result: 'MATCH' },
  ],
  reviewStatus: 'NONE',
};

const DOCUMENT_WIRE = {
  documentId: DOC,
  documentType: 'COMMERCIAL_REGISTER_EXTRACT',
  fileName: 'handelsregister-auszug.pdf',
  contentType: 'application/pdf',
  sizeBytes: 50,
  sha256: '49c4d429456f744f6df83660276a5d9fa580434fc0d91df184f668809df71380',
  uploadedAt: '2026-11-19T10:24:13.321168+00:00',
};

const VERSION_WIRE = {
  agreementKey: 'osp-terms',
  version: '1.0',
  party: 'OSP',
  scope: 'ALL',
  title: { de: 'Nutzungsbedingungen des OSP', en: 'Terms of use of the OSP' },
  documentUrls: { de: 'https://osp-a.example.org/terms/osp-terms-1.0-de.pdf', en: 'https://osp-a.example.org/terms/osp-terms-1.0-en.pdf' },
  reconsentRequired: false,
  companyRoles: [],
  status: 'ACTIVE',
  createdAt: '2026-01-01T00:00:00Z',
};

interface Answer {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}

/** The module on a fetch that answers in turn with the given answers and records every request. */
function moduleAnswering(...answers: Answer[]) {
  const requests: Request[] = [];
  const fetchImpl = async (request: Request) => {
    requests.push(request);
    const { status, body, headers } = answers.shift() ?? { status: 500, body: {} };
    const type = status < 400 ? 'application/json' : 'application/problem+json';
    const content = body === undefined ? null : body instanceof Blob ? body : JSON.stringify(body);
    return new Response(content, { status, headers: { 'content-type': type, ...headers } });
  };
  const module = createC1M2Module({ baseUrl: `http://ui.test${BASE}`, fetch: fetchImpl as unknown as typeof fetch, getCsrfToken: () => 'csrf-1' });
  const sent = (index = 0) => ({ method: requests[index].method, url: new URL(requests[index].url), request: requests[index] });
  return { module, sent };
}

const problem = (status: number, name: string, extension: Record<string, unknown> = {}): Answer => ({
  status,
  body: { type: `urn:c1-m2:problem:${name}`, title: name, status, ...extension },
});

describe('reference data over HTTP', () => {
  it('reads the countries in the language asked for', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: [{ code: 'DE', name: 'Deutschland' }] });
    expect(await module.listCountries.execute('de')).toEqual({ status: 'found', countries: [{ code: 'DE', name: 'Deutschland' }] });
    expect(sent().method).toBe('GET');
    expect(sent().url.pathname + sent().url.search).toBe(`${BASE}/countries?lang=de`);
  });

  it('maps 404 of the identifier types to not-found', async () => {
    const { module, sent } = moduleAnswering(problem(404, 'not-found'));
    expect(await module.listIdentifierTypes.execute('XX', 'en')).toEqual({ status: 'not-found' });
    expect(sent().url.pathname).toBe(`${BASE}/countries/XX/identifier-types`);
  });

  it('repeats companyRole per role and leaves it out without a role', async () => {
    const agreement = { agreementKey: 'osp-terms', version: '1.0', party: 'OSP', scope: 'ALL', title: 'Terms of use of the OSP', documentUrls: { en: 'https://osp-a.example.org/terms.pdf' }, companyRoles: [] };
    const { module, sent } = moduleAnswering({ status: 200, body: [agreement] }, { status: 200, body: [] });
    expect(await module.listAgreements.execute(['ACTIVE_PARTICIPANT', 'APP_PROVIDER'], 'en')).toEqual({ status: 'found', agreements: [agreement] });
    expect(sent().url.search).toBe('?companyRole=ACTIVE_PARTICIPANT&companyRole=APP_PROVIDER&lang=en');
    await module.listAgreements.execute([], 'de');
    expect(sent(1).url.search).toBe('?lang=de');
  });
});

describe('own applications over HTTP', () => {
  const input = {
    kind: 'ONBOARDING',
    verification: 'DOCUMENTS',
    companyRoles: ['ACTIVE_PARTICIPANT'],
    companyData: {
      legalName: 'Beispiel Maschinenbau GmbH',
      address: DOCUMENTS_WIRE.companyData.address,
      identifiers: [{ type: 'VAT_ID', value: 'DE123456789' }],
    },
  } as const;

  it('POSTs the application in the casing of the spec, with the CSRF token, and maps 201 to created', async () => {
    const { module, sent } = moduleAnswering({ status: 201, body: DOCUMENTS_WIRE });
    expect(await module.createApplication.execute(input)).toEqual({ status: 'created', application: DOCUMENTS_WIRE });
    expect(sent().method).toBe('POST');
    expect(sent().url.pathname).toBe(`${BASE}/applications`);
    expect(sent().request.headers.get('X-CSRF-Token')).toBe('csrf-1');
    // members that are not given (attestation, companyId, bpn, shortName) are not sent
    expect(await sent().request.json()).toEqual(input);
  });

  it('maps 200 of a repetition to repeated', async () => {
    const { module } = moduleAnswering({ status: 200, body: EBW_WIRE });
    const result = await module.createApplication.execute({ kind: 'ONBOARDING', verification: 'EBW', attestation: 'a.b.c', companyRoles: ['ACTIVE_PARTICIPANT'] });
    expect(result).toMatchObject({ status: 'repeated', application: { attestation: { attestationId: EBW_WIRE.attestation.attestationId }, comparison: EBW_WIRE.comparison } });
  });

  it('fills the members the module left out with null', async () => {
    const { module } = moduleAnswering({ status: 201, body: MINIMAL_WIRE });
    const result = await module.createApplication.execute(input);
    expect(result).toMatchObject({
      status: 'created',
      application: {
        companyData: { shortName: null, address: { streetNumber: null, postalCode: null, region: null } },
        attestation: null,
        representationDeclared: null,
        declineReason: null,
        changedAt: MINIMAL_WIRE.createdAt,
        submittedAt: null,
        withdrawnAt: null,
        closedAt: null,
        completedAt: null,
      },
    });
  });

  it.each([
    [problem(409, 'open-application-exists', { existingApplicationId: APP }), { status: 'open-application-exists', existingApplicationId: APP }],
    [problem(400, 'attestation-invalid', { reason: 'client' }), { status: 'attestation-invalid', reason: 'client' }],
    [problem(400, 'attestation-mismatch', { fields: ['EBWOID'] }), { status: 'attestation-mismatch', fields: ['EBWOID'] }],
    [problem(400, 'validation', { errors: [{ field: 'identifiers[0]', message: 'VAT_ID has an invalid format for country DE' }] }), { status: 'validation', errors: [{ field: 'identifiers[0]', message: 'VAT_ID has an invalid format for country DE' }] }],
    [problem(403, 'account-bound'), { status: 'account-bound' }],
  ])('keeps the extension fields of a Problem Details answer (%#)', async (answer, expected) => {
    const { module } = moduleAnswering(answer);
    expect(await module.createApplication.execute(input)).toEqual(expected);
  });

  it('reports what is not a 4xx problem of the module as failed, with status and type', async () => {
    const { module } = moduleAnswering(
      { status: 502, body: { type: 'urn:c1-m2:problem:upstream-error', title: 'upstream error', status: 502 } },
      { status: 403, body: { type: 'urn:dev-bff:problem:csrf', title: 'csrf', status: 403 } },
    );
    expect(await module.createApplication.execute(input)).toEqual({ status: 'failed', error: { status: 502, problemType: 'urn:c1-m2:problem:upstream-error', message: 'upstream error' } });
    expect(await module.createApplication.execute(input)).toEqual({ status: 'failed', error: { status: 403, problemType: 'urn:dev-bff:problem:csrf', message: 'csrf' } });
  });

  it('lists with the status repeated, page and size', async () => {
    const summary = { id: APP, companyId: DOCUMENTS_WIRE.companyId, kind: 'ONBOARDING', existingCompany: false, verification: 'DOCUMENTS', status: 'SUBMITTED', legalName: 'Beispiel Maschinenbau GmbH', countryCode: 'DE', companyRoles: ['ACTIVE_PARTICIPANT'], createdAt: DOCUMENTS_WIRE.createdAt };
    const { module, sent } = moduleAnswering({ status: 200, body: { items: [summary], page: 0, size: 20, total: 1 } }, { status: 200, body: { items: [], page: 0, size: 20, total: 0 } });
    expect(await module.listOwnApplications.execute({ status: ['CREATED', 'SUBMITTED'], page: 0, size: 20 })).toEqual({
      status: 'found',
      page: { items: [{ ...summary, submittedAt: null }], page: 0, size: 20, total: 1 },
    });
    expect(sent().url.pathname + sent().url.search).toBe(`${BASE}/applications?status=CREATED&status=SUBMITTED&page=0&size=20`);
    await module.listOwnApplications.execute({ status: [] });
    expect(sent(1).url.search).toBe('');
  });

  it('reads one application with its reviewStatus, and maps 404 to not-found', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: EBW_WIRE }, problem(404, 'not-found'));
    expect(await module.getOwnApplication.execute(APP)).toEqual({ status: 'found', application: EBW_WIRE });
    expect(sent().url.pathname).toBe(`${BASE}/applications/${APP}`);
    expect(await module.getOwnApplication.execute(APP)).toEqual({ status: 'not-found' });
  });

  it('maps a 404 that is no Problem Details of the module to not-found too, as the port defines it', async () => {
    const { module } = moduleAnswering({ status: 404, body: { detail: 'Not Found' } }, { status: 404, body: { detail: 'Not Found' } });
    expect(await module.getOwnApplication.execute(APP)).toEqual({ status: 'not-found' });
    expect(await module.deleteDocument.execute(APP, DOC)).toEqual({ status: 'not-found' });
  });

  it('PATCHes only the given members and keeps shortName null', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: DOCUMENTS_WIRE }, problem(409, 'invalid-state'));
    expect(await module.updateApplication.execute(APP, { shortName: null, companyRoles: ['ACTIVE_PARTICIPANT', 'APP_PROVIDER'] })).toMatchObject({ status: 'updated' });
    expect(sent().method).toBe('PATCH');
    expect(sent().url.pathname).toBe(`${BASE}/applications/${APP}`);
    expect(await sent().request.json()).toEqual({ shortName: null, companyRoles: ['ACTIVE_PARTICIPANT', 'APP_PROVIDER'] });
    expect(await module.updateApplication.execute(APP, { legalName: 'X GmbH' })).toEqual({ status: 'invalid-state' });
  });

  it('PUTs a new verification attestation', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: EBW_WIRE });
    expect(await module.replaceAttestation.execute(APP, 'a.b.c')).toMatchObject({ status: 'replaced' });
    expect(sent().method).toBe('PUT');
    expect(sent().url.pathname).toBe(`${BASE}/applications/${APP}/attestation`);
    expect(await sent().request.json()).toEqual({ attestation: 'a.b.c' });
  });

  it('submits the consents and the declaration of representation', async () => {
    const consents = [{ agreementKey: 'osp-terms', version: '1.0', language: 'de' as const }];
    const { module, sent } = moduleAnswering(
      { status: 200, body: { ...DOCUMENTS_WIRE, status: 'SUBMITTED' } },
      problem(400, 'documents-incomplete', { missingDocumentTypes: ['COMMERCIAL_REGISTER_EXTRACT'], representationDeclarationMissing: true }),
      problem(400, 'consents-incomplete', { missing: [{ agreementKey: 'security-regulations', version: '1.0' }] }),
    );
    expect(await module.submitApplication.execute(APP, { consents, representationDeclared: true })).toMatchObject({ status: 'submitted', application: { status: 'SUBMITTED' } });
    expect(sent().method).toBe('POST');
    expect(sent().url.pathname).toBe(`${BASE}/applications/${APP}/submit`);
    expect(await sent().request.json()).toEqual({ consents, representationDeclared: true });
    expect(await module.submitApplication.execute(APP, { consents })).toEqual({
      status: 'documents-incomplete',
      missingDocumentTypes: ['COMMERCIAL_REGISTER_EXTRACT'],
      representationDeclarationMissing: true,
    });
    expect(await module.submitApplication.execute(APP, { consents })).toEqual({ status: 'consents-incomplete', missing: [{ agreementKey: 'security-regulations', version: '1.0' }] });
  });

  it('withdraws without a body, and reports a decided review', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: { ...DOCUMENTS_WIRE, status: 'WITHDRAWN' } }, problem(409, 'already-decided', { reviewStatus: 'APPROVED' }));
    expect(await module.withdrawApplication.execute(APP)).toMatchObject({ status: 'withdrawn', application: { status: 'WITHDRAWN' } });
    expect(sent().method).toBe('POST');
    expect(sent().url.pathname).toBe(`${BASE}/applications/${APP}/withdraw`);
    expect(await sent().request.text()).toBe('');
    expect(await module.withdrawApplication.execute(APP)).toEqual({ status: 'already-decided', reviewStatus: 'APPROVED' });
  });
});

describe('supporting documents over HTTP', () => {
  it('uploads multipart/form-data with the parts file (with its name) and documentType', async () => {
    const { module, sent } = moduleAnswering({ status: 201, body: DOCUMENT_WIRE });
    const file = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    expect(await module.uploadDocument.execute(APP, { file, fileName: DOCUMENT_WIRE.fileName, documentType: 'COMMERCIAL_REGISTER_EXTRACT' })).toEqual({ status: 'uploaded', document: DOCUMENT_WIRE });
    expect(sent().method).toBe('POST');
    expect(sent().url.pathname).toBe(`${BASE}/applications/${APP}/documents`);
    expect(sent().request.headers.get('content-type')).toMatch(/^multipart\/form-data; boundary=/);
    expect(sent().request.headers.get('X-CSRF-Token')).toBe('csrf-1');
    const form = await sent().request.formData();
    expect(form.get('documentType')).toBe('COMMERCIAL_REGISTER_EXTRACT');
    const part = form.get('file') as File;
    expect(part.name).toBe(DOCUMENT_WIRE.fileName);
    expect(part.type).toBe('application/pdf');
    expect(await part.text()).toBe('%PDF-1.4');
  });

  it('downloads the bytes with the content type and the file name of Content-Disposition', async () => {
    const { module, sent } = moduleAnswering(
      { status: 200, body: new Blob(['%PDF-1.4']), headers: { 'content-type': 'application/pdf', 'content-disposition': "attachment; filename*=UTF-8''Auszug%20M%C3%BCller.pdf" } },
      problem(404, 'not-found'),
    );
    const result = await module.getDocument.execute(APP, DOC);
    expect(result).toMatchObject({ status: 'found', contentType: 'application/pdf', fileName: 'Auszug Müller.pdf' });
    expect(result.status === 'found' && (await result.content.text())).toBe('%PDF-1.4');
    expect(sent().url.pathname).toBe(`${BASE}/applications/${APP}/documents/${DOC}`);
    expect(await module.getDocument.execute(APP, DOC)).toEqual({ status: 'not-found' });
  });

  it('deletes with 204, and maps 404 to not-found', async () => {
    const { module, sent } = moduleAnswering({ status: 204 }, problem(404, 'not-found'));
    expect(await module.deleteDocument.execute(APP, DOC)).toEqual({ status: 'deleted' });
    expect(sent().method).toBe('DELETE');
    expect(sent().url.pathname).toBe(`${BASE}/applications/${APP}/documents/${DOC}`);
    expect(await module.deleteDocument.execute(APP, DOC)).toEqual({ status: 'not-found' });
  });
});

describe('OSP staff over HTTP', () => {
  it('lists all applications with the repeated filters', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: { items: [], page: 1, size: 10, total: 0 } }, problem(403, 'forbidden'));
    const filter = { status: ['SUBMITTED'], kind: ['ONBOARDING', 'TRANSFER'], verification: ['DOCUMENTS'], companyId: DOCUMENTS_WIRE.companyId, page: 1, size: 10 } as const;
    expect(await module.listAllApplications.execute(filter)).toEqual({ status: 'found', page: { items: [], page: 1, size: 10, total: 0 } });
    expect(sent().url.pathname + sent().url.search).toBe(
      `${BASE}/osp/applications?status=SUBMITTED&kind=ONBOARDING&kind=TRANSFER&verification=DOCUMENTS&companyId=${DOCUMENTS_WIRE.companyId}&page=1&size=10`,
    );
    expect(await module.listAllApplications.execute()).toEqual({ status: 'forbidden' });
  });

  it('reads one application and its supporting document under /osp', async () => {
    const { module, sent } = moduleAnswering(
      { status: 200, body: { ...DOCUMENTS_WIRE, reviewStatus: 'OPEN' } },
      { status: 200, body: new Blob(['x']), headers: { 'content-type': 'image/png' } },
    );
    expect(await module.getAnyApplication.execute(APP)).toMatchObject({ status: 'found', application: { id: APP, reviewStatus: 'OPEN' } });
    expect(sent().url.pathname).toBe(`${BASE}/osp/applications/${APP}`);
    // without Content-Disposition the document id is the file name
    expect(await module.getAnyDocument.execute(APP, DOC)).toMatchObject({ status: 'found', contentType: 'image/png', fileName: DOC });
    expect(sent(1).url.pathname).toBe(`${BASE}/osp/applications/${APP}/documents/${DOC}`);
  });

  it('lists and creates versions of the terms', async () => {
    const { module, sent } = moduleAnswering({ status: 200, body: { items: [VERSION_WIRE], page: 0, size: 20, total: 1 } }, { status: 201, body: { ...VERSION_WIRE, version: '2.0' } }, problem(409, 'conflict'));
    expect(await module.listAgreementVersions.execute({ agreementKey: 'osp-terms', status: 'ACTIVE' })).toEqual({
      status: 'found',
      page: { items: [{ ...VERSION_WIRE, reconsentDueAt: null, createdBy: null }], page: 0, size: 20, total: 1 },
    });
    expect(sent().url.pathname + sent().url.search).toBe(`${BASE}/osp/agreements?agreementKey=osp-terms&status=ACTIVE`);
    const input = { agreementKey: 'osp-terms', version: '2.0', party: 'OSP', scope: 'ALL', title: VERSION_WIRE.title, documentUrls: VERSION_WIRE.documentUrls, reconsentRequired: false } as const;
    expect(await module.createAgreementVersion.execute(input)).toMatchObject({ status: 'created', version: { version: '2.0', status: 'ACTIVE' } });
    expect(sent(1).method).toBe('POST');
    expect(sent(1).url.pathname).toBe(`${BASE}/osp/agreements`);
    expect(await sent(1).request.json()).toEqual(input);
    expect(await module.createAgreementVersion.execute(input)).toEqual({ status: 'conflict' });
  });
});

describe('the wallet step outside mock mode', () => {
  it('fails without a request: no operation hands the verification attestation to the browser yet', async () => {
    const { module, sent } = moduleAnswering();
    expect(await module.requestAttestation.execute()).toMatchObject({ status: 'failed', error: { status: null, problemType: null } });
    expect(() => sent()).toThrow();
  });
});
