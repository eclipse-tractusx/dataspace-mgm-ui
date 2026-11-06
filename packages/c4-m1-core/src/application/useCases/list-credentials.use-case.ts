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
import type { CredentialQuery } from '../../domain/data/credential-query.data';
import type { ListCredentialsResult } from '../../domain/data/list-credentials-result.data';
import type { CredentialRepository } from '../../domain/repositories/credential.repository';
import { C4M1_HTTP_STATUS } from '../constants/c4-m1-http-status.constant';

/**
 * "Search the credentials of all companies" (C4-M1 `listCredentials`, permission `manage_credentials`, scope `osp`,
 * README 7.2): one page, filtered by the API, sorted by `changedAt` descending.
 */
export class ListCredentialsUseCase {
  constructor(private readonly credentials: CredentialRepository) {}

  public async execute(query: CredentialQuery): Promise<ListCredentialsResult> {
    try {
      return { status: 'found', page: await this.credentials.listCredentials(query) };
    } catch (failure) {
      const error = CoreHttpErrorFactory.from(failure);
      if (error.status === C4M1_HTTP_STATUS.FORBIDDEN) {
        return { status: 'forbidden' };
      }
      if (error.status === C4M1_HTTP_STATUS.BAD_REQUEST) {
        return { status: 'invalid', error };
      }
      return { status: 'failed', error };
    }
  }
}
