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

import type { ChangeRequestAnemic } from '../anemics/change-request.anemic';
import type { PageAnemic } from '../anemics/page.anemic';
import type { ChangeRequestDraftData } from '../data/c3-m1-commands.data';
import type { PageRequestData } from '../data/c3-m1-queries.data';
import type { OwnChangeRequestRepository } from '../repositories/own-change-request.repository';
import { InMemoryC3M1Store } from './in-memory-c3-m1.store';

/** The change requests of the own company on the in-memory store: the success answers of README 7.4 to 7.6. */
export class InMemoryOwnChangeRequestRepository implements OwnChangeRequestRepository {
  private sequence = 100;

  constructor(private readonly store: InMemoryC3M1Store) {}

  public async list(companyId: string, page: PageRequestData): Promise<PageAnemic<ChangeRequestAnemic>> {
    this.store.enter('listOwnChangeRequests');
    const own = this.store.changeRequests
      .filter((request) => request.companyId === companyId)
      .map((request) => ({ ...request, companyName: null, decidedBy: null }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return InMemoryC3M1Store.page(own, page);
  }

  public async create(companyId: string, draft: ChangeRequestDraftData): Promise<ChangeRequestAnemic> {
    this.store.enter('createChangeRequest');
    const company = this.store.company(companyId);
    this.sequence += 1;
    const id = `e0000${this.sequence}-0000-4000-8000-000000000${this.sequence}`;
    const created: ChangeRequestAnemic = {
      id,
      companyId,
      companyName: company.name,
      status: 'OPEN',
      changes: {
        ...(draft.name !== undefined ? { name: draft.name } : {}),
        ...(draft.address !== undefined ? { address: draft.address } : {}),
        ...(draft.identifiers !== undefined ? { identifiers: draft.identifiers } : {}),
      },
      comment: draft.comment,
      documents: draft.documents.map((document, index) => ({
        id: `${id.slice(0, -2)}${index}0`,
        fileName: document.fileName,
        mediaType: document.mediaType as ChangeRequestAnemic['documents'][number]['mediaType'],
        sizeBytes: document.sizeBytes,
      })),
      requestedBy: this.store.actorId,
      decidedBy: null,
      decisionReason: null,
      createdAt: this.store.now(),
      closedAt: null,
    };
    this.store.saveChangeRequest(created);
    this.store.saveCompany({ ...company, openChangeRequestId: id });
    return { ...created, companyName: null };
  }

  public async withdraw(companyId: string, changeRequestId: string): Promise<ChangeRequestAnemic> {
    this.store.enter('withdrawChangeRequest');
    const request = this.store.changeRequest(changeRequestId);
    this.store.saveCompany({ ...this.store.company(companyId), openChangeRequestId: null });
    return this.store.saveChangeRequest({ ...request, status: 'WITHDRAWN', closedAt: this.store.now() });
  }
}
