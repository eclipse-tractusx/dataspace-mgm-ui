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

import type { ApplicationWithReviewAnemic } from '../../anemics/application-with-review.anemic';
import type { AttestationSummaryAnemic } from '../../anemics/attestation-summary.anemic';
import { mockAttestation } from '../mock-attestation';
import { GIESSEREI_CLAIMS, GIESSEREI_COMPANY, MASCHINENBAU_CLAIMS, WERKZEUGBAU_CLAIMS, WERKZEUGBAU_COMPANY } from './companies.fixture';

/**
 * Ready-made applications for pages and tests. Application IDs are new test IDs (FRAMEWORK 7a lists none); companies,
 * persons and attestation data come from FRAMEWORK 7a and C1-M2 README 14. The fake derives the attestation claims of a
 * preloaded application from its data, so every application here keeps the comparison consistent with its data.
 */

const ISSUER = 'https://ebw-connector.example.org';
const REPRESENTATION = {
  confirmed: true,
  result: 'CONFIRMED',
  type: 'legal_representative',
  role: 'Geschäftsführerin',
  validUntil: '2027-12-31',
  issuer: 'https://register.test.example.org',
  trust: 'trust_list',
} as const;

/** Content of the mock PDF of the fixture documents (the fake serves it on download). */
export const MOCK_PDF_CONTENT = '%PDF-1.7\n% Mock commercial register extract of Beispiel Logistik GmbH\n%%EOF\n';
const MOCK_PDF_SHA256 = '593257d26f625690bd589c850210c636caaba218b351ac6935e2aa2f9f476b5f';

/** The verification attestation of C1-M2 README 14.4 (iat 28 Oct 2026 08:00 UTC, exp 27 Nov 2026 08:00 UTC). */
const ERIKA_ATTESTATION_SUMMARY: AttestationSummaryAnemic = {
  attestationId: '3f6c1e2a-7b4d-4e8f-9a51-2c0d6b8e4f17',
  issuer: ISSUER,
  issuedAt: '2026-10-28T08:00:00.000Z',
  expiresAt: '2026-11-27T08:00:00.000Z',
  verifiedAt: '2026-10-28T08:00:00.000Z',
  person: { givenName: 'Erika', familyName: 'Mustermann' },
  representation: REPRESENTATION,
};

/** The compact JWS behind ERIKA_APPLICATION_CREATED: sent again it is a repetition (`repeated`). */
export const ERIKA_ATTESTATION = mockAttestation({
  jti: '3f6c1e2a-7b4d-4e8f-9a51-2c0d6b8e4f17',
  iat: 1793174400,
  exp: 1795766400,
  verified_at: 1793174400,
  company: MASCHINENBAU_CLAIMS,
});

/** Erika Mustermann's application for Beispiel Maschinenbau GmbH, EBW, created: everything from the attestation. */
export const ERIKA_APPLICATION_CREATED: ApplicationWithReviewAnemic = {
  id: 'a0000001-0000-4000-8000-000000000001',
  companyId: 'c0000001-0000-4000-8000-000000000001',
  kind: 'ONBOARDING',
  existingCompany: false,
  verification: 'EBW',
  applicant: { sub: '5a1c0001-0000-4000-8000-000000000001', givenName: 'Erika', familyName: 'Mustermann' },
  status: 'CREATED',
  companyData: {
    legalName: 'Beispiel Maschinenbau GmbH',
    shortName: 'Beispiel Maschinenbau',
    address: { streetName: 'Musterstraße', streetNumber: '1', postalCode: '70569', city: 'Stuttgart', region: null, countryCode: 'DE' },
    identifiers: [
      { type: 'EBWOID', value: 'EBWOID-DE-0000000001', source: 'ATTESTATION' },
      { type: 'EUID', value: 'DEXX001T.HRB100001', source: 'ATTESTATION' },
      { type: 'VAT_ID', value: 'DE123456789', source: 'APPLICANT' },
    ],
  },
  companyRoles: ['ACTIVE_PARTICIPANT'],
  attestation: ERIKA_ATTESTATION_SUMMARY,
  comparison: [
    { field: 'EBWOID', result: 'FROM_ATTESTATION' },
    { field: 'EUID', result: 'FROM_ATTESTATION' },
    { field: 'COUNTRY', result: 'FROM_ATTESTATION' },
    { field: 'LEGAL_NAME', result: 'FROM_ATTESTATION' },
    { field: 'STREET', result: 'FROM_ATTESTATION' },
    { field: 'POSTAL_CODE', result: 'FROM_ATTESTATION' },
    { field: 'CITY', result: 'FROM_ATTESTATION' },
  ],
  documents: [],
  representationDeclared: null,
  consents: [],
  declineReason: null,
  createdAt: '2026-10-28T08:05:00.000Z',
  changedAt: '2026-10-28T08:05:00.000Z',
  submittedAt: null,
  withdrawnAt: null,
  closedAt: null,
  completedAt: null,
  reviewStatus: 'NONE',
};

