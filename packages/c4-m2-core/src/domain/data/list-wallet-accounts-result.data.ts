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

import type { CoreHttpErrorData } from '@dataspace-mgm/core-http';
import type { TechnicalUserRefAnemic } from '../anemics/technical-user-ref.anemic';
import type { WalletAccountAnemic } from '../anemics/wallet-account.anemic';

/** A technical user with wallet access and its current wallet account; null while C4-M2 has none (404). */
export interface WalletAccountItem {
  technicalUser: TechnicalUserRefAnemic;
  account: WalletAccountAnemic | null;
}

/** The technical users whose `walletAccess` is not NONE, in the order of the directory; may be empty. */
export interface ListWalletAccountsFound {
  status: 'found';
  items: ReadonlyArray<WalletAccountItem>;
}

export interface ListWalletAccountsNoCompany {
  status: 'no-company';
}

/** 403 from C4-M2 or from the directory of technical users. */
export interface ListWalletAccountsForbidden {
  status: 'forbidden';
}

export interface ListWalletAccountsFailed {
  status: 'failed';
  error: CoreHttpErrorData;
}

export type ListWalletAccountsResult =
  | ListWalletAccountsFound
  | ListWalletAccountsNoCompany
  | ListWalletAccountsForbidden
  | ListWalletAccountsFailed;
