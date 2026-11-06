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

import type { C1M2ProblemData } from '../data/c1-m2-problem.data';
import type { ProblemOutcome, ProblemOutcomeStatus } from '../data/c1-m2-outcomes.data';

/** One Problem Details answer per outcome (README 12) and the result a use case must make of it, for use-case tests. */
export const PROBLEM_SAMPLES: Readonly<Record<ProblemOutcomeStatus, { problem: C1M2ProblemData; outcome: ProblemOutcome }>> = {
  validation: {
    problem: { status: 400, type: 'urn:c1-m2:problem:validation', title: 'Validation failed', errors: [{ field: 'companyRoles', message: 'Required.' }] },
    outcome: { status: 'validation', errors: [{ field: 'companyRoles', message: 'Required.' }] },
  },
  'attestation-invalid': {
    problem: { status: 400, type: 'urn:c1-m2:problem:attestation-invalid', reason: 'signature' },
    outcome: { status: 'attestation-invalid', reason: 'signature' },
  },
  'attestation-mismatch': {
    problem: { status: 400, type: 'urn:c1-m2:problem:attestation-mismatch', fields: ['EBWOID', 'COUNTRY'] },
    outcome: { status: 'attestation-mismatch', fields: ['EBWOID', 'COUNTRY'] },
  },
  'consents-incomplete': {
    problem: { status: 400, type: 'urn:c1-m2:problem:consents-incomplete', missing: [{ agreementKey: 'osp-terms', version: '1.1' }] },
    outcome: { status: 'consents-incomplete', missing: [{ agreementKey: 'osp-terms', version: '1.1' }] },
  },
  'documents-incomplete': {
    problem: { status: 400, type: 'urn:c1-m2:problem:documents-incomplete', missingDocumentTypes: ['COMMERCIAL_REGISTER_EXTRACT'], representationDeclarationMissing: true },
    outcome: { status: 'documents-incomplete', missingDocumentTypes: ['COMMERCIAL_REGISTER_EXTRACT'], representationDeclarationMissing: true },
  },
  'documents-disabled': { problem: { status: 400, type: 'urn:c1-m2:problem:documents-disabled' }, outcome: { status: 'documents-disabled' } },
  forbidden: { problem: { status: 403, type: 'urn:c1-m2:problem:forbidden' }, outcome: { status: 'forbidden' } },
  'account-bound': { problem: { status: 403, type: 'urn:c1-m2:problem:account-bound' }, outcome: { status: 'account-bound' } },
  'not-found': { problem: { status: 404, type: 'urn:c1-m2:problem:not-found' }, outcome: { status: 'not-found' } },
  'invalid-state': { problem: { status: 409, type: 'urn:c1-m2:problem:invalid-state' }, outcome: { status: 'invalid-state' } },
  conflict: { problem: { status: 409, type: 'urn:c1-m2:problem:conflict' }, outcome: { status: 'conflict' } },
  'open-application-exists': {
    problem: { status: 409, type: 'urn:c1-m2:problem:open-application-exists', existingApplicationId: 'a0000001-0000-4000-8000-000000000001' },
    outcome: { status: 'open-application-exists', existingApplicationId: 'a0000001-0000-4000-8000-000000000001' },
  },
  'company-has-open-application': {
    problem: { status: 409, type: 'urn:c1-m2:problem:company-has-open-application' },
    outcome: { status: 'company-has-open-application' },
  },
  'company-not-eligible': {
    problem: { status: 409, type: 'urn:c1-m2:problem:company-not-eligible', companyStatus: 'ACTIVE' },
    outcome: { status: 'company-not-eligible', companyStatus: 'ACTIVE' },
  },
  'attestation-used': { problem: { status: 409, type: 'urn:c1-m2:problem:attestation-used' }, outcome: { status: 'attestation-used' } },
  'attestation-expired': { problem: { status: 409, type: 'urn:c1-m2:problem:attestation-expired' }, outcome: { status: 'attestation-expired' } },
  'already-decided': {
    problem: { status: 409, type: 'urn:c1-m2:problem:already-decided', reviewStatus: 'APPROVED' },
    outcome: { status: 'already-decided', reviewStatus: 'APPROVED' },
  },
};

/** A port whose every method rejects with the error, for the mapping tests of the use cases. */
export function throwingPort<T>(error: unknown): T {
  return new Proxy({}, { get: () => () => Promise.reject(error) }) as T;
}
