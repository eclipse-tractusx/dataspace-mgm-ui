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
import type { ListAgreementVersionsResult } from '../../domain/data/list-agreement-versions-result.data';
import type { AgreementVersionsFilter } from '../../domain/data/list-filters.data';
import type { AgreementRepository } from '../../domain/repositories/agreement.repository';

/** The Problem Details outcomes of this operation; every other error is `failed`. */
const LIST_AGREEMENT_VERSIONS_PROBLEMS = ['validation', 'forbidden'] as const;

/**
 * "Versions of the terms" for OSP staff (permission `manage_agreements`), including inactive ones.
 * GET /osp/agreements (`listAgreementVersions`, README 7.15). Expected outcomes are results, not exceptions.
 */
export class ListAgreementVersionsUseCase {
  constructor(private readonly agreements: AgreementRepository) {}

  public async execute(filter: AgreementVersionsFilter = {}): Promise<ListAgreementVersionsResult> {
    try {
      const page = await this.agreements.listVersions(filter);
      return { status: 'found', page };
    } catch (error) {
      return ProblemOutcomeDomain.resultOf(error, LIST_AGREEMENT_VERSIONS_PROBLEMS);
    }
  }
}
