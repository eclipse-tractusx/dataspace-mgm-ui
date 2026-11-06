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

import type { ChangeRequestAnemic } from '../../domain/anemics/change-request.anemic';
import type { OperationResult } from '../../domain/data/operation-result.data';
import { ChangeRequestDomain } from '../../domain/domains/change-request.domain';
import { OperationResultFactory } from '../../domain/factories/operation-result.factory';
import type { ChangeRequestReviewRepository } from '../../domain/repositories/change-request-review.repository';
import { executeOperation } from '../helpers/execute-operation.helper';

/** "Decline" a change request with a reason the Company Admin sees (C3-M1 `declineChangeRequest`, README 7.18). */
export class DeclineChangeRequestUseCase {
  constructor(private readonly reviews: ChangeRequestReviewRepository) {}

  public async execute(changeRequestId: string, reason: string): Promise<OperationResult<ChangeRequestAnemic>> {
    const errors = ChangeRequestDomain.validateDeclineReason(reason);
    if (errors.length) {
      return OperationResultFactory.invalid(errors);
    }
    return executeOperation(() => this.reviews.decline(changeRequestId, reason.trim()));
  }
}
