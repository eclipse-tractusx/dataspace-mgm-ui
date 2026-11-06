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

import type { AddressAnemic } from '../anemics/address.anemic';
import type { ChangeRequestAnemic } from '../anemics/change-request.anemic';
import type { CompanyDetailAnemic } from '../anemics/company-detail.anemic';
import type { CompanyRoleStateAnemic } from '../anemics/company-role-state.anemic';
import type { IdentifierAnemic } from '../anemics/identifier.anemic';
import type { IdentifierType } from '../data/c3-m1-values.data';

/**
 * Test data of the participant management, copied from mockups/participants/shared/data.js (FRAMEWORK 7a persons,
 * C3-M1 14 companies). Only for tests and mock mode (`@dataspace-mgm/c3-m1-core/testing`).
 */
export const COMPANY_IDS = {
  osp: '11111111-1111-4111-8111-111111111111',
  u1: 'c0000001-0000-4000-8000-000000000001',
  u2: 'c0000002-0000-4000-8000-000000000002',
  u3: 'c0000003-0000-4000-8000-000000000003',
  u4: 'c0000004-0000-4000-8000-000000000004',
} as const;

/** `sub` of the test persons (persons-osp-a.json). */
export const PERSON_IDS = {
  erika: '5a1c0001-0000-4000-8000-000000000001',
  max: '5a1c0002-0000-4000-8000-000000000002',
  hans: '5a1c0003-0000-4000-8000-000000000003',
  lieschen: '5a1c0004-0000-4000-8000-000000000004',
  otto: '5a1c0012-0000-4000-8000-000000000012',
  rolf: 'bbede0f3-fbc4-433b-b7ca-1982e8724912',
  renate: 'ed9d901d-cdc3-4a86-8ab4-0b477318506c',
} as const;

const declared = (type: IdentifierType, value: string): IdentifierAnemic => ({ type, value, source: 'DECLARED', verified: false });
const wallet = (type: IdentifierType, value: string): IdentifierAnemic => ({ type, value, source: 'BUSINESS_WALLET', verified: true });

type CompanyInput = Omit<CompanyDetailAnemic, 'address' | 'postalAddress'> & { postalAddress: AddressAnemic };

/** Builds the one-line address of the anemic from its parts, as the mapper does. */
export function company(input: CompanyInput): CompanyDetailAnemic {
  const { postalAddress } = input;
  return {
    ...input,
    address: {
      street: [postalAddress.street, postalAddress.houseNumber].filter(Boolean).join(' '),
      city: [postalAddress.postalCode, postalAddress.city].filter(Boolean).join(' '),
      countryCode: postalAddress.countryCode,
    },
  };
}

const record = {
  changedAt: null,
  applicationId: null,
  verificationRef: null,
  bpnAssignedAt: null,
  deactivationReason: null,
  rejectedAt: null,
  deactivatedAt: null,
  reactivatedAt: null,
  openChangeRequestId: null,
} as const;

export const BEISPIEL_MASCHINENBAU: CompanyDetailAnemic = company({
  ...record,
  id: COMPANY_IDS.u1,
  name: 'Beispiel Maschinenbau GmbH',
  shortName: 'Beispiel Maschinenbau',
  postalAddress: { street: 'Musterstraße', houseNumber: '1', addressAddition: null, postalCode: '70569', city: 'Stuttgart', region: 'BW', countryCode: 'DE' },
  identifiers: [wallet('EBWOID', 'EBWOID-DE-0000000001'), wallet('EUID', 'DEXX001T.HRB100001'), declared('VAT_ID', 'DE123456789')],
  coreDataSource: 'EBW',
  coreDataVerifiedAt: '2026-11-02T09:14:00Z',
  bpn: 'BPNLIUK2REMLK3F4',
  status: 'ACTIVE',
  companyRoles: ['ACTIVE_PARTICIPANT'],
  dataspaceName: 'Catena-X',
  createdAt: '2026-11-02T09:20:00Z',
  changedAt: '2026-11-05T14:02:00Z',
  activatedAt: '2026-11-03T10:05:00Z',
  applicationId: 'a0000001-0000-4000-8000-000000000001',
  verificationRef: '3f6c1e2a-7b4d-4e8f-9a51-2c0d6b8e4f17',
  bpnAssignedAt: '2026-11-03T09:58:00Z',
  openChangeRequestId: 'e0000001-0000-4000-8000-000000000001',
});

export const BEISPIEL_LOGISTIK: CompanyDetailAnemic = company({
  ...record,
  id: COMPANY_IDS.u2,
  name: 'Beispiel Logistik GmbH',
  shortName: null,
  postalAddress: { street: 'Hafenstraße', houseNumber: '5', addressAddition: null, postalCode: '68159', city: 'Mannheim', region: 'BW', countryCode: 'DE' },
  identifiers: [declared('COMMERCIAL_REG_NUMBER', 'HRB 200002'), declared('VAT_ID', 'DE987654321')],
  coreDataSource: 'MANUAL',
  coreDataVerifiedAt: '2026-11-04T11:30:00Z',
  bpn: 'BPNL00000000U2LG',
  status: 'ACTIVE',
  companyRoles: ['ACTIVE_PARTICIPANT'],
  dataspaceName: 'Catena-X',
  createdAt: '2026-11-03T08:41:00Z',
  changedAt: '2026-11-04T11:30:00Z',
  activatedAt: '2026-11-04T11:30:00Z',
  applicationId: 'a0000002-0000-4000-8000-000000000002',
  bpnAssignedAt: '2026-11-04T11:12:00Z',
  openChangeRequestId: 'e0000002-0000-4000-8000-000000000002',
});

