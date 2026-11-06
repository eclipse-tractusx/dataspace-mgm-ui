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

import type { Identifier } from '../../data/c1-m2-shapes.data';
import type { MockAttestedCompanyClaims } from '../mock-attestation-claims';

/**
 * A company that C3-M1 already keeps, as C1-M2 reads it for REACTIVATION and the return (C3-M1 `CompanyInternal`,
 * the fields of C1-M2 README 11.2; stand-in file of README 14.5).
 */
export interface ExistingCompanyFixture {
  id: string;
  name: string;
  countryCode: string;
  status: 'REQUESTED' | 'ACTIVE' | 'REJECTED' | 'INACTIVE';
  /** `TRANSFERRED` or another reason (`OTHER`); null for a company that is not deactivated. */
  deactivationReason: string | null;
  bpn: string | null;
  identifiers: ReadonlyArray<Identifier>;
  companyRoles: ReadonlyArray<string>;
}

/** Beispiel Werkzeugbau GmbH, deactivated (reason OTHER): reference of a REACTIVATION (README 14.5). */
export const WERKZEUGBAU_COMPANY: ExistingCompanyFixture = {
  id: 'cc080671-720e-42b6-95b2-0784c8314242',
  name: 'Beispiel Werkzeugbau GmbH',
  countryCode: 'DE',
  status: 'INACTIVE',
  deactivationReason: 'OTHER',
  bpn: 'BPNL00000000003C',
  identifiers: [
    { type: 'EBWOID', value: 'EBWOID-DE-0000000003' },
    { type: 'EUID', value: 'DEXX001T.HRB100003' },
  ],
  companyRoles: ['ACTIVE_PARTICIPANT'],
};

/** Beispiel Gießerei GmbH, transferred away (reason TRANSFERRED): reference of a return (TRANSFER, README 14.5). */
export const GIESSEREI_COMPANY: ExistingCompanyFixture = {
  id: '6c71d54b-e689-4eb6-a1fa-ae196d8a5209',
  name: 'Beispiel Gießerei GmbH',
  countryCode: 'DE',
  status: 'INACTIVE',
  deactivationReason: 'TRANSFERRED',
  bpn: 'BPNL00000000004D',
  identifiers: [{ type: 'EBWOID', value: 'EBWOID-DE-0000000004' }],
  companyRoles: ['ACTIVE_PARTICIPANT', 'APP_PROVIDER'],
};

/** The company of OSP A, active: not eligible for REACTIVATION or a return (README 14.5, FRAMEWORK 7a). */
export const OSP_A_EXISTING_COMPANY: ExistingCompanyFixture = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'OSP A Beispiel GmbH',
  countryCode: 'DE',
  status: 'ACTIVE',
  deactivationReason: null,
  bpn: 'BPNL00000000OSPA',
  identifiers: [{ type: 'EUID', value: 'DEXX001T.HRB100000' }],
  companyRoles: ['ONBOARDING_SERVICE_PROVIDER'],
};

/** The stand-in of C3-M1 for applications with a reference (README 14.5). */
export const EXISTING_COMPANIES: ReadonlyArray<ExistingCompanyFixture> = [WERKZEUGBAU_COMPANY, GIESSEREI_COMPANY, OSP_A_EXISTING_COMPANY];

/**
 * Companies with a test `companyId` of FRAMEWORK 7a (backend testdata/applicant-companies.json): the first new
 * application whose identifiers match one of them gets this id, as the backend stand-in does.
 */
export const FRAMEWORK_COMPANY_IDS: ReadonlyArray<{ companyId: string; legalName: string; identifiers: ReadonlyArray<Identifier> }> = [
  {
    companyId: 'c0000001-0000-4000-8000-000000000001',
    legalName: 'Beispiel Maschinenbau GmbH',
    identifiers: [
      { type: 'EBWOID', value: 'EBWOID-DE-0000000001' },
      { type: 'EUID', value: 'DEXX001T.HRB100001' },
    ],
  },
  {
    companyId: 'c0000002-0000-4000-8000-000000000002',
    legalName: 'Beispiel Logistik GmbH',
    identifiers: [{ type: 'COMMERCIAL_REG_NUMBER', value: 'HRB 200002' }],
  },
];

/** Claim `company` of Beispiel Maschinenbau GmbH (C1-M2 README 14.4, C5-M1 14.5). */
export const MASCHINENBAU_CLAIMS: MockAttestedCompanyClaims = {
  legal_name: 'Beispiel Maschinenbau GmbH',
  ebwoid: 'EBWOID-DE-0000000001',
  euid: 'DEXX001T.HRB100001',
  address: { street_address: 'Musterstraße 1', postal_code: '70569', locality: 'Stuttgart', country: 'DE' },
  country: 'DE',
};

/** Claim `company` of Beispiel Werkzeugbau GmbH (README 14.4; address from backend testdata/applicant-companies.json). */
export const WERKZEUGBAU_CLAIMS: MockAttestedCompanyClaims = {
  legal_name: 'Beispiel Werkzeugbau GmbH',
  ebwoid: 'EBWOID-DE-0000000003',
  euid: 'DEXX001T.HRB100003',
  address: { street_address: 'Werkstraße 3', postal_code: '20095', locality: 'Hamburg', country: 'DE' },
  country: 'DE',
};

/** Claim `company` of Beispiel Gießerei GmbH (README 14.4). The test data have no address: the claim is missing. */
export const GIESSEREI_CLAIMS: MockAttestedCompanyClaims = {
  legal_name: 'Beispiel Gießerei GmbH',
  ebwoid: 'EBWOID-DE-0000000004',
  euid: 'DEXX001T.HRB100004',
  country: 'DE',
};
