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
import { C1M2ProblemException } from '../../domain/c1-m2-problem.exception';
import type { ProblemOutcomeStatus } from '../../domain/data/c1-m2-outcomes.data';
import { createMockC1M2Ports, type MockC1M2Options } from '../../domain/testing/create-mock-c1-m2-module';
import { HANS_APPLICATION_DOCUMENTS, MOCK_MODE_APPLICATIONS } from '../../domain/testing/fixtures/applications.fixture';
import { HANS_SESSION, ROLF_SESSION } from '../../domain/testing/fixtures/sessions.fixture';
import { PROBLEM_SAMPLES, throwingPort } from '../../domain/testing/problem-samples.fake';
import { GetAnyDocumentUseCase } from './get-any-document.use-case';

const NOW = new Date('2026-11-06T10:00:00.000Z');
const ports = (session = HANS_SESSION, applications: MockC1M2Options['applications'] = []) =>
  createMockC1M2Ports(session, { applications, now: () => NOW });

/** The Problem Details outcomes of GetAnyDocumentResult (README 12). */
const PROBLEMS: ReadonlyArray<ProblemOutcomeStatus> = ['not-found', 'forbidden'];
const OTHER_PROBLEM: ProblemOutcomeStatus = 'already-decided';

describe('GetAnyDocumentUseCase', () => {
  it('case 20: OSP staff download a supporting document; Hans uses the own path', async () => {
    const documentId = HANS_APPLICATION_DOCUMENTS.documents[0].documentId;
    expect(await new GetAnyDocumentUseCase(ports(ROLF_SESSION, MOCK_MODE_APPLICATIONS).applications).execute(HANS_APPLICATION_DOCUMENTS.id, documentId)).toMatchObject({
      status: 'found',
      contentType: 'application/pdf',
    });
    expect(await new GetAnyDocumentUseCase(ports(HANS_SESSION, MOCK_MODE_APPLICATIONS).applications).execute(HANS_APPLICATION_DOCUMENTS.id, documentId)).toEqual({ status: 'forbidden' });
    expect(await new GetAnyDocumentUseCase(ports(ROLF_SESSION, MOCK_MODE_APPLICATIONS).applications).execute(HANS_APPLICATION_DOCUMENTS.id, 'x')).toEqual({ status: 'not-found' });
  });

  it.each(PROBLEMS)('reports the Problem Details %s as a result with its fields', async (status) => {
    const { problem, outcome } = PROBLEM_SAMPLES[status];
    expect(await new GetAnyDocumentUseCase(throwingPort(new C1M2ProblemException(problem))).execute('a0000002-0000-4000-8000-000000000002', 'd0000002-0000-4000-8000-000000000001')).toEqual(outcome);
  });

  it('reports another outcome, a 5xx and a network error as failed', async () => {
    const run = (error: unknown) => new GetAnyDocumentUseCase(throwingPort(error)).execute('a0000002-0000-4000-8000-000000000002', 'd0000002-0000-4000-8000-000000000001');
    expect(await run(new C1M2ProblemException(PROBLEM_SAMPLES[OTHER_PROBLEM].problem))).toMatchObject({ status: 'failed', error: { problemType: PROBLEM_SAMPLES[OTHER_PROBLEM].problem.type } });
    expect(await run(new CoreHttpException(502, 'urn:c1-m2:problem:upstream-error', 'Bad Gateway'))).toEqual({
      status: 'failed',
      error: { status: 502, problemType: 'urn:c1-m2:problem:upstream-error', message: 'Bad Gateway' },
    });
    expect(await run(new TypeError('Failed to fetch'))).toEqual({ status: 'failed', error: { status: null, problemType: null, message: 'Failed to fetch' } });
  });
});
