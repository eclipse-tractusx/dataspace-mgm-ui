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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import type { AgreementAnemic } from '../../domain/anemics/agreement.anemic';
import type { CompanyRoleInfoAnemic } from '../../domain/anemics/company-role-info.anemic';
import type { CountryAnemic } from '../../domain/anemics/country.anemic';
import type { IdentifierTypeInfoAnemic } from '../../domain/anemics/identifier-type-info.anemic';
import type { Language } from '../../domain/data/c1-m2-enums.data';
import type { ReferenceDataRepository } from '../../domain/repositories/reference-data.repository';
import type { C1M2Client } from '../data/c1-m2-infrastructure.data';
import { C1M2Response } from '../helpers/c1-m2-response.helper';
import { AgreementMapper } from '../mappers/agreement.mapper';
import { ReferenceDataMapper } from '../mappers/reference-data.mapper';

/** Adapter over HTTP of the reference data and the required terms (README 7.1). */
export class ReferenceDataHttpRepository implements ReferenceDataRepository {
  constructor(private readonly client: C1M2Client) {}

  public async listCountries(lang: Language): Promise<ReadonlyArray<CountryAnemic>> {
    const dtos = await C1M2Response.data(this.client.GET('/countries', { params: { query: { lang } } }));
    return dtos.map(ReferenceDataMapper.countryToAnemic);
  }

  public async listIdentifierTypes(countryCode: string, lang: Language): Promise<ReadonlyArray<IdentifierTypeInfoAnemic> | null> {
    const dtos = await C1M2Response.orNull(
      C1M2Response.data(this.client.GET('/countries/{countryCode}/identifier-types', { params: { path: { countryCode }, query: { lang } } })),
    );
    return dtos ? dtos.map(ReferenceDataMapper.identifierTypeToAnemic) : null;
  }

  public async listCompanyRoles(lang: Language): Promise<ReadonlyArray<CompanyRoleInfoAnemic>> {
    const dtos = await C1M2Response.data(this.client.GET('/company-roles', { params: { query: { lang } } }));
    return dtos.map(ReferenceDataMapper.companyRoleToAnemic);
  }

  /** `companyRole` is repeated per role (`?companyRole=A&companyRole=B`); without a role only the terms with scope ALL. */
  public async listAgreements(companyRoles: ReadonlyArray<string>, lang: Language): Promise<ReadonlyArray<AgreementAnemic>> {
    const dtos = await C1M2Response.data(
      this.client.GET('/agreements', { params: { query: { companyRole: companyRoles.length ? [...companyRoles] : undefined, lang } } }),
    );
    return dtos.map(AgreementMapper.toAnemic);
  }
}
