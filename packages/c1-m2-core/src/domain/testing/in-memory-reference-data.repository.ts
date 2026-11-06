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

import type { AgreementAnemic } from '../anemics/agreement.anemic';
import type { CompanyRoleInfoAnemic } from '../anemics/company-role-info.anemic';
import type { CountryAnemic } from '../anemics/country.anemic';
import type { IdentifierTypeInfoAnemic } from '../anemics/identifier-type-info.anemic';
import type { Language } from '../data/c1-m2-enums.data';
import type { ReferenceDataRepository } from '../repositories/reference-data.repository';
import { companyRoleErrors } from './application-rules.fake';
import { COMPANY_ROLES, type CompanyRoleFixture } from './fixtures/catalog.fixture';
import { REFERENCE_DATA, type ReferenceDataFixture } from './fixtures/reference-data.fixture';
import { type AgreementVersionSource, InMemoryAgreementRepository } from './in-memory-agreement.repository';
import { throwIfInvalid } from './problems.fake';

export interface InMemoryReferenceDataOptions {
  referenceData?: ReferenceDataFixture;
  companyRoles?: ReadonlyArray<CompanyRoleFixture>;
  /** Share it with InMemoryApplicationRepository so that a new version counts everywhere. */
  agreements?: AgreementVersionSource;
  failure?: Error | null;
}

/** In-memory adapter of ReferenceDataRepository (README 7.1): a test double of the backend. */
export class InMemoryReferenceDataRepository implements ReferenceDataRepository {
  public readonly calls: string[] = [];
  private readonly referenceData: ReferenceDataFixture;
  private readonly companyRoles: ReadonlyArray<CompanyRoleFixture>;
  private readonly agreements: AgreementVersionSource;
  private readonly failure: Error | null;

  constructor(options: InMemoryReferenceDataOptions = {}) {
    this.referenceData = options.referenceData ?? REFERENCE_DATA;
    this.companyRoles = options.companyRoles ?? COMPANY_ROLES;
    this.agreements = options.agreements ?? new InMemoryAgreementRepository({ companyRoles: this.companyRoles });
    this.failure = options.failure ?? null;
  }

  public async listCountries(lang: Language): Promise<ReadonlyArray<CountryAnemic>> {
    this.enter('listCountries');
    return [...this.referenceData.countries]
      .sort((a, b) => a.code.localeCompare(b.code))
      .map((country) => ({ code: country.code, name: country.name[lang] }));
  }

  public async listIdentifierTypes(countryCode: string, lang: Language): Promise<ReadonlyArray<IdentifierTypeInfoAnemic> | null> {
    this.enter('listIdentifierTypes');
    const country = this.referenceData.countries.find((candidate) => candidate.code === countryCode);
    if (!country) {
      return null;
    }
    return country.identifierTypes.flatMap((type) => {
      const info = this.referenceData.identifierTypes.find((candidate) => candidate.type === type);
      return info ? [{ type, name: info.name[lang], pattern: info.patterns[countryCode] ?? info.patterns['Worldwide'] }] : [];
    });
  }

  public async listCompanyRoles(lang: Language): Promise<ReadonlyArray<CompanyRoleInfoAnemic>> {
    this.enter('listCompanyRoles');
    const active = this.agreements.activeVersions();
    return this.companyRoles
      .filter((role) => role.selectable)
      .map((role) => ({
        role: role.role,
        name: role.name[lang],
        description: role.description[lang],
        agreementKeys: active.filter((version) => version.companyRoles?.includes(role.role)).map((version) => version.agreementKey),
      }));
  }

  public async listAgreements(companyRoles: ReadonlyArray<string>, lang: Language): Promise<ReadonlyArray<AgreementAnemic>> {
    this.enter('listAgreements');
    if (companyRoles.length > 0) {
      throwIfInvalid(companyRoleErrors(companyRoles, this.companyRoles, 'companyRole'));
    }
    return this.agreements
      .activeVersions()
      .filter((version) => version.scope === 'ALL' || version.companyRoles?.some((role) => companyRoles.includes(role)))
      .map((version) => ({
        agreementKey: version.agreementKey,
        version: version.version,
        party: version.party,
        title: version.title[lang],
        documentUrls: version.documentUrls,
        scope: version.scope,
        ...(version.companyRoles ? { companyRoles: version.companyRoles } : {}),
      }));
  }

  private enter(method: string): void {
    this.calls.push(method);
    if (this.failure) {
      throw this.failure;
    }
  }
}