/** The same application, submitted with the consents of README 14.4; the review case is open. */
export const ERIKA_APPLICATION_SUBMITTED: ApplicationWithReviewAnemic = {
  ...ERIKA_APPLICATION_CREATED,
  status: 'SUBMITTED',
  consents: [
    { agreementKey: 'osp-terms', version: '1.0', language: 'de', givenAt: '2026-10-28T08:20:00.000Z' },
    { agreementKey: 'terms-active-participant', version: '1.0', language: 'de', givenAt: '2026-10-28T08:20:00.000Z' },
    { agreementKey: 'security-regulations', version: '1.0', language: 'en', givenAt: '2026-10-28T08:20:00.000Z' },
  ],
  changedAt: '2026-10-28T08:20:00.000Z',
  submittedAt: '2026-10-28T08:20:00.000Z',
  reviewStatus: 'OPEN',
};

/** The same application after approval and `complete-application`: the company is active. */
export const ERIKA_APPLICATION_COMPLETED: ApplicationWithReviewAnemic = {
  ...ERIKA_APPLICATION_SUBMITTED,
  status: 'COMPLETED',
  changedAt: '2026-11-02T10:00:00.000Z',
  completedAt: '2026-11-02T10:00:00.000Z',
  reviewStatus: 'APPROVED',
};

/** Hans Beispiel's application for Beispiel Logistik GmbH without Business Wallet, with a register extract. */
export const HANS_APPLICATION_DOCUMENTS: ApplicationWithReviewAnemic = {
  id: 'a0000002-0000-4000-8000-000000000002',
  companyId: 'c0000002-0000-4000-8000-000000000002',
  kind: 'ONBOARDING',
  existingCompany: false,
  verification: 'DOCUMENTS',
  applicant: { sub: '5a1c0003-0000-4000-8000-000000000003', givenName: 'Hans', familyName: 'Beispiel' },
  status: 'CREATED',
  companyData: {
    legalName: 'Beispiel Logistik GmbH',
    shortName: null,
    address: { streetName: 'Hafenstraße', streetNumber: '5', postalCode: '68159', city: 'Mannheim', region: 'BW', countryCode: 'DE' },
    identifiers: [
      { type: 'COMMERCIAL_REG_NUMBER', value: 'HRB 200002', source: 'APPLICANT' },
      { type: 'VAT_ID', value: 'DE987654321', source: 'APPLICANT' },
    ],
  },
  companyRoles: ['ACTIVE_PARTICIPANT'],
  attestation: null,
  comparison: [],
  documents: [
    {
      documentId: 'd0000002-0000-4000-8000-000000000001',
      documentType: 'COMMERCIAL_REGISTER_EXTRACT',
      fileName: 'handelsregisterauszug-hrb-200002.pdf',
      contentType: 'application/pdf',
      sizeBytes: 76,
      sha256: MOCK_PDF_SHA256,
      uploadedAt: '2026-11-03T09:10:00.000Z',
    },
  ],
  representationDeclared: null,
  consents: [],
  declineReason: null,
  createdAt: '2026-11-03T09:00:00.000Z',
  changedAt: '2026-11-03T09:10:00.000Z',
  submittedAt: null,
  withdrawnAt: null,
  closedAt: null,
  completedAt: null,
  reviewStatus: 'NONE',
};

