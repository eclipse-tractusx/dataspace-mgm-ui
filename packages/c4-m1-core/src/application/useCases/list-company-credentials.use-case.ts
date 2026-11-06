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
import type { ListCompanyCredentialsResult } from '../../domain/data/list-company-credentials-result.data';
import type { CompanyCredentialRepository } from '../../domain/repositories/company-credential.repository';
import { C4M1_HTTP_STATUS } from '../constants/c4-m1-http-status.constant';

/**
 * "Show the credentials of my company": the status per credential type (C4-M1 `listCompanyCredentials`, permission
 * `view_credentials`, scope `company`, README 7.1). The company comes from the session; the module checks again that
 * it is the person's own.
 */
export class ListCompanyCredentialsUseCase {
  constructor(private readonly companyCredentials: CompanyCredentialRepository) {}

  public async execute(companyId: string | null): Promise<ListCompanyCredentialsResult> {
    if (!companyId) {
      return { status: 'no-company' };
    }
    try {
      const credentials = await this.companyCredentials.listCompanyCredentials(companyId);
      return credentials ? { status: 'found', credentials } : { status: 'not-found' };
    } catch (failure) {
      const error = CoreHttpErrorFactory.from(failure);
      if (error.status === C4M1_HTTP_STATUS.FORBIDDEN) {
        return { status: 'forbidden' };
      }
      if (error.status === C4M1_HTTP_STATUS.NOT_FOUND) {
        return { status: 'not-found' };
      }
      return { status: 'failed', error };
    }
  }
}
