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
import type { PageAnemic } from '../../domain/anemics/page.anemic';
import type { PageRequestData } from '../../domain/data/c3-m1-queries.data';
import type { OperationResult } from '../../domain/data/operation-result.data';
import type { OwnChangeRequestRepository } from '../../domain/repositories/own-change-request.repository';
import { executeOperation } from '../helpers/execute-operation.helper';

/** "Your change requests" (C3-M1 `listOwnChangeRequests`, README 7.5), newest first. */
export class ListOwnChangeRequestsUseCase {
  constructor(private readonly changeRequests: OwnChangeRequestRepository) {}

  public execute(companyId: string, page: PageRequestData): Promise<OperationResult<PageAnemic<ChangeRequestAnemic>>> {
    return executeOperation(() => this.changeRequests.list(companyId, page));
  }
}
