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
import type { GetOwnCompanyResult } from '../../domain/data/get-own-company-result.data';
import type { CompanyRepository } from '../../domain/repositories/company.repository';

/**
 * "Show my company": reads the company of the signed-in person (C3-M1 `getCompany`, README 7.1).
 * The company comes from the session (`company_id` of the person); the module checks again that it is the own one.
 * Expected outcomes are results, not exceptions, so the page can render each of them.
 */
export class GetOwnCompanyUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  public async execute(companyId: string | null): Promise<GetOwnCompanyResult> {
    if (!companyId) {
      return { status: 'no-company' };
    }
    try {
      const company = await this.companies.getCompany(companyId);
      return company ? { status: 'found', company } : { status: 'not-found' };
    } catch (error) {
      return { status: 'failed', error: CoreHttpErrorFactory.from(error) };
    }
  }
}
