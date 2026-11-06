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

import type { components } from '../../generated/c1-m3-api';
import type { components as Registration } from '../../generated/registration-api';

// The backend contract uses camelCase, overriding the generic snake_case guideline.
export type ReviewStatus = components['schemas']['ReviewStatus'];
export type ReviewCheck = components['schemas']['ReviewCheck'];
export type ReviewCaseSummary = components['schemas']['ReviewCaseSummary'];
export type ReviewPage = components['schemas']['ReviewCasePage'];
export type Application = Registration['schemas']['ApplicationInternal'];
export type ReviewCase = Omit<components['schemas']['ReviewCase'], 'application'> & { application?: Application };
export type ReviewProblem = components['schemas']['Problem'] & {
  status: number;
  type: string;
};
export type Outcome<T> = { data: T } | { error: ReviewProblem };
export interface ReviewFilters {
  status?: ReviewStatus[];
  kind?: components['schemas']['ApplicationKind'][];
  verification?: components['schemas']['Verification'][];
  applicationId?: string;
  page?: number;
  size?: number;
}
export interface ReviewActor {
  id: string;
  name: string;
  permissions: string[];
}
export interface DecisionInput {
  id: string;
  comment?: string;
  reason?: string;
}
export interface DocumentInput {
  applicationId: string;
  documentId: string;
}
export interface ReviewDocument {
  content: Blob;
  fileName: string;
}
