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

import type { CredentialDetailAnemic } from '../anemics/credential-detail.anemic';
import type { CredentialStatusAnemic } from '../anemics/credential-status.anemic';

/** Options of `createInMemoryC4M1Module`; every field has the mockup's fixtures or no failure as its default. */
export interface InMemoryC4M1ModuleOptions {
  /** The `CredentialStatusView[]` per company ID; default: Beispiel Maschinenbau GmbH with both credentials issued. */
  companyCredentials?: Readonly<Record<string, ReadonlyArray<CredentialStatusAnemic>>>;
  /** Thrown by every call for the own company's credentials (e.g. `c4m1Problem(403, 'forbidden')`). */
  companyCredentialFailure?: Error | null;
  /** The credentials of all companies; default: `CREDENTIALS_OF_ALL_COMPANIES`. */
  credentials?: ReadonlyArray<CredentialDetailAnemic>;
  /** Thrown by every call for the credentials of all companies. */
  credentialFailure?: Error | null;
  /** "Now" of `listOpenItems` and of `confirmRevocation`; default: the real time. */
  clock?: () => Date;
  /** Default `DEFAULT_OPEN_ORDER_HOURS`. */
  openOrderHours?: number;
}
