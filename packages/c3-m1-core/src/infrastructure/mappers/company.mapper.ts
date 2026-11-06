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
import type { CompanyDto } from '../data/c3-m1-infrastructure.data';

const joined = (...parts: ReadonlyArray<string | null | undefined>) => parts.filter((part) => part).join(' ');

/** C3-M1 `Company` (DTO of the API) → the anemic of the UI. The shape of the domain is our decision, not the API's. */
export class CompanyMapper {
  public static toAnemic(dto: CompanyDto): CompanyAnemic {
    return {
      id: dto.id,
      name: dto.name,
      shortName: dto.shortName ?? null,
      bpn: dto.bpn ?? null,
      status: dto.status,
      coreDataSource: dto.coreDataSource,
      dataspaceName: dto.dataspaceName ?? null,
      address: {
        street: joined(dto.address.street, dto.address.houseNumber),
        city: joined(dto.address.postalCode, dto.address.city),
        countryCode: dto.address.countryCode,
      },
      identifiers: dto.identifiers.map((identifier) => ({
        type: identifier.type,
        value: identifier.value,
        verified: identifier.source === 'BUSINESS_WALLET',
      })),
      companyRoles: dto.companyRoles.filter((role) => role.status === 'ACTIVE').map((role) => role.companyRole),
      createdAt: dto.createdAt,
    };
  }
}
