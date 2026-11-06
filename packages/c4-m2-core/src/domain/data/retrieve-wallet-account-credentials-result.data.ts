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
import type { WalletAccountCredentialsAnemic } from '../anemics/wallet-account-credentials.anemic';

/** 200: the credentials, this one time. The page shows them and keeps them in memory only. */
export interface RetrieveWalletAccountCredentialsRetrieved {
  status: 'retrieved';
  credentials: WalletAccountCredentialsAnemic;
}

/** 410 `urn:c4-m2:problem:already-retrieved`: someone retrieved them before (or a second call). */
export interface RetrieveWalletAccountCredentialsAlreadyRetrieved {
  status: 'already-retrieved';
}

/** 410 `urn:c4-m2:problem:credentials-expired`: deleted after the deadline. */
export interface RetrieveWalletAccountCredentialsExpired {
  status: 'expired';
}

/** 409 `urn:c4-m2:problem:no-credentials`: the account has no retrievable credentials. */
export interface RetrieveWalletAccountCredentialsNoCredentials {
  status: 'no-credentials';
}

/** 409 `urn:c4-m2:problem:invalid-state`: the account is not ACTIVE. */
export interface RetrieveWalletAccountCredentialsInvalidState {
  status: 'invalid-state';
}

/** 403: the person lacks `retrieve_wallet_credentials`. */
export interface RetrieveWalletAccountCredentialsForbidden {
  status: 'forbidden';
}

/** 404: no wallet account of the technical user, or not the own company's. */
export interface RetrieveWalletAccountCredentialsNotFound {
  status: 'not-found';
}

export interface RetrieveWalletAccountCredentialsFailed {
  status: 'failed';
  error: CoreHttpErrorData;
}

export type RetrieveWalletAccountCredentialsResult =
  | RetrieveWalletAccountCredentialsRetrieved
  | RetrieveWalletAccountCredentialsAlreadyRetrieved
  | RetrieveWalletAccountCredentialsExpired
  | RetrieveWalletAccountCredentialsNoCredentials
  | RetrieveWalletAccountCredentialsInvalidState
  | RetrieveWalletAccountCredentialsForbidden
  | RetrieveWalletAccountCredentialsNotFound
  | RetrieveWalletAccountCredentialsFailed;