export const OHNE_ZUSTIMMUNG: CompanyDetailAnemic = company({
  ...record,
  id: COMPANY_IDS.u3,
  name: 'Ohne Zustimmung GmbH',
  shortName: null,
  postalAddress: { street: 'Ringstraße', houseNumber: '3', addressAddition: null, postalCode: '76131', city: 'Karlsruhe', region: null, countryCode: 'DE' },
  identifiers: [declared('VAT_ID', 'DE111111111')],
  coreDataSource: 'MANUAL',
  coreDataVerifiedAt: null,
  bpn: 'BPNL00000000U3OZ',
  status: 'REQUESTED',
  companyRoles: [],
  dataspaceName: 'Catena-X',
  createdAt: '2026-11-05T15:10:00Z',
  changedAt: '2026-11-05T16:02:00Z',
  activatedAt: null,
  applicationId: 'a0000003-0000-4000-8000-000000000003',
  bpnAssignedAt: '2026-11-05T16:02:00Z',
});

export const ANDERE_BEISPIEL: CompanyDetailAnemic = company({
  ...record,
  id: COMPANY_IDS.u4,
  name: 'Andere Beispiel AG',
  shortName: null,
  postalAddress: { street: 'Beispielweg', houseNumber: '2', addressAddition: null, postalCode: '80331', city: 'München', region: 'BY', countryCode: 'DE' },
  identifiers: [wallet('EBWOID', 'EBWOID-DE-0000000002')],
  coreDataSource: 'EBW',
  coreDataVerifiedAt: '2026-11-05T10:22:00Z',
  bpn: 'BPNL00000000002B',
  status: 'ACTIVE',
  companyRoles: ['ACTIVE_PARTICIPANT'],
  dataspaceName: 'Catena-X',
  createdAt: '2026-11-05T10:31:00Z',
  changedAt: '2026-11-05T13:47:00Z',
  activatedAt: '2026-11-05T13:47:00Z',
  applicationId: 'a0000008-0000-4000-8000-000000000008',
  verificationRef: '9b2d4f61-3c8e-4a17-b5d0-7e1f2a6c8d93',
  bpnAssignedAt: '2026-11-05T13:20:00Z',
});

export const OSP_A_DETAIL: CompanyDetailAnemic = company({
  ...record,
  id: COMPANY_IDS.osp,
  name: 'OSP A Beispiel GmbH',
  shortName: 'OSP A',
  postalAddress: { street: 'Am Prüfstand', houseNumber: '1', addressAddition: null, postalCode: '70569', city: 'Stuttgart', region: 'BW', countryCode: 'DE' },
  identifiers: [declared('VAT_ID', 'DE222222222')],
  coreDataSource: 'MANUAL',
  coreDataVerifiedAt: '2026-11-01T07:00:00Z',
  bpn: 'BPNL00000000OSPA',
  status: 'ACTIVE',
  companyRoles: ['ONBOARDING_SERVICE_PROVIDER', 'ACTIVE_PARTICIPANT', 'APP_PROVIDER', 'SERVICE_PROVIDER'],
  dataspaceName: 'Catena-X',
  createdAt: '2026-11-01T07:00:00Z',
  changedAt: '2026-11-05T09:12:00Z',
  activatedAt: '2026-11-01T07:00:00Z',
  bpnAssignedAt: '2026-11-01T07:00:00Z',
});

export const COMPANIES: ReadonlyArray<CompanyDetailAnemic> = [ANDERE_BEISPIEL, OHNE_ZUSTIMMUNG, BEISPIEL_LOGISTIK, BEISPIEL_MASCHINENBAU, OSP_A_DETAIL];

const document = (id: string, fileName: string, mediaType: 'application/pdf' | 'image/png' | 'image/jpeg', sizeBytes: number) => ({ id, fileName, mediaType, sizeBytes });

