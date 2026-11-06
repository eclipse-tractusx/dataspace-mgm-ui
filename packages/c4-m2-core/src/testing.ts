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
 * Entry point @dataspace-mgm/c4-m2-core/testing: in-memory adapters, the fixtures of the wallets mockup and
 * `createInMemoryC4M2Module`, for tests of pages and use cases and for the mock mode of the portal.
 */

import { GetOwnWalletUseCase } from './application/useCases/get-own-wallet.use-case';
import { ListWalletAccountsUseCase } from './application/useCases/list-wallet-accounts.use-case';
import { RetrieveWalletAccountCredentialsUseCase } from './application/useCases/retrieve-wallet-account-credentials.use-case';
import type { C4M2Module } from './data/c4-m2-module.data';
import type { TechnicalUserRefAnemic } from './domain/anemics/technical-user-ref.anemic';
import type { WalletAccountAnemic } from './domain/anemics/wallet-account.anemic';
import type { WalletAccountCredentialsAnemic } from './domain/anemics/wallet-account-credentials.anemic';
import type { WalletAnemic } from './domain/anemics/wallet.anemic';
import {
  BEISPIEL_MASCHINENBAU_COMPANY_ID,
  BEISPIEL_MASCHINENBAU_TECHNICAL_USERS,
  BEISPIEL_MASCHINENBAU_WALLET,
  BEISPIEL_MASCHINENBAU_WALLET_ACCOUNTS,
  WALLET_ACCOUNT_CREDENTIALS,
} from './domain/testing/c4-m2.fixtures';
import { InMemoryTechnicalUserDirectory } from './domain/testing/in-memory-technical-user.directory';
import { InMemoryWalletAccountRepository } from './domain/testing/in-memory-wallet-account.repository';
import { InMemoryWalletRepository } from './domain/testing/in-memory-wallet.repository';

export {
  BEISPIEL_MASCHINENBAU_COMPANY_ID,
  BEISPIEL_MASCHINENBAU_TECHNICAL_USERS,
  BEISPIEL_MASCHINENBAU_WALLET,
  BEISPIEL_MASCHINENBAU_WALLET_ACCOUNTS,
  BEISPIEL_MASCHINENBAU_WALLET_FAILED,
  BEISPIEL_MASCHINENBAU_WALLET_VALIDATING,
  EDC_CONNECTOR_PRODUCTION,
  EDC_CONNECTOR_TEST,
  SUPPLIER_DATA_INTEGRATION,
  WALLET_ACCOUNT_AVAILABLE,
  WALLET_ACCOUNT_CREDENTIALS,
  WALLET_ACCOUNT_RETRIEVED,
} from './domain/testing/c4-m2.fixtures';
export { InMemoryTechnicalUserDirectory } from './domain/testing/in-memory-technical-user.directory';
export {
  InMemoryWalletAccountRepository,
  type WalletAccountRepositoryCall,
} from './domain/testing/in-memory-wallet-account.repository';
export { InMemoryWalletRepository } from './domain/testing/in-memory-wallet.repository';

/** What the in-memory module holds; every field defaults to the data of Beispiel Maschinenbau GmbH. */
export interface InMemoryC4M2ModuleOptions {
  wallets?: ReadonlyArray<WalletAnemic>;
  technicalUsersByCompany?: Readonly<Record<string, ReadonlyArray<TechnicalUserRefAnemic>>>;
  walletAccounts?: ReadonlyArray<WalletAccountAnemic>;
  credentials?: ReadonlyArray<WalletAccountCredentialsAnemic>;
  /** Thrown by getWallet, e.g. a CoreHttpException with status 403. */
  walletFailure?: Error | null;
  /** Thrown by the directory of technical users. */
  technicalUserFailure?: Error | null;
  /** Thrown by getWalletAccount and retrieveCredentials. */
  walletAccountFailure?: Error | null;
}

/** The C4-M2 module on in-memory adapters (mock mode of the portal, page tests). One instance keeps its state. */
export function createInMemoryC4M2Module(options: InMemoryC4M2ModuleOptions = {}): C4M2Module {
  const wallets = new InMemoryWalletRepository(options.wallets ?? [BEISPIEL_MASCHINENBAU_WALLET], options.walletFailure ?? null);
  const technicalUsers = new InMemoryTechnicalUserDirectory(
    options.technicalUsersByCompany ?? { [BEISPIEL_MASCHINENBAU_COMPANY_ID]: BEISPIEL_MASCHINENBAU_TECHNICAL_USERS },
    options.technicalUserFailure ?? null,
  );
  const walletAccounts = new InMemoryWalletAccountRepository(
    options.walletAccounts ?? BEISPIEL_MASCHINENBAU_WALLET_ACCOUNTS,
    options.credentials ?? [WALLET_ACCOUNT_CREDENTIALS],
    options.walletAccountFailure ?? null,
  );
  return {
    getOwnWallet: new GetOwnWalletUseCase(wallets),
    listWalletAccounts: new ListWalletAccountsUseCase(technicalUsers, walletAccounts),
    retrieveWalletAccountCredentials: new RetrieveWalletAccountCredentialsUseCase(walletAccounts),
  };
}
