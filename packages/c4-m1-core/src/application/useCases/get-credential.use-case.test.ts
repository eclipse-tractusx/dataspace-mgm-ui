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
import { CREDENTIALS_OF_ALL_COMPANIES, FAILED_CREDENTIAL } from '../../domain/testing/credentials.fixtures';
import { InMemoryCredentialRepository } from '../../domain/testing/in-memory-credential.repository';
import { GetCredentialUseCase } from './get-credential.use-case';

describe('GetCredentialUseCase', () => {
  it('returns the credential', async () => {
    const repository = new InMemoryCredentialRepository(CREDENTIALS_OF_ALL_COMPANIES);
    const result = await new GetCredentialUseCase(repository).execute(FAILED_CREDENTIAL.id);
    expect(result).toEqual({ status: 'found', credential: FAILED_CREDENTIAL });
    expect(repository.calls).toEqual([{ method: 'getCredential', credentialId: FAILED_CREDENTIAL.id }]);
  });

  it('reports an unknown credential as not-found', async () => {
    const result = await new GetCredentialUseCase(new InMemoryCredentialRepository()).execute(FAILED_CREDENTIAL.id);
    expect(result).toEqual({ status: 'not-found' });
  });

  it('reports a thrown 404 as not-found', async () => {
    const repository = new InMemoryCredentialRepository([], c4m1Problem(404, 'not-found'));
    expect(await new GetCredentialUseCase(repository).execute(FAILED_CREDENTIAL.id)).toEqual({ status: 'not-found' });
  });

  it('reports a 403 as forbidden', async () => {
    const repository = new InMemoryCredentialRepository([], c4m1Problem(403, 'forbidden'));
    expect(await new GetCredentialUseCase(repository).execute(FAILED_CREDENTIAL.id)).toEqual({ status: 'forbidden' });
  });

  it('reports every other error as failed', async () => {
    const repository = new InMemoryCredentialRepository([], c4m1Problem(502, 'upstream-error'));
    const result = await new GetCredentialUseCase(repository).execute(FAILED_CREDENTIAL.id);
    expect(result).toEqual({
      status: 'failed',
      error: { status: 502, problemType: 'urn:c4-m1:problem:upstream-error', message: 'upstream-error' },
    });
  });
});
