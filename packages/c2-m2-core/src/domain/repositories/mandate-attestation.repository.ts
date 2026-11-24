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

/**
 * Port of the wallet step in which a person shows a mandate of a company (C2-M2 6.8a). The adapter asks the
 * EBW-Connector through the BFF for a verification attestation with the purpose `representation`.
 */
export interface MandateAttestationRepository {
  /**
   * The verification attestation, or null when the person declined in the wallet. The step may leave the page: it
   * comes back to `returnTo` (default: the current page), and the caller asks again there.
   */
  requestAttestation(returnTo?: string): Promise<string | null>;
}
