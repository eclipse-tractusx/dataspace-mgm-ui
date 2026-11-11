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

import type { Application, ReviewCase, ReviewCheck } from '../domain/data/review.data';
import { attestationFixture } from './attestation-fixture';

/** An application submitted in the registration mock (C1-M2), as the review mock needs it. */
export type LinkedApplication = Pick<
  Application,
  | 'id'
  | 'companyId'
  | 'kind'
  | 'existingCompany'
  | 'verification'
  | 'applicant'
  | 'companyData'
  | 'companyRoles'
  | 'consents'
  | 'requiredAgreements'
  | 'createdAt'
  | 'submittedAt'
>;

/**
 * Mock mode only: the bridge between the registration mock (C1-M2) and the review mock (C1-M3), so an application
 * submitted in onboarding shows up in Application review, and the decision there reaches the applicant (in the backend
 * the steps `complete-application` and `close-application` do this).
 */
export interface MockRegistrationLink {
  /** The applications waiting for a decision (status SUBMITTED, review OPEN). */
  submitted(): ReadonlyArray<LinkedApplication>;
  /** The final decision on the case of a linked application. */
  decided(applicationId: string, approved: boolean, reason: string | null): void;
}

const CHECK_KEYS: ReviewCheck['checkKey'][] = [
  'ATTESTATION_VALID',
  'REPRESENTATION_CONFIRMED',
  'COMPANY_DATA_MATCH',
  'NO_DUPLICATE',
  'CSP_MATCH_EXPECTED',
  'CONSENTS_COMPLETE',
];

/** The review case of a linked application: every check passed (Business Wallet), or the wallet checks not applicable. */
export function reviewCaseOf(linked: LinkedApplication, openedAt: string): ReviewCase {
  const documents = linked.verification === 'DOCUMENTS';
  const { givenName, familyName } = linked.applicant;
  const application: Application = {
    ...structuredClone(linked),
    status: 'SUBMITTED',
    attestation: documents
      ? null
      : {
          ...structuredClone(attestationFixture),
          person: { givenName, familyName },
          company: { ...attestationFixture.company, legalName: linked.companyData.legalName },
        },
    comparison: documents ? [] : [{ field: 'LEGAL_NAME', result: 'MATCH' }],
    documents: [],
    representationDeclared: documents ? true : null,
  };
  const checks: ReviewCheck[] = CHECK_KEYS.map((checkKey, index) => ({
    checkKey,
    result: documents && index < 3 ? 'NOT_APPLICABLE' : 'PASSED',
    checkedAt: openedAt,
    attempts: 1,
    details: checkKey === 'CSP_MATCH_EXPECTED' ? { cspOutcome: linked.kind === 'ONBOARDING' ? 'NO_MATCH' : 'EXPECTED_MATCH', cspMatches: [] } : {},
  }));
  return {
    id: linked.id,
    applicationId: linked.id,
    companyId: linked.companyId,
    kind: linked.kind,
    existingCompany: linked.existingCompany,
    verification: linked.verification,
    applicantSub: linked.applicant.sub,
    status: 'OPEN',
    openedAt,
    cspBpn: null,
    checks,
    firstApproval: null,
    decision: null,
    closure: null,
    application,
  };
}
