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

/** Port: the review of change requests by the staff of the onboarding service provider (scope `osp`). */
export interface ChangeRequestReviewRepository {
  list(query: ChangeRequestListQueryData): Promise<PageAnemic<ChangeRequestAnemic>>;
  get(changeRequestId: string): Promise<ChangeRequestDetailAnemic>;
  getDocument(changeRequestId: string, documentId: string): Promise<DocumentFileAnemic>;
  approve(changeRequestId: string, comment: string | null): Promise<ChangeRequestAnemic>;
  decline(changeRequestId: string, reason: string): Promise<ChangeRequestAnemic>;
}
