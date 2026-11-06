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
import { C4M2_PROBLEM } from '../../domain/constants/c4-m2-problem.constant';
import type { WalletAccountAnemic } from '../../domain/anemics/wallet-account.anemic';
import {
  EDC_CONNECTOR_PRODUCTION,
  EDC_CONNECTOR_TEST,
  WALLET_ACCOUNT_AVAILABLE,
  WALLET_ACCOUNT_CREDENTIALS,
  WALLET_ACCOUNT_RETRIEVED,
} from '../../domain/testing/c4-m2.fixtures';
import { InMemoryWalletAccountRepository } from '../../domain/testing/in-memory-wallet-account.repository';
import { RetrieveWalletAccountCredentialsUseCase } from './retrieve-wallet-account-credentials.use-case';

const retrieve = (accounts: ReadonlyArray<WalletAccountAnemic>, technicalUserId = EDC_CONNECTOR_PRODUCTION.id) =>
  new RetrieveWalletAccountCredentialsUseCase(new InMemoryWalletAccountRepository(accounts, [WALLET_ACCOUNT_CREDENTIALS])).execute(
    technicalUserId,
  );

const failingWith = (failure: Error) =>
  new RetrieveWalletAccountCredentialsUseCase(new InMemoryWalletAccountRepository([], [], failure)).execute(EDC_CONNECTOR_PRODUCTION.id);

describe('RetrieveWalletAccountCredentialsUseCase', () => {
  it('hands the credentials out once, a second call is already-retrieved', async () => {
    const repository = new InMemoryWalletAccountRepository([WALLET_ACCOUNT_AVAILABLE], [WALLET_ACCOUNT_CREDENTIALS]);
    const useCase = new RetrieveWalletAccountCredentialsUseCase(repository);
    expect(await useCase.execute(EDC_CONNECTOR_PRODUCTION.id)).toEqual({ status: 'retrieved', credentials: WALLET_ACCOUNT_CREDENTIALS });
    expect(await useCase.execute(EDC_CONNECTOR_PRODUCTION.id)).toEqual({ status: 'already-retrieved' });
    expect(await repository.getWalletAccount(EDC_CONNECTOR_PRODUCTION.id)).toMatchObject({
      credentialsState: 'RETRIEVED',
      credentialsExpireAt: null,
    });
  });

  it('reports an account retrieved before as already-retrieved (410)', async () => {
    expect(await retrieve([WALLET_ACCOUNT_RETRIEVED], EDC_CONNECTOR_TEST.id)).toEqual({ status: 'already-retrieved' });
  });

  it('reports credentials deleted after the deadline as expired (410)', async () => {
    expect(await retrieve([{ ...WALLET_ACCOUNT_AVAILABLE, credentialsState: 'EXPIRED', credentialsExpireAt: null }])).toEqual({
      status: 'expired',
    });
  });

  it('reports an account without credentials as no-credentials (409)', async () => {
    expect(await retrieve([{ ...WALLET_ACCOUNT_AVAILABLE, credentialsState: 'NONE', credentialsExpireAt: null }])).toEqual({
      status: 'no-credentials',
    });
  });

  it('reports an account that is not active as invalid-state (409)', async () => {
    expect(await retrieve([{ ...WALLET_ACCOUNT_AVAILABLE, status: 'REQUESTED' }])).toEqual({ status: 'invalid-state' });
  });

  it('reports an unknown technical user as not-found', async () => {
    expect(await retrieve([])).toEqual({ status: 'not-found' });
  });

  it('reports a 404 thrown by the adapter as not-found', async () => {
    expect(await failingWith(new CoreHttpException(404, C4M2_PROBLEM.notFound, 'not found'))).toEqual({ status: 'not-found' });
  });

  it('reports a 403 as forbidden', async () => {
    expect(await failingWith(new CoreHttpException(403, C4M2_PROBLEM.forbidden, 'forbidden'))).toEqual({ status: 'forbidden' });
  });

  it.each([
    [409, 'urn:c4-m2:problem:conflict'],
    [410, 'urn:c4-m2:problem:challenge-expired'],
    [500, null],
  ])('reports %i %s as failed, with the Problem Details type', async (status, problemType) => {
    expect(await failingWith(new CoreHttpException(status, problemType, 'other'))).toEqual({
      status: 'failed',
      error: { status, problemType, message: 'other' },
    });
  });
});
