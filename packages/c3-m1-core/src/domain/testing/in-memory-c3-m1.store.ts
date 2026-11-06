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

import { CoreHttpException } from '@dataspace-mgm/core-http';
import type { ChangeRequestAnemic } from '../anemics/change-request.anemic';
import type { CompanyDetailAnemic } from '../anemics/company-detail.anemic';
import type { CompanyRoleStateAnemic } from '../anemics/company-role-state.anemic';
import type { PageAnemic } from '../anemics/page.anemic';
import type { PageRequestData } from '../data/c3-m1-queries.data';
import { CHANGE_REQUESTS, COMPANIES, COMPANY_IDS, COMPANY_ROLE_STATES } from './participants.fixtures';

export interface InMemoryC3M1StoreOptions {
  /** The `sub` written as `requestedBy` / `decidedBy` of new decisions. */
  actorId?: string;
  companies?: ReadonlyArray<CompanyDetailAnemic>;
  changeRequests?: ReadonlyArray<ChangeRequestAnemic>;
  /** Role states per company; without it the catalogue of the test data, with ACTIVE for the roles a company has. */
  roleStates?: Readonly<Record<string, ReadonlyArray<CompanyRoleStateAnemic>>>;
  /** Thrown by every call, e.g. a CoreHttpException(501) for the "not implemented" state. */
  failure?: Error | null;
  /**
   * Thrown by one operation (by operationId of the spec), e.g. `{ approveChangeRequest: c3m1Problem(409, 'same-person') }`:
   * how tests show an answer of the module without the in-memory adapter knowing its rules.
   */
  failures?: Readonly<Partial<Record<string, Error>>>;
  now?: () => string;
}

/** A Problem Details answer of C3-M1 as the HTTP adapter would throw it (README 12). */
export function c3m1Problem(status: number, name: string): CoreHttpException {
  return new CoreHttpException(status, `urn:c3-m1:problem:${name}`, name);
}

/**
 * The data of an in-memory C3-M1 for mock mode and tests: fixtures, the success answers of the operations, and failures
 * a test injects. It knows **no business rule** of the module (permissions, scopes, four-eyes principle, last role,
 * open change request, locked fields): those are decided by C3-M1 (dataspace-mgm-services, team/2) only.
 */
export class InMemoryC3M1Store {
  public readonly actorId: string;
  public companies: CompanyDetailAnemic[];
  public changeRequests: ChangeRequestAnemic[];
  public readonly roleStates = new Map<string, CompanyRoleStateAnemic[]>();
  public readonly calls: string[] = [];
  public readonly now: () => string;
  private readonly failure: Error | null;
  private readonly failures: Readonly<Partial<Record<string, Error>>>;

  constructor(options: InMemoryC3M1StoreOptions = {}) {
    this.actorId = options.actorId ?? 'anonymous';
    this.companies = [...(options.companies ?? COMPANIES)];
    this.changeRequests = [...(options.changeRequests ?? CHANGE_REQUESTS)];
    this.failure = options.failure ?? null;
    this.failures = options.failures ?? {};
    this.now = options.now ?? (() => new Date().toISOString());
    for (const company of this.companies) {
      const given = options.roleStates ? options.roleStates[company.id] : InMemoryC3M1Store.defaultRoles(company);
      this.roleStates.set(company.id, [...(given ?? [])]);
    }
  }

  /** The catalogue of the test data with ACTIVE for the roles the company has; Beispiel Maschinenbau as in the mockup. */
  private static defaultRoles(company: CompanyDetailAnemic): CompanyRoleStateAnemic[] {
    if (company.id === COMPANY_IDS.u1) {
      return [...COMPANY_ROLE_STATES];
    }
    return COMPANY_ROLE_STATES.map((role) => {
      const active = company.companyRoles.includes(role.companyRole);
      return {
        ...role,
        status: active ? 'ACTIVE' : 'NONE',
        agreements: role.agreements.map((agreement) => ({
          ...agreement,
          consentStatus: active ? 'ACTIVE' : null,
          consentedVersion: active ? agreement.version : null,
          consentedAt: active ? company.activatedAt : null,
        })),
      };
    });
  }

  /** Every call: records its operationId and throws the failure a test injected for it. */
  public enter(operation: string): void {
    this.calls.push(operation);
    const failure = this.failures[operation] ?? this.failure;
    if (failure) {
      throw failure;
    }
  }

  public company(companyId: string): CompanyDetailAnemic {
    const company = this.companies.find((item) => item.id === companyId);
    if (!company) {
      throw c3m1Problem(404, 'not-found');
    }
    return company;
  }

  public saveCompany(next: CompanyDetailAnemic): CompanyDetailAnemic {
    this.companies = this.companies.map((company) => (company.id === next.id ? next : company));
    return next;
  }

  public changeRequest(changeRequestId: string): ChangeRequestAnemic {
    const request = this.changeRequests.find((item) => item.id === changeRequestId);
    if (!request) {
      throw c3m1Problem(404, 'not-found');
    }
    return request;
  }

  public saveChangeRequest(next: ChangeRequestAnemic): ChangeRequestAnemic {
    const exists = this.changeRequests.some((request) => request.id === next.id);
    this.changeRequests = exists ? this.changeRequests.map((request) => (request.id === next.id ? next : request)) : [next, ...this.changeRequests];
    return next;
  }

  public static page<T>(items: ReadonlyArray<T>, request: PageRequestData): PageAnemic<T> {
    const start = request.page * request.size;
    return { items: items.slice(start, start + request.size), page: request.page, size: request.size, total: items.length };
  }
}
