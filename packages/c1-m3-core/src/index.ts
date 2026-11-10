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

import type { CoreModuleConfig } from '@dataspace-mgm/core-http';
import { ListReviewsUseCase } from './application/useCases/list-reviews.use-case';
import { GetReviewUseCase } from './application/useCases/get-review.use-case';
import { ApproveReviewUseCase } from './application/useCases/approve-review.use-case';
import { DeclineReviewUseCase } from './application/useCases/decline-review.use-case';
import { GetReviewDocumentUseCase } from './application/useCases/get-review-document.use-case';
import type { ReviewRepository } from './domain/repositories/review.repository';
import type { ReviewModule } from './data/review-module.data';
import { ReviewHttpRepository } from './infrastructure/repositories/review-http.repository';
import { MockReviewRepository } from './mocks/mock-review.repository';
import type { MockRegistrationLink } from './mocks/mock-registration-link';
export function createReviewModule(repository: ReviewRepository): ReviewModule {
  return {
    list: new ListReviewsUseCase(repository),
    get: new GetReviewUseCase(repository),
    approve: new ApproveReviewUseCase(repository),
    decline: new DeclineReviewUseCase(repository),
    document: new GetReviewDocumentUseCase(repository),
  };
}
export function createHttpReviewModule(config: CoreModuleConfig, registrationConfig: CoreModuleConfig) {
  return createReviewModule(new ReviewHttpRepository(config, registrationConfig));
}
export function createMockReviewModule(link?: MockRegistrationLink) {
  const server = new MockReviewRepository(link);
  return { module: createReviewModule(server), server };
}
export { REVIEW_ACTORS } from './mocks/review-fixtures';
export type { LinkedApplication, MockRegistrationLink } from './mocks/mock-registration-link';
export type * from './domain/data/review.data';
export type { ReviewModule } from './data/review-module.data';
export type { ReviewRepository } from './domain/repositories/review.repository';
