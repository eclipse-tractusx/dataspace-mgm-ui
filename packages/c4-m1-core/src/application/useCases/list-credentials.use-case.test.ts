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
import { ListCredentialsUseCase } from './list-credentials.use-case';

describe('ListCredentialsUseCase', () => {
  it('returns one page of the credentials of all companies', async () => {
    const repository = new InMemoryCredentialRepository(CREDENTIALS_OF_ALL_COMPANIES);
    const result = await new ListCredentialsUseCase(repository).execute({ page: 0, size: 10 });
    expect(result.status).toBe('found');
    if (result.status === 'found') {
      expect(result.page.total).toBe(16);
      expect(result.page.items).toEqual(CREDENTIALS_OF_ALL_COMPANIES.slice(0, 10));
    }
    expect(repository.calls).toEqual([{ method: 'listCredentials', query: { page: 0, size: 10 } }]);
  });

  it('passes the filters to the module', async () => {
    const result = await new ListCredentialsUseCase(new InMemoryCredentialRepository(CREDENTIALS_OF_ALL_COMPANIES)).execute({
      status: ['FAILED', 'REVOCATION_PENDING'],
      page: 0,
      size: 20,
    });
    expect(result.status === 'found' && result.page.items.map((item) => item.status)).toEqual(['REVOCATION_PENDING', 'FAILED']);
  });

  it('reports a 400 as invalid', async () => {
    const result = await new ListCredentialsUseCase(new InMemoryCredentialRepository()).execute({ page: 0, size: 500 });
    expect(result).toEqual({
      status: 'invalid',
      error: { status: 400, problemType: 'urn:c4-m1:problem:validation', message: 'page or size out of range' },
    });
  });

  it('reports a 403 as forbidden', async () => {
    const repository = new InMemoryCredentialRepository([], c4m1Problem(403, 'forbidden'));
    expect(await new ListCredentialsUseCase(repository).execute({ page: 0, size: 20 })).toEqual({ status: 'forbidden' });
  });

  it('reports every other error as failed', async () => {
    const repository = new InMemoryCredentialRepository([], c4m1Problem(502, 'upstream-error'));
    const result = await new ListCredentialsUseCase(repository).execute({ page: 0, size: 20 });
    expect(result).toEqual({
      status: 'failed',
      error: { status: 502, problemType: 'urn:c4-m1:problem:upstream-error', message: 'upstream-error' },
    });
  });
});
