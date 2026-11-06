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

import type { ListReviewsUseCase } from '../application/useCases/list-reviews.use-case';
import type { GetReviewUseCase } from '../application/useCases/get-review.use-case';
import type { ApproveReviewUseCase } from '../application/useCases/approve-review.use-case';
import type { DeclineReviewUseCase } from '../application/useCases/decline-review.use-case';
import type { GetReviewDocumentUseCase } from '../application/useCases/get-review-document.use-case';
export interface ReviewModule {
  list: ListReviewsUseCase;
  get: GetReviewUseCase;
  approve: ApproveReviewUseCase;
  decline: DeclineReviewUseCase;
  document: GetReviewDocumentUseCase;
}
