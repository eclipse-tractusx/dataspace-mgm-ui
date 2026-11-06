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
import type { ChangeRequestDetailAnemic } from '../anemics/change-request-detail.anemic';
import type { DocumentFileAnemic } from '../anemics/document-file.anemic';
import type { PageAnemic } from '../anemics/page.anemic';
import type { ChangeRequestListQueryData } from '../data/c3-m1-queries.data';
import type { ChangeRequestReviewRepository } from '../repositories/change-request-review.repository';
import { c3m1Problem, InMemoryC3M1Store } from './in-memory-c3-m1.store';

/**
 * The review of change requests on the in-memory store: the success answers of README 7.14 to 7.18. Approving only
 * closes the request; applying the changes to the company is the module's work and is not imitated here.
 */
export class InMemoryChangeRequestReviewRepository implements ChangeRequestReviewRepository {
  constructor(private readonly store: InMemoryC3M1Store) {}

  public async list(query: ChangeRequestListQueryData): Promise<PageAnemic<ChangeRequestAnemic>> {
    this.store.enter('listChangeRequests');
    const matches = this.store.changeRequests
      .filter((request) => !query.status?.length || query.status.includes(request.status))
      .filter((request) => !query.companyId || request.companyId === query.companyId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return InMemoryC3M1Store.page(matches, query);
  }

  public async get(changeRequestId: string): Promise<ChangeRequestDetailAnemic> {
    this.store.enter('getChangeRequest');
    const request = this.store.changeRequest(changeRequestId);
    const company = this.store.company(request.companyId);
    return {
      ...request,
      company: {
        id: company.id,
        name: company.name,
        address: company.postalAddress,
        identifiers: company.identifiers,
        coreDataSource: company.coreDataSource,
        status: company.status,
      },
    };
  }

  /** Mock mode keeps no file content: the download is a short text that says so. */
  public async getDocument(changeRequestId: string, documentId: string): Promise<DocumentFileAnemic> {
    this.store.enter('getChangeRequestDocument');
    const document = this.store.changeRequest(changeRequestId).documents.find((item) => item.id === documentId);
    if (!document) {
      throw c3m1Problem(404, 'not-found');
    }
    const content = new Blob([`Mock mode: no content is stored for ${document.fileName}.\n`], { type: 'text/plain' });
    return { fileName: `${document.fileName}.txt`, mediaType: 'text/plain', sizeBytes: content.size, content };
  }

  private close(changeRequestId: string, status: 'APPROVED' | 'DECLINED', decisionReason: string | null): ChangeRequestAnemic {
    const request = this.store.changeRequest(changeRequestId);
    const company = this.store.company(request.companyId);
    this.store.saveCompany({ ...company, openChangeRequestId: null });
    return this.store.saveChangeRequest({ ...request, status, decidedBy: this.store.actorId, decisionReason, closedAt: this.store.now() });
  }

  public async approve(changeRequestId: string): Promise<ChangeRequestAnemic> {
    this.store.enter('approveChangeRequest');
    return this.close(changeRequestId, 'APPROVED', null);
  }

  public async decline(changeRequestId: string, reason: string): Promise<ChangeRequestAnemic> {
    this.store.enter('declineChangeRequest');
    return this.close(changeRequestId, 'DECLINED', reason);
  }
}
