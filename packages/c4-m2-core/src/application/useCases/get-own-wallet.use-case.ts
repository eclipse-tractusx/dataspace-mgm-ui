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
import type { GetOwnWalletResult } from '../../domain/data/get-own-wallet-result.data';
import type { WalletRepository } from '../../domain/repositories/wallet.repository';

/**
 * "Show our dataspace wallet": reads the wallet of the signed-in person's company (C4-M2 `getWallet`, README 7.1,
 * permission `view_dataspace_wallet`). The company comes from the session; the module checks again that it is the own
 * one. The wallet's `status` (VALIDATING, FAILED, ...) is data of the `found` result, not a result of its own.
 */
export class GetOwnWalletUseCase {
  constructor(private readonly wallets: WalletRepository) {}

  public async execute(companyId: string | null): Promise<GetOwnWalletResult> {
    if (!companyId) {
      return { status: 'no-company' };
    }
    try {
      const wallet = await this.wallets.getWallet(companyId);
      return wallet ? { status: 'found', wallet } : { status: 'no-wallet' };
    } catch (error) {
      const data = CoreHttpErrorFactory.from(error);
      return data.status === 403 ? { status: 'forbidden' } : { status: 'failed', error: data };
    }
  }
}
