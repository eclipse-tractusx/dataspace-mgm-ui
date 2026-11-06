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
  BEISPIEL_MASCHINENBAU_WALLET,
  BEISPIEL_MASCHINENBAU_WALLET_FAILED,
  BEISPIEL_MASCHINENBAU_WALLET_VALIDATING,
} from '../../domain/testing/c4-m2.fixtures';
import { InMemoryWalletRepository } from '../../domain/testing/in-memory-wallet.repository';
import { GetOwnWalletUseCase } from './get-own-wallet.use-case';

describe('GetOwnWalletUseCase', () => {
  it('returns the active wallet of the own company', async () => {
    const result = await new GetOwnWalletUseCase(new InMemoryWalletRepository([BEISPIEL_MASCHINENBAU_WALLET])).execute(
      BEISPIEL_MASCHINENBAU_COMPANY_ID,
    );
    expect(result).toEqual({ status: 'found', wallet: BEISPIEL_MASCHINENBAU_WALLET });
  });

  it.each([BEISPIEL_MASCHINENBAU_WALLET_VALIDATING, BEISPIEL_MASCHINENBAU_WALLET_FAILED])(
    'returns a wallet in status $status as found, the status is data',
    async (wallet) => {
      const result = await new GetOwnWalletUseCase(new InMemoryWalletRepository([wallet])).execute(BEISPIEL_MASCHINENBAU_COMPANY_ID);
      expect(result).toEqual({ status: 'found', wallet });
    },
  );

  it('does not call the module for a person without a company', async () => {
    const repository = new InMemoryWalletRepository([BEISPIEL_MASCHINENBAU_WALLET]);
    expect(await new GetOwnWalletUseCase(repository).execute(null)).toEqual({ status: 'no-company' });
    expect(repository.calls).toEqual([]);
  });

  it('reports a 404 as no-wallet', async () => {
    const repository = new InMemoryWalletRepository();
    expect(await new GetOwnWalletUseCase(repository).execute(BEISPIEL_MASCHINENBAU_COMPANY_ID)).toEqual({ status: 'no-wallet' });
    expect(repository.calls).toEqual([BEISPIEL_MASCHINENBAU_COMPANY_ID]);
  });

  it('reports a 403 as forbidden', async () => {
    const failure = new CoreHttpException(403, 'urn:c4-m2:problem:forbidden', 'forbidden');
    const result = await new GetOwnWalletUseCase(new InMemoryWalletRepository([], failure)).execute(BEISPIEL_MASCHINENBAU_COMPANY_ID);
    expect(result).toEqual({ status: 'forbidden' });
  });

  it('reports every other error as data, with the Problem Details type', async () => {
    const failure = new CoreHttpException(502, 'urn:c4-m2:problem:upstream-error', 'upstream');
    const result = await new GetOwnWalletUseCase(new InMemoryWalletRepository([], failure)).execute(BEISPIEL_MASCHINENBAU_COMPANY_ID);
    expect(result).toEqual({ status: 'failed', error: { status: 502, problemType: 'urn:c4-m2:problem:upstream-error', message: 'upstream' } });
  });
});
