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

import type { ChangeRequestAnemic } from '../../domain/anemics/change-request.anemic';
import type { ChangeRequestDetailAnemic } from '../../domain/anemics/change-request-detail.anemic';
import type { PageAnemic } from '../../domain/anemics/page.anemic';
import type { ChangeRequestDraftData } from '../../domain/data/c3-m1-commands.data';
import type {
  ChangeRequestChangesDto,
  ChangeRequestDetailDto,
  ChangeRequestDto,
  ChangeRequestPageDto,
} from '../data/c3-m1-infrastructure.data';
import { AddressMapper } from './address.mapper';
import { CompanyMapper } from './company.mapper';

/** C3-M1 `ChangeRequest`, `ChangeRequestDetail`, `ChangeRequestPage` ↔ anemics. */
export class ChangeRequestMapper {
  public static toAnemic(dto: ChangeRequestDto): ChangeRequestAnemic {
    const changes: { -readonly [K in keyof ChangeRequestAnemic['changes']]: ChangeRequestAnemic['changes'][K] } = {};
    if (dto.changes.name !== undefined) {
      changes.name = dto.changes.name;
    }
    if (dto.changes.address !== undefined) {
      changes.address = AddressMapper.fieldsToAnemic(dto.changes.address);
    }
    if (dto.changes.identifiers !== undefined) {
      changes.identifiers = dto.changes.identifiers.map(({ type, value }) => ({ type, value }));
    }
    return {
      id: dto.id,
      companyId: dto.companyId,
      companyName: dto.companyName ?? null,
      status: dto.status,
      changes,
      comment: dto.comment,
      documents: dto.documents.map(({ id, fileName, mediaType, sizeBytes }) => ({ id, fileName, mediaType, sizeBytes })),
      requestedBy: dto.requestedBy,
      decidedBy: dto.decidedBy ?? null,
      decisionReason: dto.decisionReason ?? null,
      createdAt: dto.createdAt,
      closedAt: dto.closedAt ?? null,
    };
  }

  public static detailToAnemic(dto: ChangeRequestDetailDto): ChangeRequestDetailAnemic {
    return {
      ...ChangeRequestMapper.toAnemic(dto),
      company: {
        id: dto.company.id,
        name: dto.company.name,
        address: AddressMapper.toAnemic(dto.company.address),
        identifiers: dto.company.identifiers.map(CompanyMapper.identifierToAnemic),
        coreDataSource: dto.company.coreDataSource,
        status: dto.company.status,
      },
    };
  }

  public static pageToAnemic(dto: ChangeRequestPageDto): PageAnemic<ChangeRequestAnemic> {
    return { items: dto.items.map(ChangeRequestMapper.toAnemic), page: dto.page, size: dto.size, total: dto.total };
  }

  /** The part `data` of the multipart request (`ChangeRequestData`): only the changed parts and the comment. */
  public static draftToData(draft: ChangeRequestDraftData): ChangeRequestChangesDto & { comment: string } {
    return {
      ...(draft.name !== undefined ? { name: draft.name.trim() } : {}),
      ...(draft.address !== undefined ? { address: AddressMapper.fieldsToDto(draft.address) } : {}),
      ...(draft.identifiers !== undefined ? { identifiers: draft.identifiers.map(({ type, value }) => ({ type, value: value.trim() })) } : {}),
      comment: draft.comment,
    };
  }
}
