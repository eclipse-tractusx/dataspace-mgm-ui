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
import { InMemoryCompanyRepository, OSP_A_COMPANY } from '../../domain/testing/in-memory-company.repository';
import { GetOwnCompanyUseCase } from './get-own-company.use-case';

describe('GetOwnCompanyUseCase', () => {
  it('returns the own company', async () => {
    const result = await new GetOwnCompanyUseCase(new InMemoryCompanyRepository([OSP_A_COMPANY])).execute(OSP_A_COMPANY.id);
    expect(result).toEqual({ status: 'found', company: OSP_A_COMPANY });
  });

  it('does not call the module for a person without a company', async () => {
    const repository = new InMemoryCompanyRepository([OSP_A_COMPANY]);
    expect(await new GetOwnCompanyUseCase(repository).execute(null)).toEqual({ status: 'no-company' });
    expect(repository.calls).toEqual([]);
  });

  it('reports a 404 as not-found', async () => {
    const result = await new GetOwnCompanyUseCase(new InMemoryCompanyRepository()).execute('c0000001-0000-4000-8000-000000000001');
    expect(result).toEqual({ status: 'not-found' });
  });

  it('reports every other error as data, with the Problem Details type', async () => {
    const failure = new CoreHttpException(403, 'urn:c3-m1:problem:forbidden', 'forbidden');
    const result = await new GetOwnCompanyUseCase(new InMemoryCompanyRepository([], failure)).execute(OSP_A_COMPANY.id);
    expect(result).toEqual({ status: 'failed', error: { status: 403, problemType: 'urn:c3-m1:problem:forbidden', message: 'forbidden' } });
  });
});
