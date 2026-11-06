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

import type { SessionAnemic } from '@dataspace-mgm/identity-core';

/** Permissions of the portal role `Applicant`, which every account has (C2-M5 6.3). */
const APPLICANT = ['register_company', 'accept_invitation', 'view_notifications'];
/** Portal role `OSP Reviewer` (C2-M5 6.3). */
const OSP_REVIEWER = ['view_applications', 'view_reviews', 'review_application', 'view_companies', 'review_company_changes', 'view_users', 'view_all_technical_users'];
/** Portal role `OSP Admin` (C2-M5 6.3). */
const OSP_ADMIN = [
  'view_applications',
  'manage_agreements',
  'view_reviews',
  'view_companies',
  'manage_companies',
  'review_company_changes',
  'view_users',
  'manage_users',
  'manage_osp_staff',
  'view_all_technical_users',
  'view_csp_registration',
  'manage_credentials',
  'approve_offers',
  'view_processes',
  'retrigger_process_steps',
];

interface PersonFixture {
  key: string;
  sub: string;
  givenName: string;
  familyName: string;
  permissions: ReadonlyArray<string>;
}

/** Test persons of OSP A (FRAMEWORK 7a, backend testdata/persons-osp-a.json), all without a company. */
const PERSONS: ReadonlyArray<PersonFixture> = [
  { key: 'erika', sub: '5a1c0001-0000-4000-8000-000000000001', givenName: 'Erika', familyName: 'Mustermann', permissions: APPLICANT },
  { key: 'max', sub: '5a1c0002-0000-4000-8000-000000000002', givenName: 'Max', familyName: 'Mustermann', permissions: APPLICANT },
  { key: 'hans', sub: '5a1c0003-0000-4000-8000-000000000003', givenName: 'Hans', familyName: 'Beispiel', permissions: APPLICANT },
  { key: 'lieschen', sub: '5a1c0004-0000-4000-8000-000000000004', givenName: 'Lieschen', familyName: 'Müller', permissions: APPLICANT },
  { key: 'rolf', sub: 'bbede0f3-fbc4-433b-b7ca-1982e8724912', givenName: 'Rolf', familyName: 'Prüfer', permissions: [...APPLICANT, ...OSP_REVIEWER] },
  { key: 'otto', sub: '5a1c0012-0000-4000-8000-000000000012', givenName: 'Otto', familyName: 'Normalverbraucher', permissions: [...APPLICANT, ...OSP_ADMIN] },
];

/** Given and family name by `sub`: SessionAnemic has one `name`, the attestation check needs both (README 6.4 step 10). */
export const PERSON_NAMES: Readonly<Record<string, { givenName: string; familyName: string }>> = Object.fromEntries(
  PERSONS.map((person) => [person.sub, { givenName: person.givenName, familyName: person.familyName }]),
);

function sessionOf(key: string): SessionAnemic {
  const person = PERSONS.find((candidate) => candidate.key === key);
  if (!person) {
    throw new Error(`Unknown test person ${key}`);
  }
  return {
    user: { id: person.sub, name: `${person.givenName} ${person.familyName}`, username: person.key },
    companyId: null,
    bpn: null,
    permissions: person.permissions,
    csrfToken: 'csrf-test',
  };
}

/** Erika Mustermann, applicant for Beispiel Maschinenbau GmbH (verification path EBW). */
export const ERIKA_SESSION = sessionOf('erika');
/** Max Mustermann, second applicant (404 on Erika's application; REACTIVATION of Beispiel Werkzeugbau GmbH). */
export const MAX_SESSION = sessionOf('max');
/** Hans Beispiel, applicant for Beispiel Logistik GmbH (verification path DOCUMENTS). */
export const HANS_SESSION = sessionOf('hans');
/** Lieschen Müller, only Applicant, without an application. */
export const LIESCHEN_SESSION = sessionOf('lieschen');
/** Rolf Prüfer, OSP Reviewer (`view_applications`). */
export const ROLF_SESSION = sessionOf('rolf');
/** Otto Normalverbraucher, OSP Admin (`view_applications`, `manage_agreements`). */
export const OTTO_SESSION = sessionOf('otto');
