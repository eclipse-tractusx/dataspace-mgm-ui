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
import type { CompanyDetailAnemic } from '../../domain/anemics/company-detail.anemic';
import type { CompanySummaryAnemic } from '../../domain/anemics/company-summary.anemic';
import type { PageAnemic } from '../../domain/anemics/page.anemic';
import type { CompanyCorrectionData } from '../../domain/data/c3-m1-commands.data';
import type { CompanyListQueryData } from '../../domain/data/c3-m1-queries.data';
import type { OspCompanyRepository } from '../../domain/repositories/osp-company.repository';
import type { C3M1Client, CompanyCorrectionDto } from '../data/c3-m1-infrastructure.data';
import { AddressMapper } from '../mappers/address.mapper';
import { CompanyMapper } from '../mappers/company.mapper';

/** Adapter over HTTP of the companies for the onboarding service provider (paths under /osp/companies). */
export class OspCompanyHttpRepository implements OspCompanyRepository {
  constructor(private readonly client: C3M1Client) {}

  public async list(query: CompanyListQueryData): Promise<PageAnemic<CompanySummaryAnemic>> {
    const dto = await ensureData(
      this.client.GET('/osp/companies', {
        params: {
          query: {
            page: query.page,
            size: query.size,
            status: query.status?.length ? [...query.status] : undefined,
            name: query.name,
            bpn: query.bpn,
            hasBpn: query.hasBpn,
            companyRole: query.companyRole,
            coreDataSource: query.coreDataSource,
          },
        },
      }),
    );
    return CompanyMapper.pageToAnemic(dto);
  }

  public async getDetail(companyId: string): Promise<CompanyDetailAnemic> {
    const dto = await ensureData(this.client.GET('/osp/companies/{companyId}', { params: { path: { companyId } } }));
    return CompanyMapper.detailToAnemic(dto);
  }

  /** Sends only the parts the correction changes, plus the reason (C3-M1 `CompanyCorrection`). */
  public async correct(companyId: string, correction: CompanyCorrectionData): Promise<CompanyDetailAnemic> {
    const body: CompanyCorrectionDto = {
      ...(correction.name !== undefined ? { name: correction.name.trim() } : {}),
      ...(correction.shortName !== undefined ? { shortName: correction.shortName } : {}),
      ...(correction.address !== undefined ? { address: AddressMapper.toDto(correction.address) } : {}),
      ...(correction.identifiers !== undefined
        ? { identifiers: correction.identifiers.map(({ type, value }) => ({ type, value: value.trim() })) }
        : {}),
      reason: correction.reason,
    };
    const dto = await ensureData(this.client.PATCH('/osp/companies/{companyId}', { params: { path: { companyId } }, body }));
    return CompanyMapper.detailToAnemic(dto);
  }

  public async deactivate(companyId: string, reason: string): Promise<CompanyDetailAnemic> {
    const dto = await ensureData(
      this.client.POST('/osp/companies/{companyId}/deactivate', { params: { path: { companyId } }, body: { reason } }),
    );
    return CompanyMapper.detailToAnemic(dto);
  }
}
