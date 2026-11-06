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

import { CoreHttpErrorFactory } from '@dataspace-mgm/core-http';
import type { GetCspRegistrationResult } from '../../domain/data/get-csp-registration-result.data';
import type { CspRegistrationRepository } from '../../domain/repositories/csp-registration.repository';

/** "CSP registration" of a company (C3-M2 `getCspRegistration`, README 7.1). Read only: the steps run on their own. */
export class GetCspRegistrationUseCase {
  constructor(private readonly registrations: CspRegistrationRepository) {}

  public async execute(companyId: string): Promise<GetCspRegistrationResult> {
    try {
      return { status: 'found', registration: await this.registrations.get(companyId) };
    } catch (error) {
      const data = CoreHttpErrorFactory.from(error);
      if (data.status === 404) {
        return { status: 'not-registered' };
      }
      if (data.status === 403) {
        return { status: 'forbidden' };
      }
      return { status: 'failed', error: data };
    }
  }
}
