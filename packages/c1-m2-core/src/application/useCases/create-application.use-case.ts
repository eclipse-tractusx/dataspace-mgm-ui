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
import type { ApplicationCreateInput } from '../../domain/data/application-create-input.data';
import type { CreateApplicationResult } from '../../domain/data/create-application-result.data';
import type { ApplicationRepository } from '../../domain/repositories/application.repository';

/** The Problem Details outcomes of this operation; every other error is `failed`. */
const CREATE_APPLICATION_PROBLEMS = [
  'account-bound',
  'open-application-exists',
  'attestation-invalid',
  'attestation-mismatch',
  'attestation-used',
  'company-not-eligible',
  'company-has-open-application',
  'documents-disabled',
  'validation',
] as const;

/**
 * "Start the application": creates the application of the signed-in person, with the verification attestation (EBW) or the company data (DOCUMENTS).
 * POST /applications (`createApplication`, README 6.2 to 6.9, 7.2). Expected outcomes are results, not exceptions.
 */
export class CreateApplicationUseCase {
  constructor(private readonly applications: ApplicationRepository) {}

  public async execute(input: ApplicationCreateInput): Promise<CreateApplicationResult> {
    try {
      const { application, repeated } = await this.applications.create(input);
      return repeated ? { status: 'repeated', application } : { status: 'created', application };
    } catch (error) {
      return ProblemOutcomeDomain.resultOf(error, CREATE_APPLICATION_PROBLEMS);
    }
  }
}
