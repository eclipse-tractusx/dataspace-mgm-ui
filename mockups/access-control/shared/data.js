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

  /** The objects of this feature's module, shaped like its openapi.yaml schemas. */
  items: [],
};
