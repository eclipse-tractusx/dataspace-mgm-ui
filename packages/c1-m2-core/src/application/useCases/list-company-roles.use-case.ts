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
import type { Language } from '../../domain/data/c1-m2-enums.data';
import type { ListCompanyRolesResult } from '../../domain/data/list-company-roles-result.data';
import type { ReferenceDataRepository } from '../../domain/repositories/reference-data.repository';

/** The Problem Details outcomes of this operation; every other error is `failed`. */
const LIST_COMPANY_ROLES_PROBLEMS = [] as const;

/**
 * "Choose the company roles": the selectable roles with the keys of their terms.
 * GET /company-roles (`listCompanyRoles`, README 6.7, 7.1). Expected outcomes are results, not exceptions.
 */
export class ListCompanyRolesUseCase {
  constructor(private readonly referenceData: ReferenceDataRepository) {}

  public async execute(lang: Language = 'en'): Promise<ListCompanyRolesResult> {
    try {
      const companyRoles = await this.referenceData.listCompanyRoles(lang);
      return { status: 'found', companyRoles };
    } catch (error) {
      return ProblemOutcomeDomain.resultOf(error, LIST_COMPANY_ROLES_PROBLEMS);
    }
  }
}
