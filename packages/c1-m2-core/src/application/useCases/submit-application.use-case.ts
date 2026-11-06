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

import { ProblemOutcomeDomain } from '../../domain/domains/problem-outcome.domain';
import type { SubmitApplicationResult } from '../../domain/data/submit-application-result.data';
import type { SubmitInput } from '../../domain/data/submit-input.data';
import type { ApplicationRepository } from '../../domain/repositories/application.repository';

/** The Problem Details outcomes of this operation; every other error is `failed`. */
const SUBMIT_APPLICATION_PROBLEMS = [
  'not-found',
  'invalid-state',
  'attestation-expired',
  'documents-incomplete',
  'consents-incomplete',
  'validation',
] as const;

/**
 * "Submit the application" with the consents to the required terms; repeated on a submitted application it changes nothing.
 * POST /applications/{applicationId}/submit (`submitApplication`, README 6.8, 7.10). Expected outcomes are results, not exceptions.
 */
export class SubmitApplicationUseCase {
  constructor(private readonly applications: ApplicationRepository) {}

  public async execute(applicationId: string, input: SubmitInput): Promise<SubmitApplicationResult> {
    try {
      const application = await this.applications.submit(applicationId, input);
      return application ? { status: 'submitted', application } : { status: 'not-found' };
    } catch (error) {
      return ProblemOutcomeDomain.resultOf(error, SUBMIT_APPLICATION_PROBLEMS);
    }
  }
}
