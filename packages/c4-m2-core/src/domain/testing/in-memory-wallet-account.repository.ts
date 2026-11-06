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

import { CoreHttpException } from '@dataspace-mgm/core-http';
import { C4M2_PROBLEM } from '../constants/c4-m2-problem.constant';
import type { WalletAccountAnemic } from '../anemics/wallet-account.anemic';
import type { WalletAccountCredentialsAnemic } from '../anemics/wallet-account-credentials.anemic';
import type { WalletAccountRepository } from '../repositories/wallet-account.repository';

export interface WalletAccountRepositoryCall {
  operation: 'getWalletAccount' | 'retrieveCredentials';
  technicalUserId: string;
}

/**
 * In-memory adapter of the wallet account port. It plays the backend of C4-M2 README 7.3: the credentials are handed
 * out once, then the account is RETRIEVED and every further call answers 410 already-retrieved. It never logs them.
 */
export class InMemoryWalletAccountRepository implements WalletAccountRepository {
  public readonly calls: WalletAccountRepositoryCall[] = [];
  private readonly accounts: WalletAccountAnemic[];
  private readonly credentials: Map<string, WalletAccountCredentialsAnemic>;

  constructor(
    accounts: ReadonlyArray<WalletAccountAnemic> = [],
    credentials: ReadonlyArray<WalletAccountCredentialsAnemic> = [],
    private readonly failure: Error | null = null,
  ) {
    this.accounts = [...accounts];
    this.credentials = new Map(credentials.map((entry) => [entry.walletAccountRef, entry]));
  }

  public async getWalletAccount(technicalUserId: string): Promise<WalletAccountAnemic | null> {
    this.calls.push({ operation: 'getWalletAccount', technicalUserId });
    if (this.failure) {
      throw this.failure;
    }
    return this.current(technicalUserId);
  }

  public async retrieveCredentials(technicalUserId: string): Promise<WalletAccountCredentialsAnemic | null> {
    this.calls.push({ operation: 'retrieveCredentials', technicalUserId });
    if (this.failure) {
      throw this.failure;
    }
    const account = this.current(technicalUserId);
    if (!account) {
      return null;
    }
    if (account.status !== 'ACTIVE') {
      throw new CoreHttpException(409, C4M2_PROBLEM.invalidState, 'The wallet account is not active.');
    }
    if (account.credentialsState === 'RETRIEVED') {
      throw new CoreHttpException(410, C4M2_PROBLEM.alreadyRetrieved, 'The credentials were already retrieved.');
    }
    if (account.credentialsState === 'EXPIRED') {
      throw new CoreHttpException(410, C4M2_PROBLEM.credentialsExpired, 'The credentials expired.');
    }
    const credentials = this.credentials.get(account.walletAccountRef);
    if (account.credentialsState === 'NONE' || !credentials) {
      throw new CoreHttpException(409, C4M2_PROBLEM.noCredentials, 'The wallet account has no credentials.');
    }
    this.credentials.delete(account.walletAccountRef);
    this.replace({ ...account, credentialsState: 'RETRIEVED', credentialsExpireAt: null, changedAt: new Date().toISOString() });
    return credentials;
  }

  /** The account with a status other than DELETED, otherwise the last one added (README 7.2: the latest). */
  private current(technicalUserId: string): WalletAccountAnemic | null {
    const own = this.accounts.filter((account) => account.technicalUserId === technicalUserId);
    return own.find((account) => account.status !== 'DELETED') ?? own.at(-1) ?? null;
  }

  private replace(updated: WalletAccountAnemic): void {
    const index = this.accounts.findIndex((account) => account.walletAccountRef === updated.walletAccountRef);
    this.accounts[index] = updated;
  }
}
