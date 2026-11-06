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

import type { CompanyDetailAnemic } from '../anemics/company-detail.anemic';
import type { CompanySummaryAnemic } from '../anemics/company-summary.anemic';
import type { PageAnemic } from '../anemics/page.anemic';
import type { CompanyCorrectionData } from '../data/c3-m1-commands.data';
import type { CompanyListQueryData } from '../data/c3-m1-queries.data';
import type { OspCompanyRepository } from '../repositories/osp-company.repository';
import { InMemoryC3M1Store } from './in-memory-c3-m1.store';
import { company as withOneLineAddress } from './participants.fixtures';

const toSummary = (company: CompanyDetailAnemic): CompanySummaryAnemic => ({
  id: company.id,
  name: company.name,
  status: company.status,
  bpn: company.bpn,
  coreDataSource: company.coreDataSource,
  countryCode: company.address.countryCode,
  companyRoles: company.companyRoles,
  createdAt: company.createdAt,
});

/** The companies for the onboarding service provider on the in-memory store: the success answers of README 7.10 to 7.13. */
export class InMemoryOspCompanyRepository implements OspCompanyRepository {
  constructor(private readonly store: InMemoryC3M1Store) {}

  /** The filters of the query parameters, newest first, so mock mode can be clicked through. */
  public async list(query: CompanyListQueryData): Promise<PageAnemic<CompanySummaryAnemic>> {
    this.store.enter('listCompanies');
    const name = query.name?.toLowerCase();
    const matches = this.store.companies
      .filter((company) => !query.status?.length || query.status.includes(company.status))
      .filter((company) => !name || company.name.toLowerCase().includes(name))
      .filter((company) => !query.bpn || company.bpn === query.bpn)
      .filter((company) => query.hasBpn === undefined || (company.bpn !== null) === query.hasBpn)
      .filter((company) => !query.companyRole || company.companyRoles.includes(query.companyRole))
      .filter((company) => !query.coreDataSource || company.coreDataSource === query.coreDataSource)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(toSummary);
    return InMemoryC3M1Store.page(matches, query);
  }

  public async getDetail(companyId: string): Promise<CompanyDetailAnemic> {
    this.store.enter('getCompanyDetail');
    return this.store.company(companyId);
  }

  public async correct(companyId: string, correction: CompanyCorrectionData): Promise<CompanyDetailAnemic> {
    this.store.enter('correctCompany');
    const company = this.store.company(companyId);
    const walletIdentifiers = company.identifiers.filter((identifier) => identifier.source === 'BUSINESS_WALLET');
    return this.store.saveCompany(
      withOneLineAddress({
        ...company,
        name: correction.name ?? company.name,
        shortName: correction.shortName !== undefined ? correction.shortName : company.shortName,
        postalAddress: correction.address ?? company.postalAddress,
        identifiers: correction.identifiers
          ? [...walletIdentifiers, ...correction.identifiers.map((identifier) => ({ ...identifier, source: 'DECLARED' as const, verified: false }))]
          : company.identifiers,
        changedAt: this.store.now(),
      }),
    );
  }

  public async deactivate(companyId: string): Promise<CompanyDetailAnemic> {
    this.store.enter('deactivateCompany');
    const now = this.store.now();
    return this.store.saveCompany({ ...this.store.company(companyId), status: 'INACTIVE', deactivationReason: 'MANUAL', deactivatedAt: now, changedAt: now });
  }
}
