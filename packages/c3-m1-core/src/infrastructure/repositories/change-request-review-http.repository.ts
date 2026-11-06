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
import type { ChangeRequestAnemic } from '../../domain/anemics/change-request.anemic';
import type { ChangeRequestDetailAnemic } from '../../domain/anemics/change-request-detail.anemic';
import type { DocumentFileAnemic } from '../../domain/anemics/document-file.anemic';
import type { PageAnemic } from '../../domain/anemics/page.anemic';
import type { ChangeRequestListQueryData } from '../../domain/data/c3-m1-queries.data';
import type { ChangeRequestReviewRepository } from '../../domain/repositories/change-request-review.repository';
import type { C3M1Client } from '../data/c3-m1-infrastructure.data';
import { ChangeRequestMapper } from '../mappers/change-request.mapper';

/** `attachment; filename="x.pdf"` → x.pdf; only the base name, so a path in the header cannot leak into a save dialog. */
export function fileNameOf(contentDisposition: string | null, fallback: string): string {
  const match = contentDisposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  if (!match) {
    return fallback;
  }
  let name = match[1];
  try {
    name = decodeURIComponent(name);
  } catch {
    // not percent-encoded: keep it as it is
  }
  const base = name.split(/[\\/]/).pop()?.trim();
  return base ? base : fallback;
}

/** Adapter over HTTP of the review of change requests (paths under /osp/change-requests). */
export class ChangeRequestReviewHttpRepository implements ChangeRequestReviewRepository {
  constructor(private readonly client: C3M1Client) {}

  public async list(query: ChangeRequestListQueryData): Promise<PageAnemic<ChangeRequestAnemic>> {
    const dto = await ensureData(
      this.client.GET('/osp/change-requests', {
        params: {
          query: { page: query.page, size: query.size, status: query.status?.length ? [...query.status] : undefined, companyId: query.companyId },
        },
      }),
    );
    return ChangeRequestMapper.pageToAnemic(dto);
  }

  public async get(changeRequestId: string): Promise<ChangeRequestDetailAnemic> {
    const dto = await ensureData(this.client.GET('/osp/change-requests/{changeRequestId}', { params: { path: { changeRequestId } } }));
    return ChangeRequestMapper.detailToAnemic(dto);
  }

  public async getDocument(changeRequestId: string, documentId: string): Promise<DocumentFileAnemic> {
    const result = await this.client.GET('/osp/change-requests/{changeRequestId}/documents/{documentId}', {
      params: { path: { changeRequestId, documentId } },
      parseAs: 'blob',
    });
    const content = await ensureData(Promise.resolve(result));
    return {
      fileName: fileNameOf(result.response.headers.get('content-disposition'), documentId),
      mediaType: content.type || (result.response.headers.get('content-type') ?? 'application/octet-stream'),
      sizeBytes: content.size,
      content,
    };
  }

  public async approve(changeRequestId: string, comment: string | null): Promise<ChangeRequestAnemic> {
    const dto = await ensureData(
      this.client.POST('/osp/change-requests/{changeRequestId}/approve', {
        params: { path: { changeRequestId } },
        body: comment ? { comment } : {},
      }),
    );
    return ChangeRequestMapper.toAnemic(dto);
  }

  public async decline(changeRequestId: string, reason: string): Promise<ChangeRequestAnemic> {
    const dto = await ensureData(
      this.client.POST('/osp/change-requests/{changeRequestId}/decline', { params: { path: { changeRequestId } }, body: { reason } }),
    );
    return ChangeRequestMapper.toAnemic(dto);
  }
}
