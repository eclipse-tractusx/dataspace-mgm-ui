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
import { OTTO_SESSION } from '../../domain/testing/fixtures/sessions.fixture';
import { PROBLEM_SAMPLES, throwingPort } from '../../domain/testing/problem-samples.fake';
import { CreateAgreementVersionUseCase } from './create-agreement-version.use-case';

const NOW = new Date('2026-11-06T10:00:00.000Z');
const ports = (session = OTTO_SESSION, applications: MockC1M2Options['applications'] = []) =>
  createMockC1M2Ports(session, { applications, now: () => NOW });

/** The Problem Details outcomes of CreateAgreementVersionResult (README 12). */
const PROBLEMS: ReadonlyArray<ProblemOutcomeStatus> = ['conflict', 'validation', 'forbidden'];
const OTHER_PROBLEM: ProblemOutcomeStatus = 'already-decided';

describe('CreateAgreementVersionUseCase', () => {
  it('case 21: created, then conflict for the same version', async () => {
    const useCase = new CreateAgreementVersionUseCase(ports(OTTO_SESSION).agreements);
    const input = {
      agreementKey: 'osp-terms',
      version: '1.1',
      party: 'OSP' as const,
      scope: 'ALL' as const,
      title: { de: 'Nutzungsbedingungen des OSP', en: 'Terms of use of the OSP' },
      documentUrls: { en: 'https://osp-a.example.org/terms/osp-terms-1.1-en.pdf' },
      reconsentRequired: true,
      reconsentDueAt: '2027-01-31T00:00:00Z',
    };
    expect(await useCase.execute(input)).toMatchObject({ status: 'created', version: { agreementKey: 'osp-terms', version: '1.1', status: 'ACTIVE' } });
    expect(await useCase.execute(input)).toEqual({ status: 'conflict' });
  });

  it.each(PROBLEMS)('reports the Problem Details %s as a result with its fields', async (status) => {
    const { problem, outcome } = PROBLEM_SAMPLES[status];
    expect(await new CreateAgreementVersionUseCase(throwingPort(new C1M2ProblemException(problem))).execute({ agreementKey: 'osp-terms', version: '1.1', party: 'OSP', scope: 'ALL', title: { de: 'T', en: 'T' }, documentUrls: { en: 'https://x.example.org/t.pdf' }, reconsentRequired: false })).toEqual(outcome);
  });

  it('reports another outcome, a 5xx and a network error as failed', async () => {
    const run = (error: unknown) => new CreateAgreementVersionUseCase(throwingPort(error)).execute({ agreementKey: 'osp-terms', version: '1.1', party: 'OSP', scope: 'ALL', title: { de: 'T', en: 'T' }, documentUrls: { en: 'https://x.example.org/t.pdf' }, reconsentRequired: false });
    expect(await run(new C1M2ProblemException(PROBLEM_SAMPLES[OTHER_PROBLEM].problem))).toMatchObject({ status: 'failed', error: { problemType: PROBLEM_SAMPLES[OTHER_PROBLEM].problem.type } });
    expect(await run(new CoreHttpException(502, 'urn:c1-m2:problem:upstream-error', 'Bad Gateway'))).toEqual({
      status: 'failed',
      error: { status: 502, problemType: 'urn:c1-m2:problem:upstream-error', message: 'Bad Gateway' },
    });
    expect(await run(new TypeError('Failed to fetch'))).toEqual({ status: 'failed', error: { status: null, problemType: null, message: 'Failed to fetch' } });
  });
});
