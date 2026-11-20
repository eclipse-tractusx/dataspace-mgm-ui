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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import type { C1M2ProblemData } from '../../domain/data/c1-m2-problem.data';
import type { ProblemDto } from '../data/c1-m2-infrastructure.data';

const PROBLEM_PREFIX = 'urn:c1-m2:problem:';

/** The Problem Details body of a C1-M2 answer (schema `Problem`) → `C1M2ProblemData`, with its extension fields. */
export class ProblemMapper {
  /**
   * The problem of a 4xx answer of the module, or null: for a body that is no Problem Details of C1-M2 (another
   * `type`, e.g. of the BFF, or no JSON at all) and for every other status. `status` is the HTTP status of the
   * response, not the `status` member of the body.
   */
  public static toProblem(status: number, body: unknown): C1M2ProblemData | null {
    if (status < 400 || status > 499 || typeof body !== 'object' || body === null) {
      return null;
    }
    const dto = body as ProblemDto;
    if (typeof dto.type !== 'string' || !dto.type.startsWith(PROBLEM_PREFIX)) {
      return null;
    }
    return {
      status,
      type: dto.type,
      title: dto.title,
      detail: dto.detail,
      instance: dto.instance,
      errors: dto.errors,
      reason: dto.reason,
      fields: dto.fields,
      missing: dto.missing,
      missingDocumentTypes: dto.missingDocumentTypes,
      representationDeclarationMissing: dto.representationDeclarationMissing,
      existingApplicationId: dto.existingApplicationId,
      companyStatus: dto.companyStatus,
      reviewStatus: dto.reviewStatus,
    };
  }
}
