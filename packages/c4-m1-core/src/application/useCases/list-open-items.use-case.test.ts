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
import { c4m1Problem } from '../../domain/testing/c4-m1-problem.fixtures';
import { C4M1_FIXTURES_NOW } from '../../domain/testing/c4-m1-test-ids.fixtures';
import {
  CREDENTIALS_OF_ALL_COMPANIES,
  FAILED_CREDENTIAL,
  OVERDUE_REQUESTED_CREDENTIAL,
  REQUESTED_CREDENTIAL,
  REVOCATION_PENDING_CREDENTIAL,
} from '../../domain/testing/credentials.fixtures';
import { InMemoryCredentialRepository } from '../../domain/testing/in-memory-credential.repository';
import { ListOpenItemsUseCase } from './list-open-items.use-case';

const clock = () => new Date(C4M1_FIXTURES_NOW);

describe('ListOpenItemsUseCase', () => {
  it('joins failed, pending revocations and orders open for more than 24 hours, newest change first', async () => {
    const repository = new InMemoryCredentialRepository(CREDENTIALS_OF_ALL_COMPANIES);
    const result = await new ListOpenItemsUseCase(repository, { clock }).execute();
    expect(result).toEqual({
      status: 'found',
      items: [REVOCATION_PENDING_CREDENTIAL, FAILED_CREDENTIAL, OVERDUE_REQUESTED_CREDENTIAL],
      total: 3,
      requestedBefore: '2026-11-05T12:00:00.000Z',
      openOrderHours: 24,
      openOrders: { status: ['REQUESTED'], requestedBefore: '2026-11-05T12:00:00.000Z' },
    });
    expect(repository.calls).toEqual([
      { method: 'listCredentials', query: { page: 0, size: 100, status: ['FAILED'] } },
      { method: 'listCredentials', query: { page: 0, size: 100, status: ['REVOCATION_PENDING'] } },
      {
        method: 'listCredentials',
        query: { page: 0, size: 100, status: ['REQUESTED'], requestedBefore: '2026-11-05T12:00:00.000Z' },
      },
    ]);
  });

  it('takes the age of an open order from the options', async () => {
    const repository = new InMemoryCredentialRepository(CREDENTIALS_OF_ALL_COMPANIES);
    const result = await new ListOpenItemsUseCase(repository, { clock, openOrderHours: 1 }).execute();
    expect(result.status === 'found' && result.items).toContainEqual(REQUESTED_CREDENTIAL);
    expect(result.status === 'found' && result.total).toBe(5);
  });

  it('uses the real time and 24 hours by default', async () => {
    const result = await new ListOpenItemsUseCase(new InMemoryCredentialRepository()).execute();
    expect(result).toMatchObject({ status: 'found', items: [], total: 0, openOrderHours: 24 });
  });

  it('reports a 403 as forbidden', async () => {
    const repository = new InMemoryCredentialRepository([], c4m1Problem(403, 'forbidden'));
    expect(await new ListOpenItemsUseCase(repository, { clock }).execute()).toEqual({ status: 'forbidden' });
  });

  it('reports every other error as failed', async () => {
    const repository = new InMemoryCredentialRepository([], c4m1Problem(502, 'upstream-error'));
    const result = await new ListOpenItemsUseCase(repository, { clock }).execute();
    expect(result).toEqual({
      status: 'failed',
      error: { status: 502, problemType: 'urn:c4-m1:problem:upstream-error', message: 'upstream-error' },
    });
  });
});
