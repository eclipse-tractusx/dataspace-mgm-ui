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

import type { CompanyRoleStateAnemic } from '../anemics/company-role-state.anemic';
import type { CompanyRoleRepository } from '../repositories/company-role.repository';
import type { InMemoryC3M1Store } from './in-memory-c3-m1.store';

/** The company roles of the own company on the in-memory store: the success answers of README 7.7 to 7.9. */
export class InMemoryCompanyRoleRepository implements CompanyRoleRepository {
  constructor(private readonly store: InMemoryC3M1Store) {}

  private setStatus(companyId: string, companyRole: string, active: boolean): ReadonlyArray<CompanyRoleStateAnemic> {
    const now = this.store.now();
    const roles = (this.store.roleStates.get(companyId) ?? []).map((role): CompanyRoleStateAnemic =>
      role.companyRole !== companyRole
        ? role
        : {
            ...role,
            status: active ? 'ACTIVE' : 'INACTIVE',
            agreements: role.agreements.map((agreement) =>
              active ? { ...agreement, consentStatus: 'ACTIVE', consentedVersion: agreement.version, consentedAt: now } : { ...agreement, consentStatus: 'INACTIVE' },
            ),
          },
    );
    this.store.roleStates.set(companyId, roles);
    const company = this.store.company(companyId);
    this.store.saveCompany({ ...company, companyRoles: roles.filter((role) => role.status === 'ACTIVE').map((role) => role.companyRole) });
    return roles;
  }

  public async list(companyId: string): Promise<ReadonlyArray<CompanyRoleStateAnemic>> {
    this.store.enter('listCompanyRolesOfCompany');
    this.store.company(companyId);
    return this.store.roleStates.get(companyId) ?? [];
  }

  public async add(companyId: string, companyRole: string): Promise<ReadonlyArray<CompanyRoleStateAnemic>> {
    this.store.enter('addCompanyRole');
    return this.setStatus(companyId, companyRole, true);
  }

  public async remove(companyId: string, companyRole: string): Promise<ReadonlyArray<CompanyRoleStateAnemic>> {
    this.store.enter('removeCompanyRole');
    return this.setStatus(companyId, companyRole, false);
  }
}
