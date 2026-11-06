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

/** In-memory adapter of the port, for tests of use cases and pages without HTTP. */
export class InMemoryCompanyRepository implements CompanyRepository {
  public readonly calls: string[] = [];

  constructor(
    private readonly companies: ReadonlyArray<CompanyAnemic> = [],
    private readonly failure: Error | null = null,
  ) {}

  public async getCompany(companyId: string): Promise<CompanyAnemic | null> {
    this.calls.push(companyId);
    if (this.failure) {
      throw this.failure;
    }
    return this.companies.find((company) => company.id === companyId) ?? null;
  }
}

/** The OSP company of OSP A in the test data of the backend (testdata/osp-a-company.json). */
export const OSP_A_COMPANY: CompanyAnemic = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'OSP A Beispiel GmbH',
  shortName: null,
  bpn: 'BPNL00000000OSPA',
  status: 'ACTIVE',
  coreDataSource: 'MANUAL',
  dataspaceName: 'Catena-X',
  address: { street: 'Am Prüfstand 1', city: '70569 Stuttgart', countryCode: 'DE' },
  identifiers: [{ type: 'VAT_ID', value: 'DE222222222', verified: false }],
  companyRoles: ['ONBOARDING_SERVICE_PROVIDER', 'ACTIVE_PARTICIPANT', 'APP_PROVIDER', 'SERVICE_PROVIDER'],
  createdAt: '2026-11-06T00:00:00+00:00',
};
