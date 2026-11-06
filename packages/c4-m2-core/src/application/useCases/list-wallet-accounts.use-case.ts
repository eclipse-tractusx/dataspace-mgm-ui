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

import { CoreHttpErrorFactory } from '@dataspace-mgm/core-http';
import type { ListWalletAccountsResult, WalletAccountItem } from '../../domain/data/list-wallet-accounts-result.data';
import type { TechnicalUserDirectory } from '../../domain/repositories/technical-user-directory.repository';
import type { WalletAccountRepository } from '../../domain/repositories/wallet-account.repository';

/**
 * "Show the wallet accounts of our technical users": C4-M2 has no list per company (open point P0), so the use case
 * reads the technical users (C2-M3 stand-in), keeps those whose `walletAccess` is not NONE and reads the current
 * wallet account of each (`getWalletAccount`, README 7.2, permission `view_dataspace_wallet`).
 */
export class ListWalletAccountsUseCase {
  constructor(
    private readonly technicalUsers: TechnicalUserDirectory,
    private readonly walletAccounts: WalletAccountRepository,
  ) {}

  public async execute(companyId: string | null): Promise<ListWalletAccountsResult> {
    if (!companyId) {
      return { status: 'no-company' };
    }
    try {
      const users = (await this.technicalUsers.listTechnicalUsers(companyId)).filter((user) => user.walletAccess !== 'NONE');
      const items: WalletAccountItem[] = await Promise.all(
        users.map(async (technicalUser) => ({
          technicalUser,
          account: await this.walletAccounts.getWalletAccount(technicalUser.id),
        })),
      );
      return { status: 'found', items };
    } catch (error) {
      const data = CoreHttpErrorFactory.from(error);
      return data.status === 403 ? { status: 'forbidden' } : { status: 'failed', error: data };
    }
  }
}
