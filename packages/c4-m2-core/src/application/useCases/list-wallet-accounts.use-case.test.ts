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
import { describe, expect, it } from 'vitest';
import {
  BEISPIEL_MASCHINENBAU_COMPANY_ID,
  BEISPIEL_MASCHINENBAU_TECHNICAL_USERS,
  BEISPIEL_MASCHINENBAU_WALLET_ACCOUNTS,
  EDC_CONNECTOR_PRODUCTION,
  EDC_CONNECTOR_TEST,
  SUPPLIER_DATA_INTEGRATION,
  WALLET_ACCOUNT_AVAILABLE,
  WALLET_ACCOUNT_RETRIEVED,
} from '../../domain/testing/c4-m2.fixtures';
import { InMemoryTechnicalUserDirectory } from '../../domain/testing/in-memory-technical-user.directory';
import { InMemoryWalletAccountRepository } from '../../domain/testing/in-memory-wallet-account.repository';
import { ListWalletAccountsUseCase } from './list-wallet-accounts.use-case';

const directory = (failure: Error | null = null) =>
  new InMemoryTechnicalUserDirectory({ [BEISPIEL_MASCHINENBAU_COMPANY_ID]: BEISPIEL_MASCHINENBAU_TECHNICAL_USERS }, failure);

describe('ListWalletAccountsUseCase', () => {
  it('lists the technical users with wallet access and their wallet accounts, without sa203 (walletAccess NONE)', async () => {
    const accounts = new InMemoryWalletAccountRepository(BEISPIEL_MASCHINENBAU_WALLET_ACCOUNTS);
    const result = await new ListWalletAccountsUseCase(directory(), accounts).execute(BEISPIEL_MASCHINENBAU_COMPANY_ID);
    expect(result).toEqual({
      status: 'found',
      items: [
        { technicalUser: EDC_CONNECTOR_PRODUCTION, account: WALLET_ACCOUNT_AVAILABLE },
        { technicalUser: EDC_CONNECTOR_TEST, account: WALLET_ACCOUNT_RETRIEVED },
      ],
    });
    expect(accounts.calls.map((call) => call.technicalUserId)).not.toContain(SUPPLIER_DATA_INTEGRATION.id);
  });

  it('keeps a technical user whose wallet account C4-M2 does not know yet (404) with account null', async () => {
    const result = await new ListWalletAccountsUseCase(directory(), new InMemoryWalletAccountRepository([WALLET_ACCOUNT_AVAILABLE])).execute(
      BEISPIEL_MASCHINENBAU_COMPANY_ID,
    );
    expect(result).toEqual({
      status: 'found',
      items: [
        { technicalUser: EDC_CONNECTOR_PRODUCTION, account: WALLET_ACCOUNT_AVAILABLE },
        { technicalUser: EDC_CONNECTOR_TEST, account: null },
      ],
    });
  });

  it('returns an empty list for a company without technical users with wallet access', async () => {
    const result = await new ListWalletAccountsUseCase(new InMemoryTechnicalUserDirectory(), new InMemoryWalletAccountRepository()).execute(
      BEISPIEL_MASCHINENBAU_COMPANY_ID,
    );
    expect(result).toEqual({ status: 'found', items: [] });
  });

  it('does not call anything for a person without a company', async () => {
    const users = directory();
    const accounts = new InMemoryWalletAccountRepository();
    expect(await new ListWalletAccountsUseCase(users, accounts).execute(null)).toEqual({ status: 'no-company' });
    expect(users.calls).toEqual([]);
    expect(accounts.calls).toEqual([]);
  });

  it('reports a 403 of C4-M2 as forbidden', async () => {
    const failure = new CoreHttpException(403, 'urn:c4-m2:problem:forbidden', 'forbidden');
    const result = await new ListWalletAccountsUseCase(directory(), new InMemoryWalletAccountRepository([], [], failure)).execute(
      BEISPIEL_MASCHINENBAU_COMPANY_ID,
    );
    expect(result).toEqual({ status: 'forbidden' });
  });

  it('reports a 403 of the directory of technical users as forbidden', async () => {
    const failure = new CoreHttpException(403, 'urn:c2-m3:problem:forbidden', 'forbidden');
    const result = await new ListWalletAccountsUseCase(directory(failure), new InMemoryWalletAccountRepository()).execute(
      BEISPIEL_MASCHINENBAU_COMPANY_ID,
    );
    expect(result).toEqual({ status: 'forbidden' });
  });

  it('reports every other error as data', async () => {
    const result = await new ListWalletAccountsUseCase(directory(new Error('network down')), new InMemoryWalletAccountRepository()).execute(
      BEISPIEL_MASCHINENBAU_COMPANY_ID,
    );
    expect(result).toEqual({ status: 'failed', error: { status: null, problemType: null, message: 'network down' } });
  });
});
