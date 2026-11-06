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

import type { CompanyAnemic } from '../../domain/anemics/company.anemic';
import type { CompanyDetailAnemic } from '../../domain/anemics/company-detail.anemic';
import type { CompanySummaryAnemic } from '../../domain/anemics/company-summary.anemic';
import type { IdentifierAnemic } from '../../domain/anemics/identifier.anemic';
import type { PageAnemic } from '../../domain/anemics/page.anemic';
import type { CompanyDetailDto, CompanyDto, CompanyPageDto, CompanySummaryDto, IdentifierDto } from '../data/c3-m1-infrastructure.data';
import { AddressMapper } from './address.mapper';

const joined = (...parts: ReadonlyArray<string | null | undefined>) => parts.filter((part) => part).join(' ');

/** C3-M1 `Company` (DTO of the API) → the anemic of the UI. The shape of the domain is our decision, not the API's. */
export class CompanyMapper {
  public static identifierToAnemic(identifier: IdentifierDto): IdentifierAnemic {
    return {
      type: identifier.type,
      value: identifier.value,
      source: identifier.source,
      verified: identifier.source === 'BUSINESS_WALLET',
    };
  }

  public static toAnemic(dto: CompanyDto): CompanyAnemic {
    return {
      id: dto.id,
      name: dto.name,
      shortName: dto.shortName ?? null,
      bpn: dto.bpn ?? null,
      status: dto.status,
      coreDataSource: dto.coreDataSource,
      coreDataVerifiedAt: dto.coreDataVerifiedAt ?? null,
      dataspaceName: dto.dataspaceName ?? null,
      address: {
        street: joined(dto.address.street, dto.address.houseNumber),
        city: joined(dto.address.postalCode, dto.address.city),
        countryCode: dto.address.countryCode,
      },
      postalAddress: AddressMapper.toAnemic(dto.address),
      identifiers: dto.identifiers.map(CompanyMapper.identifierToAnemic),
      companyRoles: dto.companyRoles.filter((role) => role.status === 'ACTIVE').map((role) => role.companyRole),
      createdAt: dto.createdAt,
      activatedAt: dto.activatedAt ?? null,
    };
  }

  public static detailToAnemic(dto: CompanyDetailDto): CompanyDetailAnemic {
    return {
      ...CompanyMapper.toAnemic(dto),
      changedAt: dto.changedAt ?? null,
      applicationId: dto.applicationId ?? null,
      verificationRef: dto.verificationRef ?? null,
      bpnAssignedAt: dto.bpnAssignedAt ?? null,
      deactivationReason: dto.deactivationReason ?? null,
      rejectedAt: dto.rejectedAt ?? null,
      deactivatedAt: dto.deactivatedAt ?? null,
      reactivatedAt: dto.reactivatedAt ?? null,
      openChangeRequestId: dto.openChangeRequestId ?? null,
    };
  }

  public static summaryToAnemic(dto: CompanySummaryDto): CompanySummaryAnemic {
    return {
      id: dto.id,
      name: dto.name,
      status: dto.status,
      bpn: dto.bpn ?? null,
      coreDataSource: dto.coreDataSource,
      countryCode: dto.countryCode,
      companyRoles: dto.companyRoles ?? [],
      createdAt: dto.createdAt,
    };
  }

  public static pageToAnemic(dto: CompanyPageDto): PageAnemic<CompanySummaryAnemic> {
    return { items: dto.items.map(CompanyMapper.summaryToAnemic), page: dto.page, size: dto.size, total: dto.total };
  }
}
