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

import type { ApplicationKind, Verification } from './c1-m2-enums.data';
import type { Address, Identifier } from './c1-m2-shapes.data';

/**
 * Schema `CompanyDataInput`. Verification path EBW: every field optional, missing ones come from the verification
 * attestation (README 6.5). DOCUMENTS: `legalName`, `address` and at least one identifier, no EBWOID (README 6.9).
 */
export interface CompanyDataInput {
  legalName?: string;
  shortName?: string;
  address?: Address;
  identifiers?: ReadonlyArray<Identifier>;
}

/** Schema `ApplicationCreate` (README 6.2, 7.2). */
export interface ApplicationCreateInput {
  kind: ApplicationKind;
  verification: Verification;
  /** The verification attestation of the EBW-Connector as received (compact JWS); only EBW. */
  attestation?: string;
  /** Reference to an existing company; not together with `bpn`; forbidden for ONBOARDING. */
  companyId?: string;
  bpn?: string;
  companyData?: CompanyDataInput;
  companyRoles?: ReadonlyArray<string>;
}
