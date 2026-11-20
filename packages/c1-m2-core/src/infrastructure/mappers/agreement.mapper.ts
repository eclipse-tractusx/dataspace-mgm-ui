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

import type { AgreementVersionAnemic } from '../../domain/anemics/agreement-version.anemic';
import type { AgreementAnemic } from '../../domain/anemics/agreement.anemic';
import type { AgreementVersionCreateInput } from '../../domain/data/agreement-version-create-input.data';
import type { PageData } from '../../domain/data/page.data';
import type { AgreementDto, AgreementVersionCreateDto, AgreementVersionDto, AgreementVersionPageDto } from '../data/c1-m2-infrastructure.data';

/** C1-M2 `Agreement` and `AgreementVersion` (DTOs of the API) ↔ the anemics and the input of the UI. */
export class AgreementMapper {
  public static toAnemic(dto: AgreementDto): AgreementAnemic {
    return {
      agreementKey: dto.agreementKey,
      version: dto.version,
      party: dto.party,
      title: dto.title,
      documentUrls: dto.documentUrls,
      scope: dto.scope,
      companyRoles: dto.companyRoles,
    };
  }

  public static versionToAnemic(dto: AgreementVersionDto): AgreementVersionAnemic {
    return {
      agreementKey: dto.agreementKey,
      version: dto.version,
      party: dto.party,
      scope: dto.scope,
      companyRoles: dto.companyRoles,
      title: dto.title,
      documentUrls: dto.documentUrls,
      status: dto.status,
      reconsentRequired: dto.reconsentRequired,
      reconsentDueAt: dto.reconsentDueAt ?? null,
      createdAt: dto.createdAt,
      createdBy: dto.createdBy ?? null,
    };
  }

  public static versionPageToAnemic(dto: AgreementVersionPageDto): PageData<AgreementVersionAnemic> {
    return { items: dto.items.map(AgreementMapper.versionToAnemic), page: dto.page, size: dto.size, total: dto.total };
  }

  /** Body of `createAgreementVersion` (schema `AgreementVersionCreate`). */
  public static versionCreateToDto(input: AgreementVersionCreateInput): AgreementVersionCreateDto {
    return {
      agreementKey: input.agreementKey,
      version: input.version,
      party: input.party,
      scope: input.scope,
      companyRoles: input.companyRoles ? [...input.companyRoles] : undefined,
      title: input.title,
      documentUrls: input.documentUrls,
      reconsentRequired: input.reconsentRequired,
      reconsentDueAt: input.reconsentDueAt,
    };
  }
}
