/********************************************************************************
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

import { CoreHttpErrorFactory } from '@dataspace-mgm/core-http';
import type { MandateJoinRefusal, MandateJoinResult, MandateRefusalCause } from '../../domain/data/mandate-join.data';
import { MandateNotConfirmedException } from '../../domain/mandate-not-confirmed.exception';
import type { InvitationRepository } from '../../domain/repositories/invitation.repository';
import type { MandateAttestationRepository } from '../../domain/repositories/mandate-attestation.repository';

const PROBLEM_PREFIX = 'urn:c2-m2:problem:';
const REFUSALS: readonly MandateJoinRefusal[] = [
  'attestation-invalid',
  'representation-not-confirmed',
  'name-mismatch',
  'invitation-not-found',
  'company-not-active',
  'user-already-bound',
  'staff-company-conflict',
];
const CAUSES: readonly MandateRefusalCause[] = ['EXPIRED', 'PERSON_MISMATCH', 'COMPANY_MISMATCH', 'TYPE_NOT_ACCEPTED', 'ISSUER_NOT_TRUSTED'];

/**
 * A person joins the company that invited them by showing a mandate of that company in their wallet, instead of
 * typing the invitation code (C2-M2 6.8a, 7.10). Two steps: the wallet step yields a verification attestation, then
 * the backend accepts the invitation with it. The wallet step may leave the page; the page calls again after the
 * return (see MandateAttestationRepository).
 */
export class AcceptInvitationWithMandateUseCase {
  constructor(
    private readonly invitations: InvitationRepository,
    private readonly wallet: MandateAttestationRepository,
  ) {}

  public async execute(returnTo?: string): Promise<MandateJoinResult> {
    let attestation: string | null;
    try {
      attestation = await this.wallet.requestAttestation(returnTo);
    } catch (cause) {
      return { status: 'wallet-failed', message: CoreHttpErrorFactory.from(cause).message };
    }
    if (attestation === null) {
      return { status: 'cancelled' };
    }
    try {
      const data = this.invitations.acceptWithMandate ? await this.invitations.acceptWithMandate(attestation) : null;
      return data === null ? { status: 'failed', message: 'Accepting an invitation with a mandate is not connected.' } : { status: 'joined', data };
    } catch (cause) {
      const error = CoreHttpErrorFactory.from(cause);
      const name = error.problemType?.startsWith(PROBLEM_PREFIX) ? error.problemType.slice(PROBLEM_PREFIX.length) : null;
      const reason = REFUSALS.find((refusal) => refusal === name);
      if (!reason) {
        return { status: 'failed', message: error.message };
      }
      const reasons = cause instanceof MandateNotConfirmedException ? cause.reasons : [];
      return { status: 'refused', reason, causes: CAUSES.filter((known) => reasons.includes(known)) };
    }
  }
}
