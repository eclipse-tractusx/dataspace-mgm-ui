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

import { ensureData } from '@dataspace-mgm/core-http';
import type { CspRegistrationAnemic } from '../../domain/anemics/csp-registration.anemic';
import type { CspRegistrationRepository } from '../../domain/repositories/csp-registration.repository';
import type { C3M2Client } from '../data/c3-m2-infrastructure.data';
import { CspRegistrationMapper } from '../mappers/csp-registration.mapper';

/** Adapter of the port over HTTP (GET /api/c3-m2/companies/{companyId}). */
export class CspRegistrationHttpRepository implements CspRegistrationRepository {
  constructor(private readonly client: C3M2Client) {}

  public async get(companyId: string): Promise<CspRegistrationAnemic> {
    const dto = await ensureData(this.client.GET('/companies/{companyId}', { params: { path: { companyId } } }));
    return CspRegistrationMapper.toAnemic(dto);
  }
}
