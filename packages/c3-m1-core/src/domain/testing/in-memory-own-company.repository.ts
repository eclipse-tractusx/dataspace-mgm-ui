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

import type { CompanyAnemic } from '../anemics/company.anemic';
import type { CompanyRepository } from '../repositories/company.repository';
import type { InMemoryC3M1Store } from './in-memory-c3-m1.store';

/** The own company on the shared in-memory store (mock mode): a change shows on every page of the session. */
export class InMemoryOwnCompanyRepository implements CompanyRepository {
  constructor(private readonly store: InMemoryC3M1Store) {}

  public async getCompany(companyId: string): Promise<CompanyAnemic | null> {
    this.store.enter('getCompany');
    return this.store.companies.find((company) => company.id === companyId) ?? null;
  }

  public async updateShortName(companyId: string, shortName: string | null): Promise<CompanyAnemic> {
    this.store.enter('updateCompany');
    return this.store.saveCompany({ ...this.store.company(companyId), shortName, changedAt: this.store.now() });
  }
}