/** An earlier application of Hans Beispiel, declined by OSP staff (`close-application` with the reason). */
export const HANS_APPLICATION_DECLINED: ApplicationWithReviewAnemic = {
  ...HANS_APPLICATION_DOCUMENTS,
  id: 'a0000003-0000-4000-8000-000000000003',
  companyId: 'c1a00003-0000-4000-8000-000000000003',
  status: 'DECLINED',
  documents: [],
  representationDeclared: true,
  consents: [
    { agreementKey: 'osp-terms', version: '1.0', language: 'de', givenAt: '2026-10-20T14:00:00.000Z' },
    { agreementKey: 'terms-active-participant', version: '1.0', language: 'de', givenAt: '2026-10-20T14:00:00.000Z' },
    { agreementKey: 'security-regulations', version: '1.0', language: 'en', givenAt: '2026-10-20T14:00:00.000Z' },
  ],
  declineReason: 'The commercial register extract does not name the applicant as a representative.',
  createdAt: '2026-10-20T13:30:00.000Z',
  changedAt: '2026-10-22T09:00:00.000Z',
  submittedAt: '2026-10-20T14:00:00.000Z',
  closedAt: '2026-10-22T09:00:00.000Z',
  reviewStatus: 'DECLINED',
};

/** The compact JWS behind MAX_APPLICATION_REACTIVATION (Max Mustermann for Beispiel Werkzeugbau GmbH). */
export const MAX_WERKZEUGBAU_ATTESTATION = mockAttestation({
  jti: '7d0c2b3e-1f4a-4c6b-9e8d-5a2b1c0d3e04',
  iat: 1793779200,
  exp: 1796371200,
  verified_at: 1793779200,
  person: { given_name: 'Max', family_name: 'Mustermann' },
  company: WERKZEUGBAU_CLAIMS,
});

/** Max Mustermann reactivates Beispiel Werkzeugbau GmbH (deactivated, README 14.5); roles taken from C3-M1. */
export const MAX_APPLICATION_REACTIVATION: ApplicationWithReviewAnemic = {
  id: 'a0000004-0000-4000-8000-000000000004',
  companyId: WERKZEUGBAU_COMPANY.id,
  kind: 'REACTIVATION',
  existingCompany: true,
  verification: 'EBW',
  applicant: { sub: '5a1c0002-0000-4000-8000-000000000002', givenName: 'Max', familyName: 'Mustermann' },
  status: 'CREATED',
  companyData: {
    legalName: 'Beispiel Werkzeugbau GmbH',
    shortName: null,
    address: { streetName: 'Werkstraße', streetNumber: '3', postalCode: '20095', city: 'Hamburg', region: null, countryCode: 'DE' },
    identifiers: [
      { type: 'EBWOID', value: 'EBWOID-DE-0000000003', source: 'ATTESTATION' },
      { type: 'EUID', value: 'DEXX001T.HRB100003', source: 'ATTESTATION' },
    ],
  },
  companyRoles: ['ACTIVE_PARTICIPANT'],
  attestation: {
    attestationId: '7d0c2b3e-1f4a-4c6b-9e8d-5a2b1c0d3e04',
    issuer: ISSUER,
    issuedAt: '2026-11-04T08:00:00.000Z',
    expiresAt: '2026-12-04T08:00:00.000Z',
    verifiedAt: '2026-11-04T08:00:00.000Z',
    person: { givenName: 'Max', familyName: 'Mustermann' },
    representation: REPRESENTATION,
  },
  comparison: [
    { field: 'EBWOID', result: 'FROM_ATTESTATION' },
    { field: 'EUID', result: 'FROM_ATTESTATION' },
    { field: 'COUNTRY', result: 'FROM_ATTESTATION' },
    { field: 'LEGAL_NAME', result: 'FROM_ATTESTATION' },
    { field: 'STREET', result: 'FROM_ATTESTATION' },
    { field: 'POSTAL_CODE', result: 'FROM_ATTESTATION' },
    { field: 'CITY', result: 'FROM_ATTESTATION' },
  ],
  documents: [],
  representationDeclared: null,
  consents: [],
  declineReason: null,
  createdAt: '2026-11-04T08:10:00.000Z',
  changedAt: '2026-11-04T08:10:00.000Z',
  submittedAt: null,
  withdrawnAt: null,
  closedAt: null,
  completedAt: null,
  reviewStatus: 'NONE',
};

