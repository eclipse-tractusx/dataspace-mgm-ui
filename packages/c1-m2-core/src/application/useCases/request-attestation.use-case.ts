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

import { ProblemOutcomeDomain } from '../../domain/domains/problem-outcome.domain';
import type { RequestAttestationResult } from '../../domain/data/request-attestation-result.data';
import type { WalletAttestationRepository } from '../../domain/repositories/wallet-attestation.repository';

/**
 * "Verify with the Business Wallet": gets the verification attestation of the wallet step (stand-in for the BFF, open
 * point P0). Expected outcomes are results, not exceptions.
 */
export class RequestAttestationUseCase {
  constructor(private readonly wallet: WalletAttestationRepository) {}

  public async execute(): Promise<RequestAttestationResult> {
    try {
      const attestation = await this.wallet.requestAttestation();
      return attestation ? { status: 'received', attestation } : { status: 'cancelled' };
    } catch (error) {
      return ProblemOutcomeDomain.resultOf(error, []);
    }
  }
}
