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

// The data every screen of this mockup shows. Never invent people, companies or IDs:
// - persons, companies and IDs: FRAMEWORK 7a of portal-backend-spec ("Common test IDs") and the test data of
//   C3-M1 (README 14), C3-M2 (README 14), C1-M2 (14.3, terms) and C4-M2 (DID of the dataspace wallet);
// - the objects: the field names and enum values of the openapi.yaml schemas of C3-M1 (`Company`, `CompanyDetail`,
//   `CompanySummary`, `ChangeRequest`, `CompanyRoleState`) and C3-M2 (`CspRegistration`), camelCase as on the wire.
// The time is the hackathon week: today is 2026-11-06.
// The proof of concept turns these objects into the fixtures of the in-memory adapters of c3-m1-core and c3-m2-core.
(function () {
  'use strict';

  const ids = {
    osp: '11111111-1111-4111-8111-111111111111',
    u1: 'c0000001-0000-4000-8000-000000000001',
    u2: 'c0000002-0000-4000-8000-000000000002',
    u3: 'c0000003-0000-4000-8000-000000000003',
    u4: 'c0000004-0000-4000-8000-000000000004',
  };

  const persons = {
    erika: { id: '5a1c0001-0000-4000-8000-000000000001', name: 'Erika Mustermann', portalRoles: ['Company Admin'], companyId: ids.u1, note: 'Company Admin of Beispiel Maschinenbau GmbH (P1)' },
    max: { id: '5a1c0002-0000-4000-8000-000000000002', name: 'Max Mustermann', portalRoles: ['Member'], companyId: ids.u1, note: 'Member of Beispiel Maschinenbau GmbH, read only (P2)' },
    hans: { id: '5a1c0003-0000-4000-8000-000000000003', name: 'Hans Beispiel', portalRoles: ['Company Admin'], companyId: ids.u2, note: 'Company Admin of Beispiel Logistik GmbH (P3)' },
    lieschen: { id: '5a1c0004-0000-4000-8000-000000000004', name: 'Lieschen Müller', portalRoles: ['Applicant'], note: 'without a company, no permission of C3-M1 (P4)' },
    otto: { id: '5a1c0012-0000-4000-8000-000000000012', name: 'Otto Normalverbraucher', portalRoles: ['OSP Admin', 'Company Admin'], companyId: ids.osp, note: 'OSP Admin, also Company Admin of the OSP company (S2)' },
    rolf: { id: 'bbede0f3-fbc4-433b-b7ca-1982e8724912', name: 'Rolf Prüfer', portalRoles: ['OSP Reviewer'], note: 'OSP Reviewer (S1)' },
    renate: { id: 'ed9d901d-cdc3-4a86-8ab4-0b477318506c', name: 'Renate Prüfer', portalRoles: ['OSP Reviewer'], note: 'second OSP Reviewer (four-eyes principle)' },
  };

  /** Permissions of C3-M1 (README 6.8) and C3-M2 (README 6.3) per person, as GET /me would list them. */
  const permissions = {
    erika: ['view_company', 'edit_company', 'edit_company_roles'],
    max: ['view_company'],
    hans: ['view_company', 'edit_company', 'edit_company_roles'],
    lieschen: [],
    otto: ['view_companies', 'manage_companies', 'review_company_changes', 'view_company', 'edit_company', 'view_csp_registration'],
    rolf: ['view_companies', 'review_company_changes'],
    renate: ['view_companies', 'review_company_changes'],
  };

  const declared = (type, value) => ({ type, value, source: 'DECLARED' });
  const wallet = (type, value) => ({ type, value, source: 'BUSINESS_WALLET' });
  const role = (companyRole, status, activatedAt) => ({ companyRole, status, activatedAt: activatedAt || null, deactivatedAt: null });

  /** C3-M1 `CompanyDetail` (a superset of `Company`; people of the company get only the `Company` fields). */
  const companies = {
    [ids.u1]: {
      id: ids.u1,
      name: 'Beispiel Maschinenbau GmbH',
      shortName: 'Beispiel Maschinenbau',
      address: { street: 'Musterstraße', houseNumber: '1', addressAddition: null, postalCode: '70569', city: 'Stuttgart', region: 'BW', countryCode: 'DE' },
      identifiers: [wallet('EBWOID', 'EBWOID-DE-0000000001'), wallet('EUID', 'DEXX001T.HRB100001'), declared('VAT_ID', 'DE123456789')],
      coreDataSource: 'EBW',
      coreDataVerifiedAt: '2026-11-02T09:14:00Z',
      bpn: 'BPNLIUK2REMLK3F4',
      status: 'ACTIVE',
      companyRoles: [role('ACTIVE_PARTICIPANT', 'ACTIVE', '2026-11-03T10:05:00Z')],
      dataspaceName: 'Catena-X',
      createdAt: '2026-11-02T09:20:00Z',
      changedAt: '2026-11-05T14:02:00Z',
      activatedAt: '2026-11-03T10:05:00Z',
      applicationId: 'a0000001-0000-4000-8000-000000000001',
      verificationRef: '3f6c1e2a-7b4d-4e8f-9a51-2c0d6b8e4f17',
      bpnAssignedAt: '2026-11-03T09:58:00Z',
      deactivationReason: null,
      rejectedAt: null,
      deactivatedAt: null,
      reactivatedAt: null,
      openChangeRequestId: 'e0000001-0000-4000-8000-000000000001',
    },
    [ids.u2]: {
      id: ids.u2,
      name: 'Beispiel Logistik GmbH',
      shortName: null,
      address: { street: 'Hafenstraße', houseNumber: '5', addressAddition: null, postalCode: '68159', city: 'Mannheim', region: 'BW', countryCode: 'DE' },
      identifiers: [declared('COMMERCIAL_REG_NUMBER', 'HRB 200002'), declared('VAT_ID', 'DE987654321')],
      coreDataSource: 'MANUAL',
      coreDataVerifiedAt: '2026-11-04T11:30:00Z',
      bpn: 'BPNL00000000U2LG',
      status: 'ACTIVE',
      companyRoles: [role('ACTIVE_PARTICIPANT', 'ACTIVE', '2026-11-04T11:30:00Z')],
      dataspaceName: 'Catena-X',
      createdAt: '2026-11-03T08:41:00Z',
      changedAt: '2026-11-04T11:30:00Z',
      activatedAt: '2026-11-04T11:30:00Z',
      applicationId: 'a0000002-0000-4000-8000-000000000002',
      verificationRef: null,
      bpnAssignedAt: '2026-11-04T11:12:00Z',
      deactivationReason: null,
      rejectedAt: null,
      deactivatedAt: null,
      reactivatedAt: null,
      openChangeRequestId: 'e0000002-0000-4000-8000-000000000002',
    },
    [ids.u3]: {
      id: ids.u3,
      name: 'Ohne Zustimmung GmbH',
      shortName: null,
      address: { street: 'Ringstraße', houseNumber: '3', addressAddition: null, postalCode: '76131', city: 'Karlsruhe', region: null, countryCode: 'DE' },
      identifiers: [declared('VAT_ID', 'DE111111111')],
      coreDataSource: 'MANUAL',
      coreDataVerifiedAt: null,
      bpn: 'BPNL00000000U3OZ',
      status: 'REQUESTED',
      companyRoles: [role('ACTIVE_PARTICIPANT', 'REQUESTED')],
      dataspaceName: 'Catena-X',
      createdAt: '2026-11-05T15:10:00Z',
      changedAt: '2026-11-05T16:02:00Z',
      activatedAt: null,
      applicationId: 'a0000003-0000-4000-8000-000000000003',
      verificationRef: null,
      bpnAssignedAt: '2026-11-05T16:02:00Z',
      deactivationReason: null,
      rejectedAt: null,
      deactivatedAt: null,
      reactivatedAt: null,
      openChangeRequestId: null,
    },
    [ids.u4]: {
      id: ids.u4,
      name: 'Andere Beispiel AG',
      shortName: null,
      address: { street: 'Beispielweg', houseNumber: '2', addressAddition: null, postalCode: '80331', city: 'München', region: 'BY', countryCode: 'DE' },
      identifiers: [wallet('EBWOID', 'EBWOID-DE-0000000002')],
      coreDataSource: 'EBW',
      coreDataVerifiedAt: '2026-11-05T10:22:00Z',
      bpn: 'BPNL00000000002B',
      status: 'ACTIVE',
      companyRoles: [role('ACTIVE_PARTICIPANT', 'ACTIVE', '2026-11-05T13:47:00Z')],
      dataspaceName: 'Catena-X',
      createdAt: '2026-11-05T10:31:00Z',
      changedAt: '2026-11-05T13:47:00Z',
      activatedAt: '2026-11-05T13:47:00Z',
      applicationId: 'a0000008-0000-4000-8000-000000000008',
      verificationRef: '9b2d4f61-3c8e-4a17-b5d0-7e1f2a6c8d93',
      bpnAssignedAt: '2026-11-05T13:20:00Z',
      deactivationReason: null,
      rejectedAt: null,
      deactivatedAt: null,
      reactivatedAt: null,
      openChangeRequestId: null,
    },
    [ids.osp]: {
      id: ids.osp,
      name: 'OSP A Beispiel GmbH',
      shortName: 'OSP A',
      address: { street: 'Am Prüfstand', houseNumber: '1', addressAddition: null, postalCode: '70569', city: 'Stuttgart', region: 'BW', countryCode: 'DE' },
      identifiers: [declared('VAT_ID', 'DE222222222')],
      coreDataSource: 'MANUAL',
      coreDataVerifiedAt: '2026-11-01T07:00:00Z',
      bpn: 'BPNL00000000OSPA',
      status: 'ACTIVE',
      companyRoles: [
        role('ONBOARDING_SERVICE_PROVIDER', 'ACTIVE', '2026-11-01T07:00:00Z'),
        role('ACTIVE_PARTICIPANT', 'ACTIVE', '2026-11-01T07:00:00Z'),
        role('APP_PROVIDER', 'ACTIVE', '2026-11-01T07:00:00Z'),
        role('SERVICE_PROVIDER', 'ACTIVE', '2026-11-01T07:00:00Z'),
      ],
      dataspaceName: 'Catena-X',
      createdAt: '2026-11-01T07:00:00Z',
      changedAt: '2026-11-05T09:12:00Z',
      activatedAt: '2026-11-01T07:00:00Z',
      applicationId: null,
      verificationRef: null,
      bpnAssignedAt: '2026-11-01T07:00:00Z',
      deactivationReason: null,
      rejectedAt: null,
      deactivatedAt: null,
      reactivatedAt: null,
      openChangeRequestId: null,
    },
  };

  /** C3-M1 `ChangeRequest` (with `companyName` in the OSP list; `ChangeRequestDetail` adds the current company). */
  const changeRequests = [
    {
      id: 'e0000001-0000-4000-8000-000000000001',
      companyId: ids.u1,
      companyName: 'Beispiel Maschinenbau GmbH',
      status: 'OPEN',
      changes: { identifiers: [{ type: 'VAT_ID', value: 'DE123456789' }, { type: 'LEI_CODE', value: '529900T8BM49AURSDO55' }] },
      comment: 'We add our LEI. The LEI certificate of the Global LEI Index is attached.',
      documents: [{ id: 'd0000001-0000-4000-8000-000000000001', fileName: 'lei-zertifikat.pdf', mediaType: 'application/pdf', sizeBytes: 184320 }],
      requestedBy: persons.erika.id,
      decidedBy: null,
      decisionReason: null,
      createdAt: '2026-11-05T14:02:00Z',
      closedAt: null,
    },
    {
      id: 'e0000002-0000-4000-8000-000000000002',
      companyId: ids.u2,
      companyName: 'Beispiel Logistik GmbH',
      status: 'OPEN',
      changes: { name: 'Beispiel Logistik SE' },
      comment: 'Change of the legal form to an SE, entered in the commercial register on 28 October 2026.',
      documents: [
        { id: 'd0000002-0000-4000-8000-000000000002', fileName: 'auszug.pdf', mediaType: 'application/pdf', sizeBytes: 312004 },
        { id: 'd0000003-0000-4000-8000-000000000003', fileName: 'gesellschafterbeschluss.png', mediaType: 'image/png', sizeBytes: 902144 },
      ],
      requestedBy: persons.hans.id,
      decidedBy: null,
      decisionReason: null,
      createdAt: '2026-11-04T16:45:00Z',
      closedAt: null,
    },
    {
      id: 'e0000003-0000-4000-8000-000000000003',
      companyId: ids.u1,
      companyName: 'Beispiel Maschinenbau GmbH',
      status: 'DECLINED',
      changes: { identifiers: [{ type: 'VAT_ID', value: 'DE123456789' }, { type: 'LEI_CODE', value: '529900T8BM49AURSDO55' }] },
      comment: 'We add our LEI.',
      documents: [{ id: 'd0000004-0000-4000-8000-000000000004', fileName: 'auszug.pdf', mediaType: 'application/pdf', sizeBytes: 98112 }],
      requestedBy: persons.erika.id,
      decidedBy: persons.rolf.id,
      decisionReason: 'The extract from the commercial register does not show the LEI. Please attach the LEI certificate.',
      createdAt: '2026-11-04T08:30:00Z',
      closedAt: '2026-11-04T13:15:00Z',
    },
    {
      id: 'e0000004-0000-4000-8000-000000000004',
      companyId: ids.u1,
      companyName: 'Beispiel Maschinenbau GmbH',
      status: 'WITHDRAWN',
      changes: { identifiers: [{ type: 'VAT_ID', value: 'DE123456789' }, { type: 'EORI', value: 'DE1234567' }] },
      comment: 'We add our EORI number.',
      documents: [{ id: 'd0000005-0000-4000-8000-000000000005', fileName: 'eori-bescheid.jpg', mediaType: 'image/jpeg', sizeBytes: 441210 }],
      requestedBy: persons.erika.id,
      decidedBy: null,
      decisionReason: null,
      createdAt: '2026-11-03T15:20:00Z',
      closedAt: '2026-11-03T15:41:00Z',
    },
    {
      id: 'e0000005-0000-4000-8000-000000000005',
      companyId: ids.osp,
      companyName: 'OSP A Beispiel GmbH',
      status: 'APPROVED',
      changes: { identifiers: [{ type: 'VAT_ID', value: 'DE222222223' }] },
      comment: 'Our VAT ID was reissued after the merger of the tax units.',
      documents: [{ id: 'd0000006-0000-4000-8000-000000000006', fileName: 'ust-id-bescheid.pdf', mediaType: 'application/pdf', sizeBytes: 120876 }],
      requestedBy: persons.otto.id,
      decidedBy: persons.rolf.id,
      decisionReason: null,
      createdAt: '2026-11-05T08:02:00Z',
      closedAt: '2026-11-05T09:12:00Z',
    },
  ];

  /** Terms of the company roles (C1-M2 14.3), as C3-M1 returns them in `AgreementConsent`. */
  const agreement = (agreementKey, name, documentUrl, consentedAt) => ({
    agreementKey, version: '1.0', name, names: { en: name }, documentUrl,
    consentStatus: consentedAt ? 'ACTIVE' : null, consentedVersion: consentedAt ? '1.0' : null, consentedAt: consentedAt || null,
  });

  /** C3-M1 `CompanyRoleState` of Beispiel Maschinenbau GmbH (GET /companies/{id}/company-roles?lang=en). */
  const companyRoleStates = [
    {
      companyRole: 'ACTIVE_PARTICIPANT', assignableBy: 'COMPANY', status: 'ACTIVE',
      description: 'Data provider, data consumer, app user',
      agreements: [
        agreement('terms-active-participant', 'Terms and conditions participant', 'https://dataspace.example.org/terms/active-participant-1.0-en.pdf', '2026-11-02T09:18:00Z'),
        agreement('security-regulations', 'Security regulations', 'https://dataspace.example.org/terms/security-1.0-en.pdf', '2026-11-02T09:18:00Z'),
      ],
    },
    {
      companyRole: 'APP_PROVIDER', assignableBy: 'COMPANY', status: 'NONE',
      description: 'Offers apps in the marketplace',
      agreements: [agreement('terms-app-provider', 'Terms and conditions app provider', 'https://dataspace.example.org/terms/app-provider-1.0-en.pdf')],
    },
    {
      companyRole: 'SERVICE_PROVIDER', assignableBy: 'COMPANY', status: 'NONE',
      description: 'Offers services in the marketplace',
      agreements: [agreement('terms-service-provider', 'Terms and conditions service provider', 'https://dataspace.example.org/terms/service-provider-1.0-en.pdf')],
    },
  ];

  /** C3-M2 `CspRegistration` per company (GET /api/c3-m2/companies/{companyId}). */
  const cspRegistrations = {
    [ids.u1]: { companyId: ids.u1, bpn: 'BPNLIUK2REMLK3F4', status: 'REGISTERED', did: 'did:web:csp-wallet.example.org:BPNLIUK2REMLK3F4', membership: 'REGISTERED', registeredAt: '2026-11-03T09:57:00Z', updatedAt: '2026-11-03T10:03:00Z' },
    [ids.u2]: { companyId: ids.u2, bpn: 'BPNL00000000U2LG', status: 'REGISTERED', did: 'did:web:csp-wallet.example.org:BPNL00000000U2LG', membership: 'REGISTERED', registeredAt: '2026-11-04T11:11:00Z', updatedAt: '2026-11-04T11:28:00Z' },
    [ids.u3]: { companyId: ids.u3, bpn: 'BPNL00000000U3OZ', status: 'REGISTERED', membership: 'NONE', registeredAt: '2026-11-05T16:01:00Z', updatedAt: '2026-11-05T16:01:00Z' },
    [ids.u4]: { companyId: ids.u4, bpn: 'BPNL00000000002B', status: 'REGISTERED', did: 'did:web:csp-wallet.example.org:BPNL00000000002B', membership: 'REGISTERED', registeredAt: '2026-11-05T13:19:00Z', updatedAt: '2026-11-05T13:44:00Z' },
    [ids.osp]: { companyId: ids.osp, bpn: 'BPNL00000000OSPA', status: 'REGISTERED', membership: 'REGISTERED', registeredAt: '2026-11-01T07:00:00Z', updatedAt: '2026-11-01T07:00:00Z' },
  };

  /** Other states of a registration, for the state switcher of the CSP views (C3-M2 6.1, 12, 14). */
  const cspVariants = {
    pending: { companyId: ids.u2, status: 'PENDING', membership: 'NONE', updatedAt: '2026-11-04T11:02:00Z' },
    failed: { companyId: ids.u4, status: 'FAILED', failureReason: 'REGISTERED_AT_OTHER_OSP', membership: 'NONE', updatedAt: '2026-11-05T10:40:00Z' },
    transferredAway: { companyId: ids.u2, bpn: 'BPNL00000000U2LG', status: 'TRANSFERRED_AWAY', did: 'did:web:csp-wallet.example.org:BPNL00000000U2LG', membership: 'NONE', registeredAt: '2026-11-04T11:11:00Z', updatedAt: '2026-11-06T08:15:00Z' },
  };

  window.MOCK_DATA = {
    /** OSP A, the installation this mockup runs in (C3-M1 14, installation settings). */
    installation: { ospId: '22222222-2222-4222-8222-222222222222', name: 'OSP A', dataspace: 'Catena-X' },
    /** OSP B, the home OSP of Andere Beispiel AG before the transfer (C3-M2 14). */
    otherOsp: { ospId: '99a5685c-7397-402c-88de-b1b3a939ecc9', name: 'OSP B' },
    ids,
    persons,
    permissions,
    companies,
    changeRequests,
    companyRoleStates,
    cspRegistrations,
    cspVariants,
    /** Settings of the installation the UI cannot read today (open question): C3-M1 4, configuration. */
    settings: { changeRequestMaxDocuments: 3, changeRequestMaxDocumentBytes: 10485760, attestationMaxAgeHours: 24 },
  };
})();
