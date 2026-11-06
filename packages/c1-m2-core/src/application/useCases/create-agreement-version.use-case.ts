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
import type { AgreementVersionCreateInput } from '../../domain/data/agreement-version-create-input.data';
import type { CreateAgreementVersionResult } from '../../domain/data/create-agreement-version-result.data';
import type { AgreementRepository } from '../../domain/repositories/agreement.repository';

/** The Problem Details outcomes of this operation; every other error is `failed`. */
const CREATE_AGREEMENT_VERSION_PROBLEMS = ['conflict', 'validation', 'forbidden'] as const;

/**
 * "Publish a new version of terms" for OSP staff (permission `manage_agreements`); the previous version becomes INACTIVE.
 * POST /osp/agreements (`createAgreementVersion`, README 6.8, 7.16). Expected outcomes are results, not exceptions.
 */
export class CreateAgreementVersionUseCase {
  constructor(private readonly agreements: AgreementRepository) {}

  public async execute(input: AgreementVersionCreateInput): Promise<CreateAgreementVersionResult> {
    try {
      const version = await this.agreements.createVersion(input);
      return { status: 'created', version };
    } catch (error) {
      return ProblemOutcomeDomain.resultOf(error, CREATE_AGREEMENT_VERSION_PROBLEMS);
    }
  }
}
