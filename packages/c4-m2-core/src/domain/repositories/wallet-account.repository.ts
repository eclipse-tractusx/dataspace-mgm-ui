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

import type { WalletAccountAnemic } from '../anemics/wallet-account.anemic';
import type { WalletAccountCredentialsAnemic } from '../anemics/wallet-account-credentials.anemic';

/** Port: what the use cases need from C4-M2 about the wallet accounts of technical users. */
export interface WalletAccountRepository {
  /** `getWalletAccount`. null = 404 (no account, or another company's). Throws on every other error. */
  getWalletAccount(technicalUserId: string): Promise<WalletAccountAnemic | null>;
  /**
   * `retrieveWalletAccountCredentials`: hands the credentials out exactly once. null = 404. Throws on every other
   * error, with the status and the Problem Details type (409 invalid-state or no-credentials, 410 already-retrieved
   * or credentials-expired).
   */
  retrieveCredentials(technicalUserId: string): Promise<WalletAccountCredentialsAnemic | null>;
}
