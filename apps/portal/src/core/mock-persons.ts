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

import { COMPANY_IDS, PERSON_IDS } from '@dataspace-mgm/c3-m1-core/testing';
import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import { PIA_SESSION } from '@dataspace-mgm/identity-core/testing';

const person = (
  username: keyof typeof PERSON_IDS,
  name: string,
  companyId: string | null,
  bpn: string | null,
  permissions: ReadonlyArray<string>,
): SessionAnemic => ({ user: { id: PERSON_IDS[username], name, username }, companyId, bpn, permissions, csrfToken: 'csrf-mock' });

/**
 * The test persons of mock mode (FRAMEWORK 7a, backend testdata/persons-osp-a.json) with the permission keys of C3-M1
 * README 6.8 and C3-M2 README 6.3, as GET /me would list them (mockups/participants/shared/data.js).
 * `VITE_MOCK_PERSON=<key>` picks one; an unknown key (e.g. `none`) starts signed out.
 */
export const MOCK_PERSONS: Readonly<Record<string, SessionAnemic>> = {
  pia: PIA_SESSION,
  erika: person('erika', 'Erika Mustermann', COMPANY_IDS.u1, 'BPNLIUK2REMLK3F4', ['view_company', 'edit_company', 'edit_company_roles']),
  max: person('max', 'Max Mustermann', COMPANY_IDS.u1, 'BPNLIUK2REMLK3F4', ['view_company']),
  hans: person('hans', 'Hans Beispiel', COMPANY_IDS.u2, 'BPNL00000000U2LG', ['view_company', 'edit_company', 'edit_company_roles']),
  lieschen: person('lieschen', 'Lieschen Müller', null, null, []),
  otto: person('otto', 'Otto Normalverbraucher', COMPANY_IDS.osp, 'BPNL00000000OSPA', [
    'view_companies',
    'manage_companies',
    'review_company_changes',
    'view_company',
    'edit_company',
    'view_csp_registration',
  ]),
  rolf: person('rolf', 'Rolf Prüfer', null, null, ['view_companies', 'review_company_changes']),
  renate: person('renate', 'Renate Prüfer', null, null, ['view_companies', 'review_company_changes']),
};
