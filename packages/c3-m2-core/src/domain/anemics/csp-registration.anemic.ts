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

/** The registration of a company at the core service provider (C3-M2 `CspRegistration`, README 7.1). */
export type CspRegistrationAnemic = Readonly<{
  companyId: string;
  /** Assigned or confirmed by the CSP; missing while PENDING or FAILED. */
  bpn: string | null;
  status: 'PENDING' | 'REGISTERED' | 'FAILED' | 'TRANSFERRED_AWAY';
  /** For FAILED, e.g. REGISTERED_AT_OTHER_OSP. */
  failureReason: string | null;
  /** Entered in the BPN → DID directory of the CSP. */
  did: string | null;
  membership: 'NONE' | 'REGISTERED' | 'DEREGISTERED';
  registeredAt: string | null;
  updatedAt: string | null;
}>;
