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
import type { WalletAnemic } from '../anemics/wallet.anemic';

/** The wallet in any of its states (REQUESTED, VALIDATING, ACTIVE, FAILED); the page reads `wallet.status`. */
export interface GetOwnWalletFound {
  status: 'found';
  wallet: WalletAnemic;
}

/** The person is not bound to a company (no `company_id` in the session), e.g. OSP staff. */
export interface GetOwnWalletNoCompany {
  status: 'no-company';
}

/** 404: the company has no dataspace wallet yet. */
export interface GetOwnWalletNoWallet {
  status: 'no-wallet';
}

/** 403: the person lacks `view_dataspace_wallet`. */
export interface GetOwnWalletForbidden {
  status: 'forbidden';
}

export interface GetOwnWalletFailed {
  status: 'failed';
  error: CoreHttpErrorData;
}

export type GetOwnWalletResult =
  | GetOwnWalletFound
  | GetOwnWalletNoCompany
  | GetOwnWalletNoWallet
  | GetOwnWalletForbidden
  | GetOwnWalletFailed;
