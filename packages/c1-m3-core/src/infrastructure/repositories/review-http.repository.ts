/********************************************************************************
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
 * to the project's license. Human review is required before committing.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Codex (GPT-6)
 ********************************************************************************/

import { createCoreClient, ensureData, type CoreModuleConfig } from '@dataspace-mgm/core-http';
import type { paths } from '../../generated/c1-m3-api';
import type { paths as RegistrationPaths } from '../../generated/registration-api';
import type {
  DecisionInput,
  DocumentInput,
  Outcome,
  ReviewCase,
  ReviewDocument,
  ReviewFilters,
  ReviewPage,
  ReviewProblem,
} from '../../domain/data/review.data';
import type { ReviewRepository } from '../../domain/repositories/review.repository';

export class ReviewHttpRepository implements ReviewRepository {
  private client;
  private registration;
  constructor(config: CoreModuleConfig, registrationConfig: CoreModuleConfig) {
    this.client = createCoreClient<paths>(config);
    this.registration = createCoreClient<RegistrationPaths>(registrationConfig);
  }
  private async call<T>(
    run: () => Promise<{ data?: unknown; error?: unknown; response: Response }>,
  ): Promise<Outcome<T>> {
    try {
      const reply = await run();
      if (!reply.response.ok) {
        const problem = reply.error as Partial<ReviewProblem> | undefined;
        return {
          error: {
            ...problem,
            status: reply.response.status,
            type: problem?.type ?? 'urn:c1-m3:problem:upstream-error',
          },
        };
      }
      return { data: (await ensureData(Promise.resolve(reply))) as T };
    } catch {
      return {
        error: { status: 502, type: 'urn:c1-m3:problem:upstream-error' },
      };
    }
  }
  list(filters: ReviewFilters) {
    return this.call<ReviewPage>(() => this.client.GET('/review-cases', { params: { query: filters } }));
  }
  get(id: string) {
    return this.call<ReviewCase>(() =>
      this.client.GET('/review-cases/{reviewCaseId}', {
        params: { path: { reviewCaseId: id } },
      }),
    );
  }
  approve(input: DecisionInput) {
    return this.call<ReviewCase>(() =>
      this.client.POST('/review-cases/{reviewCaseId}/approve', {
        params: { path: { reviewCaseId: input.id } },
        body: input.comment ? { comment: input.comment } : {},
      }),
    );
  }
  decline(input: DecisionInput) {
    return this.call<ReviewCase>(() =>
      this.client.POST('/review-cases/{reviewCaseId}/decline', {
        params: { path: { reviewCaseId: input.id } },
        body: { reason: input.reason ?? '' },
      }),
    );
  }
  async document(input: DocumentInput): Promise<Outcome<ReviewDocument>> {
    const result = await this.call<Blob>(() =>
      this.registration.GET('/osp/applications/{applicationId}/documents/{documentId}', {
        params: { path: input },
        parseAs: 'blob',
      }),
    );
    return 'error' in result
      ? result
      : {
          data: {
            content: result.data,
            fileName: `document-${input.documentId}`,
          },
        };
  }
}
