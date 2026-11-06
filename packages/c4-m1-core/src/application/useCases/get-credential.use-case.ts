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
import type { GetCredentialResult } from '../../domain/data/get-credential-result.data';
import type { CredentialRepository } from '../../domain/repositories/credential.repository';
import { C4M1_HTTP_STATUS } from '../constants/c4-m1-http-status.constant';

/**
 * "Show one credential" for OSP staff (permission `manage_credentials`). C4-M1 0.2 has no
 * `GET /credentials/{credentialId}`; the port method is a stand-in until the backend adds it (open point).
 */
export class GetCredentialUseCase {
  constructor(private readonly credentials: CredentialRepository) {}

  public async execute(credentialId: string): Promise<GetCredentialResult> {
    try {
      const credential = await this.credentials.getCredential(credentialId);
      return credential ? { status: 'found', credential } : { status: 'not-found' };
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
