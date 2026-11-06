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
import type { CountCredentialsByStatusResult } from '../../domain/data/count-credentials-by-status-result.data';
import type { CredentialRepository } from '../../domain/repositories/credential.repository';
import type { CredentialStatus } from '../../domain/valueObjects/credential-status.value-object';
import { C4M1_HTTP_STATUS } from '../constants/c4-m1-http-status.constant';

/**
 * The number of credentials of all companies per status, for the status chips (permission `manage_credentials`).
 * C4-M1 0.2 has no counts, so it asks `listCredentials` once per status with `size=1` and reads `total`: N calls,
 * spec-compatible (open point: a counts endpoint).
 */
export class CountCredentialsByStatusUseCase {
  constructor(private readonly credentials: CredentialRepository) {}

  public async execute(statuses: ReadonlyArray<CredentialStatus>): Promise<CountCredentialsByStatusResult> {
    try {
      const pages = await Promise.all(
        statuses.map((status) => this.credentials.listCredentials({ status: [status], page: 0, size: 1 })),
      );
      return { status: 'found', counts: statuses.map((status, index) => ({ status, total: pages[index].total })) };
    } catch (failure) {
      const error = CoreHttpErrorFactory.from(failure);
      if (error.status === C4M1_HTTP_STATUS.FORBIDDEN) {
        return { status: 'forbidden' };
      }
      return { status: 'failed', error };
    }
  }
}
