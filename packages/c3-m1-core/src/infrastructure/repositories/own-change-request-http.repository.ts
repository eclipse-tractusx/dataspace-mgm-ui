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
import type { PageAnemic } from '../../domain/anemics/page.anemic';
import type { ChangeRequestDraftData } from '../../domain/data/c3-m1-commands.data';
import type { PageRequestData } from '../../domain/data/c3-m1-queries.data';
import type { OwnChangeRequestRepository } from '../../domain/repositories/own-change-request.repository';
import type { C3M1Client } from '../data/c3-m1-infrastructure.data';
import { ChangeRequestMapper } from '../mappers/change-request.mapper';

/** Adapter over HTTP of the change requests of the own company (paths under /companies/{companyId}/change-requests). */
export class OwnChangeRequestHttpRepository implements OwnChangeRequestRepository {
  constructor(private readonly client: C3M1Client) {}

  public async list(companyId: string, page: PageRequestData): Promise<PageAnemic<ChangeRequestAnemic>> {
    const dto = await ensureData(
      this.client.GET('/companies/{companyId}/change-requests', { params: { path: { companyId }, query: { page: page.page, size: page.size } } }),
    );
    return ChangeRequestMapper.pageToAnemic(dto);
  }

  /**
   * multipart/form-data: part `data` is the JSON of `ChangeRequestData` as a plain text field (C3-M1 reads it with
   * `Form(...)` as a string, team/2 router.py; a part with a file name would be refused), one part `documents` per file.
   * The browser sets the boundary; createCoreClient adds the CSRF token.
   */
  public async create(companyId: string, draft: ChangeRequestDraftData): Promise<ChangeRequestAnemic> {
    const data = ChangeRequestMapper.draftToData(draft);
    const dto = await ensureData(
      this.client.POST('/companies/{companyId}/change-requests', {
        params: { path: { companyId } },
        body: { data, documents: draft.documents.map((document) => document.fileName) },
        bodySerializer: () => {
          const form = new FormData();
          form.append('data', JSON.stringify(data));
          draft.documents.forEach((document) => form.append('documents', document.content, document.fileName));
          return form;
        },
      }),
    );
    return ChangeRequestMapper.toAnemic(dto);
  }

  public async withdraw(companyId: string, changeRequestId: string): Promise<ChangeRequestAnemic> {
    const dto = await ensureData(
      this.client.POST('/companies/{companyId}/change-requests/{changeRequestId}/withdraw', { params: { path: { companyId, changeRequestId } } }),
    );
    return ChangeRequestMapper.toAnemic(dto);
  }
}
