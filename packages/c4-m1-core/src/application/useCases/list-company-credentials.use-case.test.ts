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
import { C4M1_TEST_COMPANY_IDS } from '../../domain/testing/c4-m1-test-ids.fixtures';
import { COMPANY_CREDENTIALS } from '../../domain/testing/company-credentials.fixtures';
import { InMemoryCompanyCredentialRepository } from '../../domain/testing/in-memory-company-credential.repository';
import { ListCompanyCredentialsUseCase } from './list-company-credentials.use-case';

const U1 = C4M1_TEST_COMPANY_IDS.beispielMaschinenbau;

describe('ListCompanyCredentialsUseCase', () => {
  it('returns the credentials of the own company', async () => {
    const repository = new InMemoryCompanyCredentialRepository({ [U1]: COMPANY_CREDENTIALS.requested });
    const result = await new ListCompanyCredentialsUseCase(repository).execute(U1);
    expect(result).toEqual({ status: 'found', credentials: COMPANY_CREDENTIALS.requested });
    expect(repository.calls).toEqual([U1]);
  });

  it('does not call the module for a person without a company', async () => {
    const repository = new InMemoryCompanyCredentialRepository({ [U1]: COMPANY_CREDENTIALS.issued });
    expect(await new ListCompanyCredentialsUseCase(repository).execute(null)).toEqual({ status: 'no-company' });
    expect(repository.calls).toEqual([]);
  });

  it('reports an unknown or foreign company as not-found', async () => {
    const result = await new ListCompanyCredentialsUseCase(new InMemoryCompanyCredentialRepository()).execute(U1);
    expect(result).toEqual({ status: 'not-found' });
  });

  it('reports a thrown 404 as not-found', async () => {
    const repository = new InMemoryCompanyCredentialRepository({}, c4m1Problem(404, 'not-found'));
    expect(await new ListCompanyCredentialsUseCase(repository).execute(U1)).toEqual({ status: 'not-found' });
  });

  it('reports a 403 as forbidden', async () => {
    const repository = new InMemoryCompanyCredentialRepository({}, c4m1Problem(403, 'forbidden'));
    expect(await new ListCompanyCredentialsUseCase(repository).execute(U1)).toEqual({ status: 'forbidden' });
  });

  it('reports every other error as data, with the Problem Details type', async () => {
    const repository = new InMemoryCompanyCredentialRepository({}, c4m1Problem(502, 'upstream-error'));
    expect(await new ListCompanyCredentialsUseCase(repository).execute(U1)).toEqual({
      status: 'failed',
      error: { status: 502, problemType: 'urn:c4-m1:problem:upstream-error', message: 'upstream-error' },
    });
  });

  it('reports a network error without a status as failed', async () => {
    const repository = new InMemoryCompanyCredentialRepository({}, new Error('network down'));
    expect(await new ListCompanyCredentialsUseCase(repository).execute(U1)).toEqual({
      status: 'failed',
      error: { status: null, problemType: null, message: 'network down' },
    });
  });
});