/** The compact JWS behind MAX_APPLICATION_TRANSFER_RETURN (Beispiel Gießerei GmbH, no address claim). */
export const MAX_GIESSEREI_ATTESTATION = mockAttestation({
  jti: '2a9e4f61-8b3c-4d7e-a1f0-6c5b4a3d2e05',
  iat: 1793779200,
  exp: 1796371200,
  verified_at: 1793779200,
  person: { given_name: 'Max', family_name: 'Mustermann' },
  company: GIESSEREI_CLAIMS,
});

/**
 * Return of Beispiel Gießerei GmbH (TRANSFER with reference, README 6.2), submitted, review open. The attestation has
 * no address, so the person gave it (fictitious mock address: the test data have none). An alternative to
 * MAX_APPLICATION_REACTIVATION: do not load both, a person has at most one open application.
 */
export const MAX_APPLICATION_TRANSFER_RETURN: ApplicationWithReviewAnemic = {
  ...MAX_APPLICATION_REACTIVATION,
  id: 'a0000005-0000-4000-8000-000000000005',
  companyId: GIESSEREI_COMPANY.id,
  kind: 'TRANSFER',
  status: 'SUBMITTED',
  companyData: {
    legalName: 'Beispiel Gießerei GmbH',
    shortName: null,
    address: { streetName: 'Gießereistraße', streetNumber: '4', postalCode: '70173', city: 'Stuttgart', region: null, countryCode: 'DE' },
    identifiers: [
      { type: 'EBWOID', value: 'EBWOID-DE-0000000004', source: 'ATTESTATION' },
      { type: 'EUID', value: 'DEXX001T.HRB100004', source: 'ATTESTATION' },
    ],
  },
  companyRoles: ['ACTIVE_PARTICIPANT', 'APP_PROVIDER'],
  attestation: { ...(MAX_APPLICATION_REACTIVATION.attestation as AttestationSummaryAnemic), attestationId: '2a9e4f61-8b3c-4d7e-a1f0-6c5b4a3d2e05' },
  comparison: [
    { field: 'EBWOID', result: 'FROM_ATTESTATION' },
    { field: 'EUID', result: 'FROM_ATTESTATION' },
    { field: 'COUNTRY', result: 'MATCH' },
    { field: 'LEGAL_NAME', result: 'FROM_ATTESTATION' },
    { field: 'STREET', result: 'NOT_IN_ATTESTATION' },
    { field: 'POSTAL_CODE', result: 'NOT_IN_ATTESTATION' },
    { field: 'CITY', result: 'NOT_IN_ATTESTATION' },
  ],
  consents: [
    { agreementKey: 'osp-terms', version: '1.0', language: 'en', givenAt: '2026-11-04T08:30:00.000Z' },
    { agreementKey: 'terms-active-participant', version: '1.0', language: 'en', givenAt: '2026-11-04T08:30:00.000Z' },
    { agreementKey: 'security-regulations', version: '1.0', language: 'en', givenAt: '2026-11-04T08:30:00.000Z' },
    { agreementKey: 'terms-app-provider', version: '1.0', language: 'en', givenAt: '2026-11-04T08:30:00.000Z' },
  ],
  changedAt: '2026-11-04T08:30:00.000Z',
  submittedAt: '2026-11-04T08:30:00.000Z',
  reviewStatus: 'OPEN',
};

/**
 * The applications of mock mode: Erika and Lieschen start without one (scenario 1), Hans has a declined and an open
 * one (DOCUMENTS), Max reactivates Beispiel Werkzeugbau GmbH.
 */
export const MOCK_MODE_APPLICATIONS: ReadonlyArray<ApplicationWithReviewAnemic> = [
  HANS_APPLICATION_DOCUMENTS,
  HANS_APPLICATION_DECLINED,
  MAX_APPLICATION_REACTIVATION,
];
