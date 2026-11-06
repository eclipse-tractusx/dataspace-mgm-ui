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
import { CREDENTIALS_OF_ALL_COMPANIES } from '../../domain/testing/credentials.fixtures';
import { InMemoryCredentialRepository } from '../../domain/testing/in-memory-credential.repository';
import { CountCredentialsByStatusUseCase } from './count-credentials-by-status.use-case';

describe('CountCredentialsByStatusUseCase', () => {
  it('counts per status with one listCredentials call of size 1 each', async () => {
    const repository = new InMemoryCredentialRepository(CREDENTIALS_OF_ALL_COMPANIES);
    const result = await new CountCredentialsByStatusUseCase(repository).execute([
      'REQUESTED',
      'FAILED',
      'REVOCATION_PENDING',
      'ISSUED',
      'CANCELLED',
    ]);
    expect(result).toEqual({
      status: 'found',
      counts: [
        { status: 'REQUESTED', total: 3 },
        { status: 'FAILED', total: 1 },
        { status: 'REVOCATION_PENDING', total: 1 },
        { status: 'ISSUED', total: 11 },
        { status: 'CANCELLED', total: 0 },
      ],
    });
    expect(repository.calls[0]).toEqual({ method: 'listCredentials', query: { status: ['REQUESTED'], page: 0, size: 1 } });
    expect(repository.calls).toHaveLength(5);
  });

  it('returns no counts without a call for no status', async () => {
    const repository = new InMemoryCredentialRepository(CREDENTIALS_OF_ALL_COMPANIES);
    expect(await new CountCredentialsByStatusUseCase(repository).execute([])).toEqual({ status: 'found', counts: [] });
    expect(repository.calls).toEqual([]);
  });

  it('reports a 403 as forbidden', async () => {
    const repository = new InMemoryCredentialRepository([], c4m1Problem(403, 'forbidden'));
    expect(await new CountCredentialsByStatusUseCase(repository).execute(['FAILED'])).toEqual({ status: 'forbidden' });
  });

  it('reports every other error as failed', async () => {
    const repository = new InMemoryCredentialRepository([], c4m1Problem(502, 'upstream-error'));
    const result = await new CountCredentialsByStatusUseCase(repository).execute(['FAILED']);
    expect(result.status).toBe('failed');
  });
});
