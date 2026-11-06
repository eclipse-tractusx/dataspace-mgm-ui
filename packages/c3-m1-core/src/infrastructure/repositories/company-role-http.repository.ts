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

import { ensureData } from '@dataspace-mgm/core-http';
import type { CompanyRoleStateAnemic } from '../../domain/anemics/company-role-state.anemic';
import type { AgreementRefData } from '../../domain/data/c3-m1-commands.data';
import type { CompanyRoleRepository } from '../../domain/repositories/company-role.repository';
import type { C3M1Client } from '../data/c3-m1-infrastructure.data';
import { CompanyRoleMapper } from '../mappers/company-role.mapper';

/** Adapter over HTTP of the company roles of the own company (paths under /companies/{companyId}/company-roles). */
export class CompanyRoleHttpRepository implements CompanyRoleRepository {
  constructor(private readonly client: C3M1Client) {}

  public async list(companyId: string, lang: string): Promise<ReadonlyArray<CompanyRoleStateAnemic>> {
    const dto = await ensureData(this.client.GET('/companies/{companyId}/company-roles', { params: { path: { companyId }, query: { lang } } }));
    return dto.map(CompanyRoleMapper.toAnemic);
  }

  public async add(
    companyId: string,
    companyRole: string,
    consents: ReadonlyArray<AgreementRefData>,
    lang: string,
  ): Promise<ReadonlyArray<CompanyRoleStateAnemic>> {
    const dto = await ensureData(
      this.client.POST('/companies/{companyId}/company-roles', {
        params: { path: { companyId }, query: { lang } },
        body: { companyRole, consents: consents.map(({ agreementKey, version }) => ({ agreementKey, version })) },
      }),
    );
    return dto.map(CompanyRoleMapper.toAnemic);
  }

  public async remove(companyId: string, companyRole: string, lang: string): Promise<ReadonlyArray<CompanyRoleStateAnemic>> {
    const dto = await ensureData(
      this.client.DELETE('/companies/{companyId}/company-roles/{companyRole}', { params: { path: { companyId, companyRole }, query: { lang } } }),
    );
    return dto.map(CompanyRoleMapper.toAnemic);
  }
}
