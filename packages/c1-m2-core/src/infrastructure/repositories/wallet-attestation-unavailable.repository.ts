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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import type { WalletAttestationRepository } from '../../domain/repositories/wallet-attestation.repository';

/**
 * Adapter of the wallet step outside mock mode. The verification attestation comes from the BFF, which is the OIDC
 * client of the EBW-Connector (FRAMEWORK 5.2 step 2); neither C1-M2 nor the BFF has an operation that hands it to the
 * browser yet (README, open point 1), and this package invents none. Until then the step fails, the use case reports
 * `failed`, and the verification path DOCUMENTS is the one that works against the backend.
 */
export class WalletAttestationUnavailableRepository implements WalletAttestationRepository {
  public requestAttestation(): Promise<string | null> {
    return Promise.reject(new Error('The wallet step is not connected: the BFF does not hand out the verification attestation yet.'));
  }
}
