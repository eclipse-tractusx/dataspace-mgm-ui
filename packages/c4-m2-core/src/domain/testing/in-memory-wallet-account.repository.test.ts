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
import { EDC_CONNECTOR_PRODUCTION, WALLET_ACCOUNT_AVAILABLE, WALLET_ACCOUNT_CREDENTIALS } from './c4-m2.fixtures';
import { InMemoryWalletAccountRepository } from './in-memory-wallet-account.repository';

describe('InMemoryWalletAccountRepository', () => {
  it('reads the account with a status other than DELETED before a deleted one', async () => {
    const deleted = { ...WALLET_ACCOUNT_AVAILABLE, walletAccountRef: 'b7a10009-0000-4000-8000-000000000009', status: 'DELETED' as const };
    const repository = new InMemoryWalletAccountRepository([deleted, WALLET_ACCOUNT_AVAILABLE]);
    expect(await repository.getWalletAccount(EDC_CONNECTOR_PRODUCTION.id)).toEqual(WALLET_ACCOUNT_AVAILABLE);
  });

  it('reads the last deleted account when there is no other', async () => {
    const deleted = { ...WALLET_ACCOUNT_AVAILABLE, status: 'DELETED' as const };
    expect(await new InMemoryWalletAccountRepository([deleted]).getWalletAccount(EDC_CONNECTOR_PRODUCTION.id)).toEqual(deleted);
  });

  it('records its calls and does not change the fixtures', async () => {
    const repository = new InMemoryWalletAccountRepository([WALLET_ACCOUNT_AVAILABLE], [WALLET_ACCOUNT_CREDENTIALS]);
    await repository.retrieveCredentials(EDC_CONNECTOR_PRODUCTION.id);
    expect(repository.calls).toEqual([{ operation: 'retrieveCredentials', technicalUserId: EDC_CONNECTOR_PRODUCTION.id }]);
    expect(WALLET_ACCOUNT_AVAILABLE.credentialsState).toBe('AVAILABLE');
  });

  it('throws its failure on every call', async () => {
    const repository = new InMemoryWalletAccountRepository([WALLET_ACCOUNT_AVAILABLE], [], new Error('down'));
    await expect(repository.getWalletAccount(EDC_CONNECTOR_PRODUCTION.id)).rejects.toThrow('down');
    await expect(repository.retrieveCredentials(EDC_CONNECTOR_PRODUCTION.id)).rejects.toThrow('down');
  });
});
