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
// - persons, companies and IDs: FRAMEWORK 7a of portal-backend-spec ("Common test IDs") and testdata/ of
//   dataspace-mgm-services (persons-osp-a.json, osp-a-company.json, applicant-companies.json);
// - the objects of the module: the field names and enum values of its openapi.yaml schemas (camelCase), with the
//   module's own test IDs from its README. A value the spec does not have goes into the hub as an open point.
// The proof of concept turns these objects into the fixtures of the core package's in-memory adapter.
window.MOCK_DATA = {
  /** OSP A, the installation this mockup runs in. */
  installation: { ospId: '22222222-2222-4222-8222-222222222222', name: 'OSP A' },

  /** Test persons (FRAMEWORK 7a; `pia` is scaffold test data). `id` is `sub` in the token. */
  persons: {
    erika: { id: '5a1c0001-0000-4000-8000-000000000001', name: 'Erika Mustermann', portalRoles: [], note: 'applicant, then Company Admin of Beispiel Maschinenbau GmbH' },
    max: { id: '5a1c0002-0000-4000-8000-000000000002', name: 'Max Mustermann', portalRoles: [], note: 'invited to Beispiel Maschinenbau GmbH by Erika' },
    hans: { id: '5a1c0003-0000-4000-8000-000000000003', name: 'Hans Beispiel', portalRoles: [], note: 'applicant, then Company Admin of Beispiel Logistik GmbH' },
    lieschen: { id: '5a1c0004-0000-4000-8000-000000000004', name: 'Lieschen Müller', portalRoles: [], note: 'without a company, only Applicant' },
    otto: { id: '5a1c0012-0000-4000-8000-000000000012', name: 'Otto Normalverbraucher', portalRoles: ['OSP Admin'], note: 'OSP Admin without a company' },
    rolf: { id: 'bbede0f3-fbc4-433b-b7ca-1982e8724912', name: 'Rolf Prüfer', portalRoles: ['OSP Reviewer'], note: 'OSP Reviewer' },
    renate: { id: 'ed9d901d-cdc3-4a86-8ab4-0b477318506c', name: 'Renate Prüfer', portalRoles: ['OSP Reviewer'], note: 'second OSP Reviewer (four-eyes principle)' },
    pia: { id: '5a1c0021-0000-4000-8000-000000000021', name: 'Pia Provider', portalRoles: ['Company Admin'], companyId: '11111111-1111-4111-8111-111111111111', note: 'Company Admin of the OSP company' },
  },

  /** Companies (FRAMEWORK 7a). */
  companies: {
    ospA: {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'OSP A Beispiel GmbH',
      bpn: 'BPNL00000000OSPA',
      status: 'ACTIVE',
      address: { street: 'Am Prüfstand 1', city: '70569 Stuttgart', countryCode: 'DE' },
      identifiers: [{ type: 'VAT_ID', value: 'DE222222222' }],
      companyRoles: ['ONBOARDING_SERVICE_PROVIDER', 'ACTIVE_PARTICIPANT', 'APP_PROVIDER', 'SERVICE_PROVIDER'],
    },
    maschinenbau: {
      id: 'c0000001-0000-4000-8000-000000000001',
      name: 'Beispiel Maschinenbau GmbH',
      bpn: 'BPNLIUK2REMLK3F4',
      ebwoid: 'EBWOID-DE-0000000001',
      euid: 'DEXX001T.HRB100001',
      address: { street: 'Musterstraße 1', city: '70569 Stuttgart', countryCode: 'DE' },
      identifiers: [{ type: 'VAT_ID', value: 'DE123456789' }],
    },
    logistik: {
      id: 'c0000002-0000-4000-8000-000000000002',
      name: 'Beispiel Logistik GmbH',
      bpn: null,
      address: { street: 'Hafenstraße 5', city: '68159 Mannheim', countryCode: 'DE' },
      identifiers: [{ type: 'COMMERCIAL_REG_NUMBER', value: 'HRB 200002' }, { type: 'VAT_ID', value: 'DE987654321' }],
    },
  },

  /** The objects of this feature's module (C1-M2 Registration), shaped like specs/c1-m2/openapi.yaml and identical
   *  to the fixtures of packages/c1-m2-core (domain/testing/fixtures). Fields marked "not in the spec" are open points. */
  c1m2: {
    /** GET /countries?lang=en (Country). */
    countries: [{ code: 'DE', name: 'Germany' }, { code: 'US', name: 'United States' }],
    /** GET /countries/DE/identifier-types?lang=en (IdentifierTypeInfo). */
    identifierTypesDE: [
      { type: 'EUID', name: 'EUID', pattern: '^[A-Z]{2}[A-Za-z0-9.\\-]{2,60}$' },
      { type: 'EBWOID', name: 'EBWOID', pattern: '^\\S{1,200}$' },
      { type: 'COMMERCIAL_REG_NUMBER', name: 'Commercial register number', pattern: '^(?!.*\\s$)([A-Za-zÀ-ÿ])([A-Za-zÀ-ÿ0-9.()](\\s|-|_)?){4,50}$' },
      { type: 'VAT_ID', name: 'VAT ID', pattern: '^DE\\d{9}$' },
      { type: 'LEI_CODE', name: 'LEI', pattern: '^[A-Za-z0-9]{20}$' },
      { type: 'EORI', name: 'EORI number', pattern: '^[A-Z]{2}[A-Za-z0-9]{1,15}$' },
    ],
    /** GET /company-roles?lang=en (CompanyRoleInfo). */
    companyRoles: [
      { role: 'ACTIVE_PARTICIPANT', name: 'Participant', description: 'Data provider, data consumer, app user', agreementKeys: ['terms-active-participant', 'security-regulations'] },
      { role: 'APP_PROVIDER', name: 'App provider', description: 'offers apps in the marketplace', agreementKeys: ['terms-app-provider'] },
      { role: 'SERVICE_PROVIDER', name: 'Service provider', description: 'offers services in the marketplace', agreementKeys: ['terms-service-provider'] },
    ],
    /** GET /agreements?companyRole=…&lang=en (Agreement): active versions, scope ALL plus those of the roles. */
    agreements: [
      { agreementKey: 'osp-terms', version: '1.0', party: 'OSP', scope: 'ALL', title: 'Terms of use of the OSP',
        documentUrls: { de: 'https://osp-a.example.org/terms/osp-terms-1.0-de.pdf', en: 'https://osp-a.example.org/terms/osp-terms-1.0-en.pdf' } },
      { agreementKey: 'terms-active-participant', version: '1.0', party: 'DATASPACE', scope: 'COMPANY_ROLE', companyRoles: ['ACTIVE_PARTICIPANT'], title: 'Terms and conditions participant',
        documentUrls: { de: 'https://dataspace.example.org/terms/active-participant-1.0-de.pdf', en: 'https://dataspace.example.org/terms/active-participant-1.0-en.pdf' } },
      { agreementKey: 'security-regulations', version: '1.0', party: 'DATASPACE', scope: 'COMPANY_ROLE', companyRoles: ['ACTIVE_PARTICIPANT'], title: 'Security regulations',
        documentUrls: { en: 'https://dataspace.example.org/terms/security-1.0-en.pdf' } },
      { agreementKey: 'terms-app-provider', version: '1.0', party: 'DATASPACE', scope: 'COMPANY_ROLE', companyRoles: ['APP_PROVIDER'], title: 'Terms and conditions app provider',
        documentUrls: { en: 'https://dataspace.example.org/terms/app-provider-1.0-en.pdf' } },
      { agreementKey: 'terms-service-provider', version: '1.0', party: 'DATASPACE', scope: 'COMPANY_ROLE', companyRoles: ['SERVICE_PROVIDER'], title: 'Terms and conditions service provider',
        documentUrls: { en: 'https://dataspace.example.org/terms/service-provider-1.0-en.pdf' } },
    ],
    /** OSPs a company can move from (FRAMEWORK 7a: OSP B). NOT in the C1-M2 spec: ApplicationCreate has no field for
     *  the previous OSP and no operation lists OSPs (open question in the hub, view 1). */
    otherOsps: [{ ospId: '99a5685c-7397-402c-88de-b1b3a939ecc9', name: 'OSP B' }],
    /** Companies C3-M1 keeps that an application can reference (C1-M2 README 14.5). */
    existingCompanies: [
      { id: 'cc080671-720e-42b6-95b2-0784c8314242', name: 'Beispiel Werkzeugbau GmbH', status: 'INACTIVE', deactivationReason: 'OTHER', bpn: 'BPNL00000000003C' },
      { id: '6c71d54b-e689-4eb6-a1fa-ae196d8a5209', name: 'Beispiel Gießerei GmbH', status: 'INACTIVE', deactivationReason: 'TRANSFERRED', bpn: 'BPNL00000000004D' },
    ],
    /** GET /applications/{id} (ApplicationWithReview). Erika Mustermann, Beispiel Maschinenbau GmbH, path EBW, CREATED:
     *  everything from the attestation, plus her VAT ID and short name (fixture ERIKA_APPLICATION_CREATED).
     *  The views derive the later states (SUBMITTED, COMPLETED, …) from it. */
    erikaApplication: {
      id: 'a0000001-0000-4000-8000-000000000001',
      companyId: 'c0000001-0000-4000-8000-000000000001',
      kind: 'ONBOARDING', existingCompany: false, verification: 'EBW',
      applicant: { sub: '5a1c0001-0000-4000-8000-000000000001', givenName: 'Erika', familyName: 'Mustermann' },
      status: 'CREATED',
      companyData: {
        legalName: 'Beispiel Maschinenbau GmbH', shortName: 'Beispiel Maschinenbau',
        address: { streetName: 'Musterstraße', streetNumber: '1', postalCode: '70569', city: 'Stuttgart', region: null, countryCode: 'DE' },
        identifiers: [
          { type: 'EBWOID', value: 'EBWOID-DE-0000000001', source: 'ATTESTATION' },
          { type: 'EUID', value: 'DEXX001T.HRB100001', source: 'ATTESTATION' },
          { type: 'VAT_ID', value: 'DE123456789', source: 'APPLICANT' },
        ],
      },
      companyRoles: ['ACTIVE_PARTICIPANT'],
      attestation: {
        attestationId: '3f6c1e2a-7b4d-4e8f-9a51-2c0d6b8e4f17', issuer: 'https://ebw-connector.example.org',
        issuedAt: '2026-10-28T08:00:00.000Z', expiresAt: '2026-11-27T08:00:00.000Z', verifiedAt: '2026-10-28T08:00:00.000Z',
        person: { givenName: 'Erika', familyName: 'Mustermann' },
        representation: { confirmed: true, result: 'CONFIRMED', type: 'legal_representative', role: 'Geschäftsführerin', validUntil: '2027-12-31', issuer: 'https://register.test.example.org', trust: 'trust_list' },
      },
      comparison: [
        { field: 'EBWOID', result: 'FROM_ATTESTATION' }, { field: 'EUID', result: 'FROM_ATTESTATION' },
        { field: 'COUNTRY', result: 'FROM_ATTESTATION' }, { field: 'LEGAL_NAME', result: 'FROM_ATTESTATION' },
        { field: 'STREET', result: 'FROM_ATTESTATION' }, { field: 'POSTAL_CODE', result: 'FROM_ATTESTATION' },
        { field: 'CITY', result: 'FROM_ATTESTATION' },
      ],
      documents: [], representationDeclared: null, consents: [], declineReason: null,
      createdAt: '2026-10-28T08:05:00.000Z', changedAt: '2026-10-28T08:05:00.000Z', submittedAt: null,
      withdrawnAt: null, closedAt: null, completedAt: null,
      reviewStatus: 'NONE',
    },
    /** The consents of README 14.4, as SUBMIT stores them (Consent, with givenAt). */
    erikaConsents: [
      { agreementKey: 'osp-terms', version: '1.0', language: 'de', givenAt: '2026-10-28T08:20:00.000Z' },
      { agreementKey: 'terms-active-participant', version: '1.0', language: 'de', givenAt: '2026-10-28T08:20:00.000Z' },
      { agreementKey: 'security-regulations', version: '1.0', language: 'en', givenAt: '2026-10-28T08:20:00.000Z' },
    ],
    /** Hans Beispiel, Beispiel Logistik GmbH, path DOCUMENTS, CREATED, with a register extract. */
    hansApplication: {
      id: 'a0000002-0000-4000-8000-000000000002',
      companyId: 'c0000002-0000-4000-8000-000000000002',
      kind: 'ONBOARDING', existingCompany: false, verification: 'DOCUMENTS',
      applicant: { sub: '5a1c0003-0000-4000-8000-000000000003', givenName: 'Hans', familyName: 'Beispiel' },
      status: 'CREATED',
      companyData: {
        legalName: 'Beispiel Logistik GmbH', shortName: null,
        address: { streetName: 'Hafenstraße', streetNumber: '5', postalCode: '68159', city: 'Mannheim', region: 'BW', countryCode: 'DE' },
        identifiers: [
          { type: 'COMMERCIAL_REG_NUMBER', value: 'HRB 200002', source: 'APPLICANT' },
          { type: 'VAT_ID', value: 'DE987654321', source: 'APPLICANT' },
        ],
      },
      companyRoles: ['ACTIVE_PARTICIPANT'],
      attestation: null, comparison: [],
      documents: [
        { documentId: 'd0000002-0000-4000-8000-000000000001', documentType: 'COMMERCIAL_REGISTER_EXTRACT', fileName: 'handelsregisterauszug-hrb-200002.pdf',
          contentType: 'application/pdf', sizeBytes: 76, sha256: '593257d26f625690bd589c850210c636caaba218b351ac6935e2aa2f9f476b5f', uploadedAt: '2026-11-03T09:10:00.000Z' },
      ],
      representationDeclared: null, consents: [], declineReason: null,
      createdAt: '2026-11-03T09:00:00.000Z', changedAt: '2026-11-03T09:10:00.000Z', submittedAt: null,
      withdrawnAt: null, closedAt: null, completedAt: null,
      reviewStatus: 'NONE',
    },
    /** GET /osp/applications (ApplicationPage of ApplicationSummary), as Rolf Prüfer sees it. */
    allApplications: [
      { id: 'a0000004-0000-4000-8000-000000000004', companyId: 'cc080671-720e-42b6-95b2-0784c8314242', kind: 'REACTIVATION', existingCompany: true, verification: 'EBW',
        status: 'CREATED', legalName: 'Beispiel Werkzeugbau GmbH', countryCode: 'DE', companyRoles: ['ACTIVE_PARTICIPANT'], createdAt: '2026-11-04T08:10:00.000Z', submittedAt: null },
      { id: 'a0000005-0000-4000-8000-000000000005', companyId: '6c71d54b-e689-4eb6-a1fa-ae196d8a5209', kind: 'TRANSFER', existingCompany: true, verification: 'EBW',
        status: 'SUBMITTED', legalName: 'Beispiel Gießerei GmbH', countryCode: 'DE', companyRoles: ['ACTIVE_PARTICIPANT', 'APP_PROVIDER'], createdAt: '2026-11-04T08:10:00.000Z', submittedAt: '2026-11-04T08:30:00.000Z' },
      { id: 'a0000002-0000-4000-8000-000000000002', companyId: 'c0000002-0000-4000-8000-000000000002', kind: 'ONBOARDING', existingCompany: false, verification: 'DOCUMENTS',
        status: 'CREATED', legalName: 'Beispiel Logistik GmbH', countryCode: 'DE', companyRoles: ['ACTIVE_PARTICIPANT'], createdAt: '2026-11-03T09:00:00.000Z', submittedAt: null },
      { id: 'a0000001-0000-4000-8000-000000000001', companyId: 'c0000001-0000-4000-8000-000000000001', kind: 'ONBOARDING', existingCompany: false, verification: 'EBW',
        status: 'SUBMITTED', legalName: 'Beispiel Maschinenbau GmbH', countryCode: 'DE', companyRoles: ['ACTIVE_PARTICIPANT'], createdAt: '2026-10-28T08:05:00.000Z', submittedAt: '2026-10-28T08:20:00.000Z' },
      { id: 'a0000003-0000-4000-8000-000000000003', companyId: 'c1a00003-0000-4000-8000-000000000003', kind: 'ONBOARDING', existingCompany: false, verification: 'DOCUMENTS',
        status: 'DECLINED', legalName: 'Beispiel Logistik GmbH', countryCode: 'DE', companyRoles: ['ACTIVE_PARTICIPANT'], createdAt: '2026-10-20T13:30:00.000Z', submittedAt: '2026-10-20T14:00:00.000Z' },
    ],
    /** The decline reason of Hans's earlier application (close-application, README 8.2). */
    declineReason: 'The commercial register extract does not name the applicant as a representative.',
    /** Problem Details types the screens show in their error states (README 12). */
    problems: {
      openApplication: 'urn:c1-m2:problem:open-application-exists',
      accountBound: 'urn:c1-m2:problem:account-bound',
      mismatch: 'urn:c1-m2:problem:attestation-mismatch',
      validation: 'urn:c1-m2:problem:validation',
      consents: 'urn:c1-m2:problem:consents-incomplete',
      documents: 'urn:c1-m2:problem:documents-incomplete',
      expired: 'urn:c1-m2:problem:attestation-expired',
      decided: 'urn:c1-m2:problem:already-decided',
      invalidState: 'urn:c1-m2:problem:invalid-state',
      forbidden: 'urn:c1-m2:problem:forbidden',
      upstream: 'urn:c1-m2:problem:upstream-error',
    },
    /** Labels the pages show for enum values (become i18n keys in phase 2). */
    labels: {
      kind: { ONBOARDING: 'New company', REACTIVATION: 'Reactivation', TRANSFER: 'Transfer from another OSP' },
      verification: { EBW: 'Business Wallet', DOCUMENTS: 'Supporting documents' },
      status: { CREATED: 'Draft', SUBMITTED: 'Submitted', WITHDRAWN: 'Withdrawn', DECLINED: 'Declined', COMPLETED: 'Completed' },
      reviewStatus: { NONE: 'Not started', OPEN: 'In review', AWAITING_SECOND_APPROVAL: 'Awaiting second approval', APPROVED: 'Approved, setup running', DECLINED: 'Declined', CLOSED: 'Closed', UNKNOWN: 'Status not available' },
      identifier: { EUID: 'EUID', EBWOID: 'EBWOID', COMMERCIAL_REG_NUMBER: 'Commercial register number', VAT_ID: 'VAT ID', LEI_CODE: 'LEI', EORI: 'EORI number' },
      documentType: { COMMERCIAL_REGISTER_EXTRACT: 'Commercial register extract', POWER_OF_ATTORNEY: 'Power of attorney', OTHER: 'Other document' },
      comparison: { FROM_ATTESTATION: 'From the wallet', MATCH: 'Matches the wallet', MISMATCH: 'Differs from the wallet', NOT_IN_ATTESTATION: 'Not in the wallet' },
      /** The same results as the applicant reads them: MATCH, MISMATCH and NOT_IN_ATTESTATION mean the person gave the
       *  value (README 6.5); APPLICANT is a value that is never in the wallet (short name, identifiers with source APPLICANT). */
      comparisonOwn: { FROM_ATTESTATION: 'From the wallet', MATCH: 'Edited by you, matches the wallet', MISMATCH: 'Edited by you, differs from the wallet', NOT_IN_ATTESTATION: 'Entered by you, not in the wallet', APPLICANT: 'Entered by you' },
      field: { EBWOID: 'EBWOID', EUID: 'EUID', COUNTRY: 'Country', LEGAL_NAME: 'Legal name', STREET: 'Street', POSTAL_CODE: 'Postal code', CITY: 'City' },
    },
  },
};
