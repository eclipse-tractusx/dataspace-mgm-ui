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

/**
 * Entry point @dataspace-mgm/c4-m2-core. Proof of concept: the module runs on the in-memory adapters of
 * `@dataspace-mgm/c4-m2-core/testing` (mock mode of the portal). The HTTP adapter and `createC4M2Module(config)`
 * come with the vendored spec and the generated types in phase 3.
 */

/** The base path of the module under the app's api_base_url (`servers.url` /api/c4-m2 of the C4-M2 openapi.yaml). */
export const C4M2_BASE_PATH = '/c4-m2';

export type { C4M2Module } from './data/c4-m2-module.data';
export type { TechnicalUserRefAnemic } from './domain/anemics/technical-user-ref.anemic';
export type { WalletAccountCredentialsAnemic } from './domain/anemics/wallet-account-credentials.anemic';
export type { WalletAccountAnemic } from './domain/anemics/wallet-account.anemic';
export type { WalletAnemic } from './domain/anemics/wallet.anemic';
export type { WalletProvider } from './domain/valueObjects/wallet-provider.value-object';
export type { GetOwnWalletResult } from './domain/data/get-own-wallet-result.data';
export type { ListWalletAccountsResult, WalletAccountItem } from './domain/data/list-wallet-accounts-result.data';
export type { RetrieveWalletAccountCredentialsResult } from './domain/data/retrieve-wallet-account-credentials-result.data';
export type { TechnicalUserDirectory } from './domain/repositories/technical-user-directory.repository';
export type { WalletAccountRepository } from './domain/repositories/wallet-account.repository';
export type { WalletRepository } from './domain/repositories/wallet.repository';
export { C4M2_PROBLEM } from './domain/constants/c4-m2-problem.constant';
export { GetOwnWalletUseCase } from './application/useCases/get-own-wallet.use-case';
export { ListWalletAccountsUseCase } from './application/useCases/list-wallet-accounts.use-case';
export { RetrieveWalletAccountCredentialsUseCase } from './application/useCases/retrieve-wallet-account-credentials.use-case';
