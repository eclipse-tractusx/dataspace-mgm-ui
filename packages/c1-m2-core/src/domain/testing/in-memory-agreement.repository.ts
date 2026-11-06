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

import type { AgreementVersionAnemic } from '../anemics/agreement-version.anemic';
import type { AgreementVersionCreateInput } from '../data/agreement-version-create-input.data';
import type { ValidationError } from '../data/c1-m2-shapes.data';
import type { AgreementVersionsFilter } from '../data/list-filters.data';
import type { PageData } from '../data/page.data';
import type { AgreementRepository } from '../repositories/agreement.repository';
import { companyRoleErrors } from './application-rules.fake';
import { AGREEMENT_VERSIONS, COMPANY_ROLES, type CompanyRoleFixture } from './fixtures/catalog.fixture';
import type { CallerFixture } from './mock-caller';
import { pageOf } from './paging.fake';
import { forbiddenProblem, problem, throwIfInvalid } from './problems.fake';

/** The active versions of the terms, shared by the fakes that need the required terms (README 6.8). */
export interface AgreementVersionSource {
  activeVersions(): ReadonlyArray<AgreementVersionAnemic>;
}

export interface InMemoryAgreementOptions {
  versions?: ReadonlyArray<AgreementVersionAnemic>;
  /** The signed-in person; null = no permission check (tests of other fakes). */
  caller?: CallerFixture | null;
  companyRoles?: ReadonlyArray<CompanyRoleFixture>;
  now?: () => Date;
  failure?: Error | null;
}

const KEY = /^[a-z0-9-]{1,64}$/;

function isHttpsUrl(value: string | undefined): boolean {
  try {
    return value !== undefined && new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * In-memory adapter of AgreementRepository: a test double of the backend (README 7.15, 7.16), never a source of truth
 * for a page. Its list of versions is the source of the required terms for the other fakes.
 */
export class InMemoryAgreementRepository implements AgreementRepository, AgreementVersionSource {
  public readonly calls: string[] = [];
  private versionList: AgreementVersionAnemic[];
  private readonly caller: CallerFixture | null;
  private readonly companyRoles: ReadonlyArray<CompanyRoleFixture>;
  private readonly now: () => Date;
  private failure: Error | null;

  constructor(options: InMemoryAgreementOptions = {}) {
    this.versionList = [...(options.versions ?? AGREEMENT_VERSIONS)];
    this.caller = options.caller ?? null;
    this.companyRoles = options.companyRoles ?? COMPANY_ROLES;
    this.now = options.now ?? (() => new Date());
    this.failure = options.failure ?? null;
  }

  /** Every version, read-only, for assertions. */
  public get versions(): ReadonlyArray<AgreementVersionAnemic> {
    return this.versionList;
  }

  /** Makes every following call fail with this error (null: work again). */
  public setFailure(failure: Error | null): void {
    this.failure = failure;
  }

  public activeVersions(): ReadonlyArray<AgreementVersionAnemic> {
    return this.versionList.filter((version) => version.status === 'ACTIVE');
  }

  public async listVersions(filter: AgreementVersionsFilter): Promise<PageData<AgreementVersionAnemic>> {
    this.enter('listVersions');
    const items = this.versionList
      .filter((version) => !filter.agreementKey || version.agreementKey === filter.agreementKey)
      .filter((version) => !filter.status || version.status === filter.status)
      .sort((a, b) => a.agreementKey.localeCompare(b.agreementKey) || b.createdAt.localeCompare(a.createdAt));
    return pageOf(items, filter.page, filter.size);
  }

  public async createVersion(input: AgreementVersionCreateInput): Promise<AgreementVersionAnemic> {
    this.enter('createVersion');
    throwIfInvalid(this.errorsOf(input));
    if (this.versionList.some((version) => version.agreementKey === input.agreementKey && version.version === input.version)) {
      throw problem('conflict', 409, 'This version of the terms already exists');
    }
    const created: AgreementVersionAnemic = {
      agreementKey: input.agreementKey,
      version: input.version,
      party: input.party,
      scope: input.scope,
      ...(input.scope === 'COMPANY_ROLE' ? { companyRoles: [...(input.companyRoles ?? [])] } : {}),
      title: { ...input.title },
      documentUrls: { ...input.documentUrls },
      status: 'ACTIVE',
      reconsentRequired: input.reconsentRequired,
      reconsentDueAt: input.reconsentDueAt ?? null,
      createdAt: this.now().toISOString(),
      createdBy: this.caller?.sub ?? null,
    };
    this.versionList = [
      ...this.versionList.map((version) =>
        version.agreementKey === input.agreementKey && version.status === 'ACTIVE' ? { ...version, status: 'INACTIVE' as const } : version,
      ),
      created,
    ];
    return created;
  }

  private enter(method: string): void {
    this.calls.push(method);
    if (this.failure) {
      throw this.failure;
    }
    if (this.caller && !this.caller.permissions.includes('manage_agreements')) {
      throw forbiddenProblem();
    }
  }

  private errorsOf(input: AgreementVersionCreateInput): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!KEY.test(input.agreementKey)) {
      errors.push({ field: 'agreementKey', message: 'agreementKey matches ^[a-z0-9-]{1,64}$.' });
    }
    if (input.version.length < 1 || input.version.length > 20) {
      errors.push({ field: 'version', message: 'version has 1 to 20 characters.' });
    }
    if (!['OSP', 'DATASPACE'].includes(input.party)) {
      errors.push({ field: 'party', message: 'party is OSP or DATASPACE.' });
    }
    if (input.scope === 'COMPANY_ROLE') {
      errors.push(...companyRoleErrors(input.companyRoles ?? [], this.companyRoles));
    } else if (input.scope !== 'ALL') {
      errors.push({ field: 'scope', message: 'scope is ALL or COMPANY_ROLE.' });
    } else if (input.companyRoles !== undefined) {
      errors.push({ field: 'companyRoles', message: 'companyRoles only for scope COMPANY_ROLE.' });
    }
    for (const language of ['de', 'en'] as const) {
      const title = input.title?.[language] ?? '';
      if (title.length < 1 || title.length > 200) {
        errors.push({ field: `title.${language}`, message: 'A title has 1 to 200 characters.' });
      }
    }
    const urls = Object.entries(input.documentUrls ?? {});
    if (urls.length === 0 || urls.some(([language, url]) => !['de', 'en'].includes(language) || !isHttpsUrl(url))) {
      errors.push({ field: 'documentUrls', message: 'At least one document, de or en, as an HTTPS address.' });
    }
    if (input.reconsentRequired) {
      const due = input.reconsentDueAt ? Date.parse(input.reconsentDueAt) : Number.NaN;
      if (Number.isNaN(due) || due <= this.now().getTime()) {
        errors.push({ field: 'reconsentDueAt', message: 'Required with reconsentRequired, in the future.' });
      }
    }
    return errors;
  }
}
