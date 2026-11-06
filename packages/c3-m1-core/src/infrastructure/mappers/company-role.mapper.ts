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

import type { CompanyRoleStateAnemic } from '../../domain/anemics/company-role-state.anemic';
import type { CompanyRoleStateDto } from '../data/c3-m1-infrastructure.data';

/**
 * C3-M1 `CompanyRoleState` → anemic. The module builds names, links and `assignableBy` from its catalogue and the
 * terms of C1-M2; a missing entry arrives as null although the spec marks it required, so the mapper keeps the UI safe.
 */
export class CompanyRoleMapper {
  public static toAnemic(dto: CompanyRoleStateDto): CompanyRoleStateAnemic {
    return {
      companyRole: dto.companyRole,
      assignableBy: dto.assignableBy ?? 'SEED',
      status: dto.status,
      description: dto.description ?? '',
      agreements: dto.agreements.map((agreement) => ({
        agreementKey: agreement.agreementKey,
        version: agreement.version,
        name: agreement.name ?? agreement.agreementKey,
        documentUrl: agreement.documentUrl ?? '',
        consentStatus: agreement.consentStatus ?? null,
        consentedVersion: agreement.consentedVersion ?? null,
        consentedAt: agreement.consentedAt ?? null,
      })),
    };
  }
}
