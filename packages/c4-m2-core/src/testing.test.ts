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

import { describe, expect, it } from 'vitest';
import {
  BEISPIEL_MASCHINENBAU_COMPANY_ID,
  BEISPIEL_MASCHINENBAU_WALLET,
  BEISPIEL_MASCHINENBAU_WALLET_FAILED,
  EDC_CONNECTOR_PRODUCTION,
  WALLET_ACCOUNT_CREDENTIALS,
  createInMemoryC4M2Module,
} from './testing';

describe('createInMemoryC4M2Module', () => {
  it('serves the data of Beispiel Maschinenbau GmbH by default', async () => {
    const module = createInMemoryC4M2Module();
    expect(await module.getOwnWallet.execute(BEISPIEL_MASCHINENBAU_COMPANY_ID)).toEqual({
      status: 'found',
      wallet: BEISPIEL_MASCHINENBAU_WALLET,
    });
    const list = await module.listWalletAccounts.execute(BEISPIEL_MASCHINENBAU_COMPANY_ID);
    expect(list.status === 'found' && list.items.map((item) => item.technicalUser.iamClientId)).toEqual(['sa201', 'sa202']);
  });

  it('keeps its state: after the retrieval the list shows the account as RETRIEVED', async () => {
    const module = createInMemoryC4M2Module();
    expect(await module.retrieveWalletAccountCredentials.execute(EDC_CONNECTOR_PRODUCTION.id)).toEqual({
      status: 'retrieved',
      credentials: WALLET_ACCOUNT_CREDENTIALS,
    });
    const list = await module.listWalletAccounts.execute(BEISPIEL_MASCHINENBAU_COMPANY_ID);
    expect(list.status === 'found' && list.items[0].account?.credentialsState).toBe('RETRIEVED');
  });

  it('takes other data and failures', async () => {
    const module = createInMemoryC4M2Module({ wallets: [BEISPIEL_MASCHINENBAU_WALLET_FAILED], technicalUserFailure: new Error('down') });
    expect(await module.getOwnWallet.execute(BEISPIEL_MASCHINENBAU_COMPANY_ID)).toEqual({
      status: 'found',
      wallet: BEISPIEL_MASCHINENBAU_WALLET_FAILED,
    });
    expect(await module.listWalletAccounts.execute(BEISPIEL_MASCHINENBAU_COMPANY_ID)).toMatchObject({ status: 'failed' });
  });
});