export const CHANGE_REQUESTS: ReadonlyArray<ChangeRequestAnemic> = [
  {
    id: 'e0000001-0000-4000-8000-000000000001',
    companyId: COMPANY_IDS.u1,
    companyName: 'Beispiel Maschinenbau GmbH',
    status: 'OPEN',
    changes: { identifiers: [{ type: 'VAT_ID', value: 'DE123456789' }, { type: 'LEI_CODE', value: '529900T8BM49AURSDO55' }] },
    comment: 'We add our LEI. The LEI certificate of the Global LEI Index is attached.',
    documents: [document('d0000001-0000-4000-8000-000000000001', 'lei-zertifikat.pdf', 'application/pdf', 184320)],
    requestedBy: PERSON_IDS.erika,
    decidedBy: null,
    decisionReason: null,
    createdAt: '2026-11-05T14:02:00Z',
    closedAt: null,
  },
  {
    id: 'e0000002-0000-4000-8000-000000000002',
    companyId: COMPANY_IDS.u2,
    companyName: 'Beispiel Logistik GmbH',
    status: 'OPEN',
    changes: { name: 'Beispiel Logistik SE' },
    comment: 'Change of the legal form to an SE, entered in the commercial register on 28 October 2026.',
    documents: [
      document('d0000002-0000-4000-8000-000000000002', 'auszug.pdf', 'application/pdf', 312004),
      document('d0000003-0000-4000-8000-000000000003', 'gesellschafterbeschluss.png', 'image/png', 902144),
    ],
    requestedBy: PERSON_IDS.hans,
    decidedBy: null,
    decisionReason: null,
    createdAt: '2026-11-04T16:45:00Z',
    closedAt: null,
  },
  {
    id: 'e0000003-0000-4000-8000-000000000003',
    companyId: COMPANY_IDS.u1,
    companyName: 'Beispiel Maschinenbau GmbH',
    status: 'DECLINED',
    changes: { identifiers: [{ type: 'VAT_ID', value: 'DE123456789' }, { type: 'LEI_CODE', value: '529900T8BM49AURSDO55' }] },
    comment: 'We add our LEI.',
    documents: [document('d0000004-0000-4000-8000-000000000004', 'auszug.pdf', 'application/pdf', 98112)],
    requestedBy: PERSON_IDS.erika,
    decidedBy: PERSON_IDS.rolf,
    decisionReason: 'The extract from the commercial register does not show the LEI. Please attach the LEI certificate.',
    createdAt: '2026-11-04T08:30:00Z',
    closedAt: '2026-11-04T13:15:00Z',
  },
  {
    id: 'e0000004-0000-4000-8000-000000000004',
    companyId: COMPANY_IDS.u1,
    companyName: 'Beispiel Maschinenbau GmbH',
    status: 'WITHDRAWN',
    changes: { identifiers: [{ type: 'VAT_ID', value: 'DE123456789' }, { type: 'EORI', value: 'DE1234567' }] },
    comment: 'We add our EORI number.',
    documents: [document('d0000005-0000-4000-8000-000000000005', 'eori-bescheid.jpg', 'image/jpeg', 441210)],
    requestedBy: PERSON_IDS.erika,
    decidedBy: null,
    decisionReason: null,
    createdAt: '2026-11-03T15:20:00Z',
    closedAt: '2026-11-03T15:41:00Z',
  },
  {
    id: 'e0000005-0000-4000-8000-000000000005',
    companyId: COMPANY_IDS.osp,
    companyName: 'OSP A Beispiel GmbH',
    status: 'APPROVED',
    changes: { identifiers: [{ type: 'VAT_ID', value: 'DE222222223' }] },
    comment: 'Our VAT ID was reissued after the merger of the tax units.',
    documents: [document('d0000006-0000-4000-8000-000000000006', 'ust-id-bescheid.pdf', 'application/pdf', 120876)],
    requestedBy: PERSON_IDS.otto,
    decidedBy: PERSON_IDS.rolf,
    decisionReason: null,
    createdAt: '2026-11-05T08:02:00Z',
    closedAt: '2026-11-05T09:12:00Z',
  },
];

const agreement = (agreementKey: string, name: string, documentUrl: string, consentedAt: string | null = null) => ({
  agreementKey,
  version: '1.0',
  name,
  documentUrl,
  consentStatus: consentedAt ? ('ACTIVE' as const) : null,
  consentedVersion: consentedAt ? '1.0' : null,
  consentedAt,
});

/** The company roles of Beispiel Maschinenbau GmbH (GET /companies/{id}/company-roles?lang=en). */
export const COMPANY_ROLE_STATES: ReadonlyArray<CompanyRoleStateAnemic> = [
  {
    companyRole: 'ACTIVE_PARTICIPANT',
    assignableBy: 'COMPANY',
    status: 'ACTIVE',
    description: 'Data provider, data consumer, app user',
    agreements: [
      agreement('terms-active-participant', 'Terms and conditions participant', 'https://dataspace.example.org/terms/active-participant-1.0-en.pdf', '2026-11-02T09:18:00Z'),
      agreement('security-regulations', 'Security regulations', 'https://dataspace.example.org/terms/security-1.0-en.pdf', '2026-11-02T09:18:00Z'),
    ],
  },
  {
    companyRole: 'APP_PROVIDER',
    assignableBy: 'COMPANY',
    status: 'NONE',
    description: 'Offers apps in the marketplace',
    agreements: [agreement('terms-app-provider', 'Terms and conditions app provider', 'https://dataspace.example.org/terms/app-provider-1.0-en.pdf')],
  },
  {
    companyRole: 'SERVICE_PROVIDER',
    assignableBy: 'COMPANY',
    status: 'NONE',
    description: 'Offers services in the marketplace',
    agreements: [agreement('terms-service-provider', 'Terms and conditions service provider', 'https://dataspace.example.org/terms/service-provider-1.0-en.pdf')],
  },
];
