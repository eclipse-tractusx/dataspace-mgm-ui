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

import { ProblemOutcomeDomain } from '../../domain/domains/problem-outcome.domain';
import type { DeleteDocumentResult } from '../../domain/data/delete-document-result.data';
import type { ApplicationRepository } from '../../domain/repositories/application.repository';

/** The Problem Details outcomes of this operation; every other error is `failed`. */
const DELETE_DOCUMENT_PROBLEMS = ['not-found', 'invalid-state'] as const;

/**
 * "Remove a supporting document" (status CREATED).
 * DELETE /applications/{applicationId}/documents/{documentId} (`deleteDocument`, README 7.9). Expected outcomes are results, not exceptions.
 */
export class DeleteDocumentUseCase {
  constructor(private readonly applications: ApplicationRepository) {}

  public async execute(applicationId: string, documentId: string): Promise<DeleteDocumentResult> {
    try {
      const deleted = await this.applications.deleteDocument(applicationId, documentId);
      return deleted ? { status: 'deleted' } : { status: 'not-found' };
    } catch (error) {
      return ProblemOutcomeDomain.resultOf(error, DELETE_DOCUMENT_PROBLEMS);
    }
  }
}
