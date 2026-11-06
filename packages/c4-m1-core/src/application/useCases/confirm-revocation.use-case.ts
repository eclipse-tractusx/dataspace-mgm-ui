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
import type { ConfirmRevocationResult } from '../../domain/data/confirm-revocation-result.data';
import { RevocationNoteFactory } from '../../domain/factories/revocation-note.factory';
import type { CredentialRepository } from '../../domain/repositories/credential.repository';
import { C4M1_HTTP_STATUS } from '../constants/c4-m1-http-status.constant';

/**
 * "Confirm a revocation done by hand at the Credential Issuer" (C4-M1 `confirmRevocation`, permission
 * `manage_credentials`, scope `osp`, README 7.3). The note is pre-checked (1 to 500 characters) and sent trimmed;
 * whether the status allows the confirmation is decided by the API (409 → `conflict`).
 */
export class ConfirmRevocationUseCase {
  constructor(private readonly credentials: CredentialRepository) {}

  public async execute(credentialId: string, note: string): Promise<ConfirmRevocationResult> {
    const checked = RevocationNoteFactory.create(note);
    if (!checked.valid) {
      return { status: 'invalid', key: checked.key, error: null };
    }
    try {
      const credential = await this.credentials.confirmRevocation(credentialId, checked.note);
      return credential ? { status: 'confirmed', credential } : { status: 'not-found' };
    } catch (failure) {
      const error = CoreHttpErrorFactory.from(failure);
      switch (error.status) {
        case C4M1_HTTP_STATUS.BAD_REQUEST:
          return { status: 'invalid', key: 'validation.revocationNoteRejected', error };
        case C4M1_HTTP_STATUS.FORBIDDEN:
          return { status: 'forbidden' };
        case C4M1_HTTP_STATUS.NOT_FOUND:
          return { status: 'not-found' };
        case C4M1_HTTP_STATUS.CONFLICT:
          return { status: 'conflict', error };
        default:
          return { status: 'failed', error };
      }
    }
  }
}
