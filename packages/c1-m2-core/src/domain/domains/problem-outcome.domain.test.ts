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

import { CoreHttpException } from '@dataspace-mgm/core-http';
import { describe, expect, it } from 'vitest';
import { C1M2ProblemException } from '../c1-m2-problem.exception';
import type { ProblemOutcomeStatus } from '../data/c1-m2-outcomes.data';
import { PROBLEM_SAMPLES } from '../testing/problem-samples.fake';
import { ProblemOutcomeDomain } from './problem-outcome.domain';

describe('ProblemOutcomeDomain', () => {
  it.each(Object.keys(PROBLEM_SAMPLES) as ProblemOutcomeStatus[])('maps the Problem Details type %s with its extension fields', (status) => {
    const { problem, outcome } = PROBLEM_SAMPLES[status];
    expect(ProblemOutcomeDomain.outcomeOf(problem)).toEqual(outcome);
    expect(ProblemOutcomeDomain.resultOf(new C1M2ProblemException(problem), [status])).toEqual(outcome);
  });

  it('fills missing extension fields with empty values', () => {
    const outcomes = (['validation', 'attestation-invalid', 'attestation-mismatch', 'consents-incomplete', 'documents-incomplete', 'open-application-exists', 'company-not-eligible', 'already-decided'] as const).map(
      (name) => ProblemOutcomeDomain.outcomeOf({ status: 400, type: `urn:c1-m2:problem:${name}` }),
    );
    expect(outcomes).toEqual([
      { status: 'validation', errors: [] },
      { status: 'attestation-invalid', reason: null },
      { status: 'attestation-mismatch', fields: [] },
      { status: 'consents-incomplete', missing: [] },
      { status: 'documents-incomplete', missingDocumentTypes: [], representationDeclarationMissing: false },
      { status: 'open-application-exists', existingApplicationId: null },
      { status: 'company-not-eligible', companyStatus: null },
      { status: 'already-decided', reviewStatus: null },
    ]);
  });

  it('knows no outcome for upstream-error, unknown names and other modules', () => {
    expect(ProblemOutcomeDomain.outcomeOf({ status: 502, type: 'urn:c1-m2:problem:upstream-error' })).toBeNull();
    expect(ProblemOutcomeDomain.outcomeOf({ status: 404, type: 'urn:c3-m1:problem:not-found' })).toBeNull();
  });

  it('reads the Problem Details only from a C1M2ProblemException', () => {
    const problem = PROBLEM_SAMPLES.conflict.problem;
    expect(ProblemOutcomeDomain.of(new C1M2ProblemException(problem))).toBe(problem);
    expect(ProblemOutcomeDomain.of(new CoreHttpException(409, 'urn:c1-m2:problem:conflict', 'conflict'))).toBeNull();
    expect(ProblemOutcomeDomain.of('nope')).toBeNull();
  });

  it('turns an outcome outside the union and every other error into failed', () => {
    expect(ProblemOutcomeDomain.resultOf(new C1M2ProblemException({ status: 403, type: 'urn:c1-m2:problem:forbidden', title: 'Permission missing' }), ['not-found'])).toEqual({
      status: 'failed',
      error: { status: 403, problemType: 'urn:c1-m2:problem:forbidden', message: 'Permission missing' },
    });
    expect(ProblemOutcomeDomain.resultOf(new C1M2ProblemException({ status: 502, type: 'urn:c1-m2:problem:upstream-error' }), ['not-found'])).toEqual({
      status: 'failed',
      error: { status: 502, problemType: 'urn:c1-m2:problem:upstream-error', message: 'urn:c1-m2:problem:upstream-error' },
    });
    expect(ProblemOutcomeDomain.resultOf(new TypeError('Failed to fetch'), [])).toEqual({
      status: 'failed',
      error: { status: null, problemType: null, message: 'Failed to fetch' },
    });
  });
});
