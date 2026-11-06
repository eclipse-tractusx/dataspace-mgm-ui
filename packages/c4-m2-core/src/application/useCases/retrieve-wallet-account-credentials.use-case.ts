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

import { CoreHttpErrorFactory, type CoreHttpErrorData } from '@dataspace-mgm/core-http';
import { C4M2_PROBLEM } from '../../domain/constants/c4-m2-problem.constant';
import type { RetrieveWalletAccountCredentialsResult } from '../../domain/data/retrieve-wallet-account-credentials-result.data';
import type { WalletAccountRepository } from '../../domain/repositories/wallet-account.repository';

/**
 * "Retrieve the access data of a wallet account": C4-M2 `retrieveWalletAccountCredentials` (README 7.3, permission
 * `retrieve_wallet_credentials`). The backend hands them out exactly once; every answer it gives is a result here, so
 * the page can say what happened. The credentials are returned as data and never logged.
 */
export class RetrieveWalletAccountCredentialsUseCase {
  constructor(private readonly walletAccounts: WalletAccountRepository) {}

  public async execute(technicalUserId: string): Promise<RetrieveWalletAccountCredentialsResult> {
    try {
      const credentials = await this.walletAccounts.retrieveCredentials(technicalUserId);
      return credentials ? { status: 'retrieved', credentials } : { status: 'not-found' };
    } catch (error) {
      return RetrieveWalletAccountCredentialsUseCase.fromError(CoreHttpErrorFactory.from(error));
    }
  }

  private static fromError(error: CoreHttpErrorData): RetrieveWalletAccountCredentialsResult {
    switch (error.status) {
      case 403:
        return { status: 'forbidden' };
      case 404:
        return { status: 'not-found' };
      case 409:
        if (error.problemType === C4M2_PROBLEM.noCredentials) {
          return { status: 'no-credentials' };
        }
        if (error.problemType === C4M2_PROBLEM.invalidState) {
          return { status: 'invalid-state' };
        }
        break;
      case 410:
        if (error.problemType === C4M2_PROBLEM.alreadyRetrieved) {
          return { status: 'already-retrieved' };
        }
        if (error.problemType === C4M2_PROBLEM.credentialsExpired) {
          return { status: 'expired' };
        }
        break;
    }
    return { status: 'failed', error };
  }
}
