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

import { CoreHttpErrorFactory } from '@dataspace-mgm/core-http';
import { C1M2ProblemException } from '../c1-m2-problem.exception';
import type { C1M2ProblemData } from '../data/c1-m2-problem.data';
import type { FailedOutcome, ProblemOutcome, ProblemOutcomeStatus } from '../data/c1-m2-outcomes.data';

const PROBLEM_PREFIX = 'urn:c1-m2:problem:';

/**
 * Turns an error of a port into data (error → result), in one place for every use case. Not a business rule: it only
 * reads the Problem Details `type` that the backend decided (README 12) and copies its extension fields.
 */
export class ProblemOutcomeDomain {
  /** The Problem Details of a C1-M2 answer, or null when the error is not one (network, 5xx, programming error). */
  public static of(error: unknown): C1M2ProblemData | null {
    return error instanceof C1M2ProblemException ? error.problem : null;
  }

  /** The outcome of a Problem Details `type`; null for a type this package does not know (e.g. `upstream-error`). */
  public static outcomeOf(problem: C1M2ProblemData): ProblemOutcome | null {
    if (!problem.type.startsWith(PROBLEM_PREFIX)) {
      return null;
    }
    const name = problem.type.slice(PROBLEM_PREFIX.length);
    switch (name) {
      case 'validation':
        return { status: 'validation', errors: problem.errors ?? [] };
      case 'attestation-invalid':
        return { status: 'attestation-invalid', reason: problem.reason ?? null };
      case 'attestation-mismatch':
        return { status: 'attestation-mismatch', fields: problem.fields ?? [] };
      case 'consents-incomplete':
        return { status: 'consents-incomplete', missing: problem.missing ?? [] };
      case 'documents-incomplete':
        return {
          status: 'documents-incomplete',
          missingDocumentTypes: problem.missingDocumentTypes ?? [],
          representationDeclarationMissing: problem.representationDeclarationMissing ?? false,
        };
      case 'open-application-exists':
        return { status: 'open-application-exists', existingApplicationId: problem.existingApplicationId ?? null };
      case 'company-not-eligible':
        return { status: 'company-not-eligible', companyStatus: problem.companyStatus ?? null };
      case 'already-decided':
        return { status: 'already-decided', reviewStatus: problem.reviewStatus ?? null };
      case 'documents-disabled':
      case 'forbidden':
      case 'account-bound':
      case 'not-found':
      case 'invalid-state':
      case 'conflict':
      case 'company-has-open-application':
      case 'attestation-used':
      case 'attestation-expired':
        return { status: name };
      default:
        return null;
    }
  }

  /**
   * The result of a failed call: the outcome when its status is one of `statuses` (the union of the use case),
   * otherwise `failed` with the HTTP status and Problem Details type.
   */
  public static resultOf<S extends ProblemOutcomeStatus>(
    error: unknown,
    statuses: ReadonlyArray<S>,
  ): Extract<ProblemOutcome, { status: S }> | FailedOutcome {
    const problem = ProblemOutcomeDomain.of(error);
    const outcome = problem ? ProblemOutcomeDomain.outcomeOf(problem) : null;
    if (outcome && (statuses as ReadonlyArray<ProblemOutcomeStatus>).includes(outcome.status)) {
      return outcome as Extract<ProblemOutcome, { status: S }>;
    }
    return { status: 'failed', error: CoreHttpErrorFactory.from(error) };
  }
}
